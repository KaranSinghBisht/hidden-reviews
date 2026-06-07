import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, SYNTH_MODEL } from "@/lib/llm/client";
import type { GatheredSource } from "./gather";

const AssessSchema = z.object({
  /** One short phrase naming the biggest gap, e.g. "long-term reliability". */
  coverageNote: z.string(),
  /** A focused query to fill that gap with in-depth, long-form content. */
  deepQuery: z.string(),
});

export type Assessment = z.infer<typeof AssessSchema>;

/**
 * The agent's feedback step: review what the parallel searches surfaced, name
 * the biggest coverage gap, and craft ONE focused query to fill it with a deep,
 * full-content read. This is what makes the agent loop (observe → decide → act
 * again) instead of running a single fixed pass. Returns null on failure.
 */
export async function assess(
  query: string,
  sources: GatheredSource[],
): Promise<Assessment | null> {
  try {
    const client = anthropic(15_000, 1);
    const list = sources
      .slice(0, 28)
      .map((s, i) => `[${i}] (${s.via}) ${s.title}`)
      .join("\n");

    const res = await client.messages.parse({
      model: SYNTH_MODEL,
      max_tokens: 400,
      system: `You are a research agent reviewing the sources gathered so far about a subject. Find the single most important GAP — a facet, angle, or perspective that is thin or missing (e.g. long-term reliability, a specific failure mode, the counter-narrative, value-for-money) — and craft ONE focused search query to fill it with in-depth, long-form content. The query should be natural, specific, and likely to surface a detailed article or write-up (not a forum thread).`,
      messages: [
        {
          role: "user",
          content: `Subject: "${query}"\n\nSources gathered so far:\n${list}\n\nName the biggest coverage gap in one short phrase, and the single deep search to fill it.`,
        },
      ],
      output_config: { format: zodOutputFormat(AssessSchema), effort: "low" },
    });
    return res.parsed_output ?? null;
  } catch {
    return null;
  }
}
