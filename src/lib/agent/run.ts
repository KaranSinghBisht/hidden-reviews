import type {
  AgentStep,
  BuriedReview,
  DigResult,
  SourceKind,
} from "@/lib/types";
import { planSearches } from "@/lib/agent/plan";
import { gather, type GatheredSource } from "@/lib/agent/gather";
import { synthesize, type SynthOutput } from "@/lib/synth/claude";

export type TraceFn = (steps: AgentStep[]) => void;

/** Best-effort source classification from the URL. */
function sourceKindFromUrl(url: string): SourceKind {
  const u = url.toLowerCase();
  if (u.includes("reddit.com")) return "reddit";
  if (u.includes("trustpilot.")) return "trustpilot";
  if (u.includes("yelp.")) return "yelp";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("ycombinator.com") || u.includes("forum") || u.includes("community")) {
    return "forum";
  }
  if (u.includes("news") || u.includes("bbc.") || u.includes("nytimes.")) return "news";
  return "blog";
}

function hostName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Content-rich sources first (more to quote), capped for the synth budget. */
function rankSources(sources: GatheredSource[]): GatheredSource[] {
  const withContent = sources.filter((s) => s.content);
  const without = sources.filter((s) => !s.content);
  return [...withContent, ...without].slice(0, 14);
}

function mapBuried(synth: SynthOutput, sources: GatheredSource[]): BuriedReview[] {
  return synth.buriedReviews
    .filter((b) => b.sourceIndex >= 0 && b.sourceIndex < sources.length)
    .map((b) => {
      const src = sources[b.sourceIndex];
      return {
        quote: b.quote,
        sourceKind: sourceKindFromUrl(src.url),
        sourceName: hostName(src.url),
        url: src.url,
        sentiment: b.sentiment,
        buriedReasons: b.buriedReasons,
      };
    });
}

/**
 * The research agent: plan angles → run targeted live-web searches in
 * parallel → read the real content → write the honest verdict. Emits a trace
 * of its steps so the UI can show its work. Degrades gracefully: if synthesis
 * can't finish, it returns the raw buried sources rather than a 500.
 */
export async function runDigAgent(
  query: string,
  onTrace: TraceFn = () => {},
): Promise<DigResult> {
  const steps: AgentStep[] = [];
  const sync = () => onTrace(steps.map((s) => ({ ...s })));
  const start = (label: string, detail?: string): AgentStep => {
    const s: AgentStep = { label, detail, status: "running" };
    steps.push(s);
    sync();
    return s;
  };
  const finish = (s: AgentStep, detail?: string) => {
    s.status = "done";
    if (detail !== undefined) s.detail = detail;
    sync();
  };

  // 1) Plan the angles (the agent's reasoning step).
  const sp = start("Planning research angles");
  const specs = await planSearches(query);
  finish(sp, specs.map((s) => s.label).join(" · "));

  // 2) Gather — run every targeted search in parallel.
  const gatherLabel = specs
    .map((s) => (s.depth === "deep" ? `${s.label} (deep)` : s.label))
    .join(" · ");
  const sg = start("Searching the live web", gatherLabel);
  const sources = await gather(specs);
  if (sources.length === 0) {
    throw new Error("No live sources found for that query.");
  }
  finish(sg, `${sources.length} candid sources from ${specs.length} searches`);

  // 3) Read the real content and write the verdict.
  const top = rankSources(sources);
  const richCount = top.filter((s) => s.content).length;
  const ss = start(
    "Reading sources & writing the honest verdict",
    `${top.length} sources${richCount ? `, ${richCount} full-text` : ""}`,
  );

  let synth: SynthOutput;
  try {
    synth = await synthesize(query, top);
  } catch {
    finish(ss, "deep read timed out — showing the raw buried sources");
    return sourcesOnly(query, sources, specs.length, steps);
  }
  finish(ss);

  return {
    query: query.trim(),
    verdict: synth.verdict,
    overallSentiment: synth.overallSentiment,
    trustScore: clamp(synth.trustScore),
    hiddenInsights: synth.hiddenInsights,
    buriedReviews: mapBuried(synth, top),
    sentimentGaps: synth.sentimentGaps,
    sourcesScanned: sources.length,
    searchesRun: specs.length,
    agentSteps: steps.map((s) => ({ ...s, status: "done" as const })),
    generatedAt: new Date().toISOString(),
    usedMock: false,
  };
}

/** Degraded-but-honest result: real candid sources, no fabricated analysis. */
function sourcesOnly(
  query: string,
  sources: GatheredSource[],
  searchesRun: number,
  steps: AgentStep[],
): DigResult {
  const buriedReviews: BuriedReview[] = sources.slice(0, 6).map((src) => ({
    quote: (src.content || src.snippet || src.title).slice(0, 220),
    sourceKind: sourceKindFromUrl(src.url),
    sourceName: hostName(src.url),
    url: src.url,
    sentiment: "mixed",
    buriedReasons: ["candid_community"],
  }));

  return {
    query: query.trim(),
    verdict: `The agent pulled ${sources.length} candid sources from the live web across ${searchesRun} targeted searches for "${query.trim()}", but the deep read is taking longer than usual right now. Here are the raw buried sources — open them directly.`,
    overallSentiment: "mixed",
    trustScore: 50,
    hiddenInsights: [],
    buriedReviews,
    sentimentGaps: [],
    sourcesScanned: sources.length,
    searchesRun,
    agentSteps: steps.map((s) => ({ ...s, status: "done" as const })),
    generatedAt: new Date().toISOString(),
    usedMock: false,
  };
}
