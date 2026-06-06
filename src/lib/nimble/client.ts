import { env } from "@/lib/env";

const SEARCH_URL = "https://sdk.nimbleway.com/v1/search";

/** One live-web result from Nimble. */
export interface NimbleResult {
  title: string;
  snippet: string;
  url: string;
}

/**
 * Search the live web via Nimble, biased toward candid review content.
 * Returns real results (real URLs) — the synthesis layer only references
 * these by index, so nothing downstream can invent a source.
 */
export async function nimbleSearch(query: string): Promise<NimbleResult[]> {
  const res = await fetch(SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.nimbleApiKey}`,
    },
    body: JSON.stringify({
      query: `${query} honest reviews complaints problems reddit trustpilot`,
      max_results: 12,
      search_depth: "lite",
      focus: "general",
    }),
  });

  if (!res.ok) {
    throw new Error(`Nimble search failed (${res.status}).`);
  }

  const data = await res.json();
  const raw = (data?.results ?? []) as Array<Record<string, unknown>>;

  return raw
    .map((r) => ({
      title: String(r.title ?? ""),
      snippet: String(r.description ?? r.snippet ?? ""),
      url: String(r.url ?? ""),
    }))
    .filter((r) => r.url.length > 0);
}
