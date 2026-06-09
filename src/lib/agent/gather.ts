import {
  nimbleSearch,
  type NimbleResult,
  type SearchOpts,
} from "@/lib/nimble/client";
import type { SearchSpec } from "./plan";

/** A gathered source, tagged with the planned angle that surfaced it. */
export interface GatheredSource extends NimbleResult {
  via: string;
}

/**
 * Run every planned search in PARALLEL and dedupe by URL. Resilient: one
 * angle timing out or failing never sinks the dig — we keep whatever the
 * others returned. Lite (snippet) searches give breadth across communities;
 * the ONE deep angle extracts full page text (capped + bounded so it can't
 * blow the latency budget — at worst it just drops out via allSettled).
 */
export async function gather(specs: SearchSpec[]): Promise<GatheredSource[]> {
  // Honour at most ONE deep angle (the map callbacks run synchronously up to
  // their first await, so this flag is race-free).
  let deepUsed = false;
  const settled = await Promise.allSettled(
    specs.map(async (s) => {
      const deep = Boolean(s.deep) && !deepUsed;
      if (deep) deepUsed = true;
      const opts: SearchOpts = deep
        ? {
            depth: "deep",
            includeDomains: s.includeDomains,
            maxResults: 4,
            timeoutMs: 18_000,
            outputFormat: "markdown",
          }
        : {
            depth: "lite",
            includeDomains: s.includeDomains,
            maxResults: 8,
            timeoutMs: 12_000,
          };
      const results = await nimbleSearch(s.query, opts);
      return results.map((r): GatheredSource => ({ ...r, via: s.label }));
    }),
  );

  const byUrl = new Map<string, GatheredSource>();
  for (const outcome of settled) {
    if (outcome.status !== "fulfilled") continue;
    for (const src of outcome.value) {
      const key = src.url.split("?")[0].replace(/\/$/, "");
      const existing = byUrl.get(key);
      // Keep the richest version of a duplicate (one with full content wins).
      if (!existing || (!existing.content && src.content)) {
        byUrl.set(key, src);
      }
    }
  }
  return [...byUrl.values()];
}
