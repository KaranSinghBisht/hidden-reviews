import type { DigResult } from "@/lib/types";

/**
 * Tiny in-memory cache (per server instance). Good enough for the demo:
 * makes repeat queries instant and saves Nimble/Claude credits.
 */
const store = new Map<string, DigResult>();

function key(query: string): string {
  return query.trim().toLowerCase();
}

export function getCached(query: string): DigResult | undefined {
  return store.get(key(query));
}

export function setCached(result: DigResult): void {
  store.set(key(result.query), result);
}
