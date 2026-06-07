import type { BuriedReview, DigResult, SourceKind } from "@/lib/types";
import { nimbleSearch } from "@/lib/nimble/client";
import { synthesize } from "@/lib/synth/claude";

/** Best-effort source classification from the URL. */
function sourceKindFromUrl(url: string): SourceKind {
  const u = url.toLowerCase();
  if (u.includes("reddit.com")) return "reddit";
  if (u.includes("trustpilot.")) return "trustpilot";
  if (u.includes("yelp.")) return "yelp";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (
    u.includes("ycombinator.com") ||
    u.includes("forum") ||
    u.includes("community")
  ) {
    return "forum";
  }
  if (u.includes("news") || u.includes("bbc.") || u.includes("nytimes."))
    return "news";
  return "blog";
}

function hostName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

/**
 * Live mode: Nimble searches the live web → Claude synthesises the honest
 * verdict. URLs come from the real Nimble results (joined by source index),
 * so nothing is fabricated.
 */
export async function liveDig(query: string): Promise<DigResult> {
  const results = await nimbleSearch(query);
  if (results.length === 0) {
    throw new Error("No live sources found for that query.");
  }

  const synth = await synthesize(query, results);

  const buriedReviews: BuriedReview[] = synth.buriedReviews
    .filter((b) => b.sourceIndex >= 0 && b.sourceIndex < results.length)
    .map((b) => {
      const src = results[b.sourceIndex];
      return {
        quote: b.quote,
        sourceKind: sourceKindFromUrl(src.url),
        sourceName: hostName(src.url),
        url: src.url,
        sentiment: b.sentiment,
        buriedReasons: b.buriedReasons,
        // Position in the live result set — the honest "buried at #N" proof.
        rank: b.sourceIndex + 1,
      };
    });

  return {
    query: query.trim(),
    verdict: synth.verdict,
    overallSentiment: synth.overallSentiment,
    trustScore: Math.max(0, Math.min(100, Math.round(synth.trustScore))),
    hiddenInsights: synth.hiddenInsights,
    buriedReviews,
    sentimentGaps: synth.sentimentGaps,
    sourcesScanned: results.length,
    generatedAt: new Date().toISOString(),
    usedMock: false,
  };
}
