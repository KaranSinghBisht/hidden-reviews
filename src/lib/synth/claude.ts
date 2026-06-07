import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { env } from "@/lib/env";
import type { NimbleResult } from "@/lib/nimble/client";

/** Default to the most capable model; allow an override for speed/cost. */
const MODEL = process.env.ANTHROPIC_MODEL?.trim() || "claude-opus-4-8";

const sentiment = z.enum(["positive", "mixed", "negative"]);

/**
 * What Claude returns. Buried reviews reference a source by INDEX into the
 * Nimble results — we rebuild the real URL/name in code so URLs are never
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

const SYSTEM = `You are hidden.reviews. Your job: cut past the polished, SEO-optimised, top-of-search marketing and surface the honest, buried truth real people report about a product, place, or company.

You are given live-web search results (candid communities like Reddit, review sites like Trustpilot/Yelp, forums, and blogs). Analyse them and produce an honest verdict.

Rules:
- Be fair and balanced — surface genuine positives as well as the buried negatives. You are honest, not a hit piece.
- Cite sources ONLY by their [index]. Never invent a source, quote, URL, or fact that the provided material does not support.
- "Buried" means candid, low-visibility, or against-the-marketing-narrative content a normal searcher would miss — not just anything negative.
- trustScore is 0-100: how much a buyer should trust the marketed promise given the real-world reports.
- Quotes must be grounded in the provided snippets; paraphrase tightly if needed, never fabricate specifics.
- Be concise so the response is fast: at most 5 buried reviews, at most 4 hidden insights, at most 3 sentiment gaps. Verdict under 55 words; each quote under 30 words.`;

export async function synthesize(
  query: string,
  sources: NimbleResult[],
): Promise<SynthOutput> {
  // Bound the call: a slow/overloaded API should fail in ~45s, not hang for
  // minutes on the SDK's 10-minute default. Retry transient errors twice.
  const client = new Anthropic({
    apiKey: env.anthropicApiKey,
    timeout: 35_000,
    maxRetries: 1,
  });

  const numbered = sources
    .map((s, i) => `[${i}] ${s.title}\n${s.snippet}\n(${s.url})`)
    .join("\n\n");

  const user = `Query: "${query}"

Live-web sources found:

${numbered}

Produce the honest verdict for "${query}". Surface the buried reviews (by source index), the things the marketing doesn't tell you, and where the marketing diverges from reality.`;

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    messages: [{ role: "user", content: user }],
    output_config: { format: zodOutputFormat(SynthSchema), effort: "low" },
  });

  if (!response.parsed_output) {
    throw new Error("Synthesis returned no structured output.");
  }
  return response.parsed_output;
}
