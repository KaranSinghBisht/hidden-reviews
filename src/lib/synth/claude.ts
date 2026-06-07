import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, SYNTH_MODEL } from "@/lib/llm/client";
import type { NimbleResult } from "@/lib/nimble/client";

const sentiment = z.enum(["positive", "mixed", "negative"]);

/**
 * What Claude returns. Buried reviews reference a source by INDEX into the
 * gathered results — we rebuild the real URL/name in code so URLs are never
 * fabricated by the model.
 */
const SynthSchema = z.object({
  verdict: z.string(),
  overallSentiment: sentiment,
  trustScore: z.number(),
  hiddenInsights: z.array(
    z.object({
      point: z.string(),
      supportCount: z.number(),
      sentiment,
    }),
  ),
  buriedReviews: z.array(
    z.object({
      sourceIndex: z.number(),
      quote: z.string(),
      sentiment,
      buriedReasons: z.array(
        z.enum([
          "low_search_rank",
          "candid_community",
          "contrarian",
          "downvoted_or_old",
          "niche_source",
        ]),
      ),
    }),
  ),
  sentimentGaps: z.array(
    z.object({
      marketingClaim: z.string(),
      realityFinding: z.string(),
      gapScore: z.number(),
    }),
  ),
});

export type SynthOutput = z.infer<typeof SynthSchema>;

const SYSTEM = `You are hidden.reviews. Your job: cut past the polished, SEO-optimised, top-of-search marketing and surface the honest, buried truth real people report about a product, place, company, restaurant, or movie.

You are given sources a research agent gathered from the live web across several targeted searches (candid communities like Reddit, review sites like Trustpilot/Yelp, forums, and long-form review blogs). Some include the FULL page text; others are snippets. Analyse them and produce an honest verdict.

Rules:
- Be fair and balanced — surface genuine positives as well as the buried negatives. You are honest, not a hit piece.
- Cite sources ONLY by their [index]. Never invent a source, quote, URL, or fact the provided material does not support.
- "Buried" means candid, low-visibility, or against-the-marketing-narrative content a normal searcher would miss — not just anything negative.
- Prefer quotes from the full-text sources; ground every quote in the provided material and paraphrase tightly if needed, never fabricate specifics.
- trustScore is 0-100: how much a buyer should trust the marketed promise given the real-world reports.
- Be concise so the response is fast: at most 6 buried reviews, at most 4 hidden insights, at most 3 sentiment gaps. Verdict under 60 words; each quote under 30 words.`;

/** Full text when we have it (capped), else the snippet. */
function sourceBlock(s: NimbleResult, i: number): string {
  const body = s.content ? s.content.slice(0, 2000) : s.snippet;
  return `[${i}] ${s.title}\n${body}\n(${s.url})`;
}

export async function synthesize(
  query: string,
  sources: NimbleResult[],
): Promise<SynthOutput> {
  // Bounded so synthesis fails fast (the agent falls back) instead of
  // blowing past the platform timeout. The agent already retried searches.
  const client = anthropic(28_000, 0);

  const numbered = sources.map((s, i) => sourceBlock(s, i)).join("\n\n");

  const user = `Query: "${query}"

Sources the agent gathered from the live web (some full-text, some snippets):

${numbered}

Produce the honest verdict for "${query}". Surface the buried reviews (by source index), the things the marketing doesn't tell you, and where the marketing diverges from reality.`;

  const response = await client.messages.parse({
    model: SYNTH_MODEL,
    max_tokens: 2500,
    system: SYSTEM,
    messages: [{ role: "user", content: user }],
    output_config: { format: zodOutputFormat(SynthSchema), effort: "low" },
  });

  if (!response.parsed_output) {
    throw new Error("Synthesis returned no structured output.");
  }
  return response.parsed_output;
}
