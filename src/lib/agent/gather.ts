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
 * others returned. Snippet (lite) searches are fast, so we run several for
 * breadth across communities and source types.
 */
export async function gather(specs: SearchSpec[]): Promise<GatheredSource[]> {
  const settled = await Promise.allSettled(
    specs.map(async (s) => {
      const opts: SearchOpts = {
        depth: s.depth ?? "lite",
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
