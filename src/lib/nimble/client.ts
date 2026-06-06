import { env } from "@/lib/env";

const SEARCH_URL = "https://sdk.nimbleway.com/v1/search";

/** One live-web result from Nimble. */
export interface NimbleResult {
  title: string;
  snippet: string;
  url: string;
}

type Raw = Record<string, unknown>;

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * Nimble's response envelope isn't contractually guaranteed, so pull the
 * result array from whichever key it actually uses rather than assuming one.
 */
function extractItems(data: unknown): Raw[] {
  const d = (data ?? {}) as Raw;
  const nested = d.parsing as Raw | undefined;
  const candidates: unknown[] = [
    d.results,
    d.organic_results,
    d.organic,
    d.entities,
    d.data,
    nested?.results,
  ];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) return c as Raw[];
  }
  return [];
}

/** Map a raw result onto our shape, tolerating common field-name variants. */
function mapItem(r: Raw): NimbleResult {
  return {
    title: str(r.title) || str(r.name) || str(r.heading),
    snippet:
      str(r.description) ||
      str(r.snippet) ||
      str(r.text) ||
      str(r.content) ||
      str(r.body),
    url: str(r.url) || str(r.link) || str(r.href),
  };
}

/**
 * Search the live web via Nimble, biased toward candid review content.
 * Returns real results (real URLs); the synthesis layer references these by
 * index, so nothing downstream can invent a source.
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
  return extractItems(data)
    .map(mapItem)
    .filter((r) => r.url.length > 0);
}
