import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, SYNTH_MODEL } from "@/lib/llm/client";

/** One planned search the agent will run against Nimble. */
export interface SearchSpec {
  label: string;
  query: string;
  includeDomains?: string[];
  /** True for the one angle that should fetch FULL page content (Nimble deep). */
  deep?: boolean;
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
        deep: z.boolean().optional(),
      }),
    )
    .min(4)
    .max(5),
});

const SYSTEM = `You plan web research to surface the HONEST, BURIED opinions about something — the candid takes real people leave in communities, on review sites, and in long-form reviews that polished top-of-search pages hide.

Given a subject, output 4-5 web searches, each a DISTINCT angle / source type. Be BALANCED: seek genuine praise and genuine criticism, not just complaints. Tailor the angles to what the subject IS:
- product / gadget → Reddit candid threads, Amazon customer-review pages, Trustpilot or Sitejabber, long-term "after N months" review blogs, YouTube reviews, enthusiast communities
- restaurant / place → Reddit local & city subs, Yelp, TripAdvisor, candid blog write-ups, local-news roundups
- movie / show → Letterboxd, IMDb user reviews, Metacritic user reviews, the relevant Reddit sub, fan forums
- company / service → Reddit, Trustpilot, Glassdoor (what employees say), G2 or Capterra for software, customer-experience forums, complaint threads
- be creative beyond these lists when the subject calls for it (e.g. Untappd for a brewery, Goodreads for a book).

Rules:
- Write NATURAL search queries. Do NOT bolt on "complaints problems" — let the angle and target domain do the work, and keep queries neutral enough to surface BOTH sides.
- Use includeDomains to target specific sites, e.g. ["reddit.com"], ["amazon.com"], ["trustpilot.com","sitejabber.com"], ["letterboxd.com","imdb.com"], ["yelp.com","tripadvisor.com"], ["glassdoor.com"], ["g2.com","capterra.com"].
- Set deep: true on EXACTLY ONE angle — the one whose results are long-form, scrape-friendly pages (review blogs, magazine reviews, editorial write-ups). Its full page text will be extracted. NEVER mark reddit, amazon, or social sites deep (they block scrapers); leave deep off domain-restricted community angles.
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
      deep: true,
    },
    {
      label: "Forums & communities",
      query: `${query} worth it problems`,
    },
  ];
}
