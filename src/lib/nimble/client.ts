import { env } from "@/lib/env";

const SEARCH_URL = "https://sdk.nimbleway.com/v1/search";

/** One live-web result from Nimble. */
export interface NimbleResult {
  title: string;
  snippet: string;
  url: string;
  /**
   * Full page text — populated only on `deep` searches, and empty for
   * scrape-hostile sites like Reddit (use the snippet there).
   */
  content?: string;
}

export interface SearchOpts {
  /** "lite" = snippets (fast). "deep" = full page content (slow, richer). */
  depth?: "lite" | "deep";
  includeDomains?: string[];
  excludeDomains?: string[];
  maxResults?: number;
  /** Abort the search after this long so one angle can't hang the dig. */
  timeoutMs?: number;
  /** Page-content format for deep extraction (markdown is cleanest for LLMs). */
  outputFormat?: "markdown";
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
  const content = str(r.content);
  return {
    title: str(r.title) || str(r.name) || str(r.heading),
    snippet:
      str(r.description) ||
      str(r.snippet) ||
      str(r.text) ||
      str(r.body),
    url: str(r.url) || str(r.link) || str(r.href),
    // Deep search returns the full page; treat near-empty (e.g. Reddit) as none.
    content: content.length > 80 ? content : undefined,
  };
}

/**
 * One configurable search against Nimble's live-web index. The agent composes
 * several of these (different queries / depths / target domains) per dig.
 * Returns real results with real URLs; synthesis references them by index so
 * nothing downstream can invent a source.
 */
export async function nimbleSearch(
  query: string,
  opts: SearchOpts = {},
): Promise<NimbleResult[]> {
  const {
    depth = "lite",
    includeDomains,
    excludeDomains,
    maxResults = 10,
    timeoutMs = 30_000,
    outputFormat,
  } = opts;

  const body: Record<string, unknown> = {
    query,
    max_results: maxResults,
    search_depth: depth,
  };
  if (includeDomains?.length) body.include_domains = includeDomains;
  if (excludeDomains?.length) body.exclude_domains = excludeDomains;
  if (outputFormat) body.output_format = outputFormat;

  const res = await fetch(SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.nimbleApiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!res.ok) {
    throw new Error(`Nimble search failed (${res.status}).`);
  }

  const data = await res.json();
  // Live-web URLs are untrusted input: only http(s) ever enters the pipeline,
  // so nothing downstream (synthesis, links) can carry a javascript: scheme.
  return extractItems(data)
    .map(mapItem)
    .filter((r) => /^https?:\/\//i.test(r.url));
}
