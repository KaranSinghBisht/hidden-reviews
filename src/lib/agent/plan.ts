import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, SYNTH_MODEL } from "@/lib/llm/client";

/** One planned search the agent will run against Nimble. */
export interface SearchSpec {
  label: string;
  query: string;
  includeDomains?: string[];
  /** Defaults to "lite" (fast snippets); the agent favours breadth. */
  depth?: "lite" | "deep";
}

const PlanSchema = z.object({
  subjectType: z.enum([
    "product",
    "place",
    "restaurant",
    "movie_or_show",
    "company",
    "service",
    "other",
  ]),
  searches: z
    .array(
      z.object({
        label: z.string(),
        query: z.string(),
        includeDomains: z.array(z.string()).optional(),
      }),
    )
    .min(4)
    .max(5),
});

const SYSTEM = `You plan web research to surface the HONEST, BURIED opinions about something — the candid takes real people leave in communities, on review sites, and in long-form reviews that polished top-of-search pages hide.

Given a subject, output 4-5 web searches, each a DISTINCT angle / source type. Be BALANCED: seek genuine praise and genuine criticism, not just complaints. Tailor the angles to what the subject IS:
- product / gadget → Reddit candid threads, Trustpilot or Sitejabber, long-term "after N months" review blogs, enthusiast communities
- restaurant / place → Reddit local & city subs, Yelp, candid blog write-ups, local-news roundups
- movie / show → Letterboxd, the relevant Reddit sub, audience (not professional-critic) reviews, fan forums
- company / service → Reddit, Trustpilot, customer-experience forums, employee/customer complaint threads

Rules:
- Write NATURAL search queries. Do NOT bolt on "complaints problems" — let the angle and target domain do the work, and keep queries neutral enough to surface BOTH sides.
- Use includeDomains to target specific sites, e.g. ["reddit.com"], ["trustpilot.com","sitejabber.com"], ["letterboxd.com"], ["yelp.com"].
- Make each of the 4-5 searches a genuinely different angle — different communities, different source types, different facets (reliability, value, long-term, support).`;

/**
 * Ask the model to reason about the subject and design a multi-angle search
 * plan. This is the agent's "thinking" step — adaptive, not templated.
 * Falls back to a sensible default plan if the model call fails.
 */
export async function planSearches(query: string): Promise<SearchSpec[]> {
  try {
    const client = anthropic(15_000, 1);
    const res = await client.messages.parse({
      model: SYNTH_MODEL,
      max_tokens: 900,
      system: SYSTEM,
      messages: [
        { role: "user", content: `Subject: "${query}"\n\nPlan the searches.` },
      ],
      output_config: { format: zodOutputFormat(PlanSchema), effort: "low" },
    });
    const plan = res.parsed_output;
    if (plan?.searches?.length) return plan.searches;
  } catch {
    // fall through to the default plan
  }
  return defaultPlan(query);
}

/** A solid generic plan when the planner is unavailable. */
function defaultPlan(query: string): SearchSpec[] {
  return [
    {
      label: "Reddit — candid threads",
      query: `${query} review experience`,
      includeDomains: ["reddit.com"],
    },
    {
      label: "Review sites",
      query: `${query} reviews`,
      includeDomains: ["trustpilot.com", "sitejabber.com", "consumeraffairs.com"],
    },
    {
      label: "Long-term & in-depth",
      query: `${query} long term honest review`,
    },
    {
      label: "Forums & communities",
      query: `${query} worth it problems`,
    },
  ];
}
