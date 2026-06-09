import type { DigResult } from "@/lib/types";

/**
 * Tiny in-memory cache (per server instance). Good enough for the demo:
 * makes repeat queries instant and saves Nimble/Claude credits.
 */
const store = new Map<string, DigResult>();
const MAX_ENTRIES = 200; // FIFO cap so unique-query floods can't grow memory

function key(query: string): string {
  return query.trim().toLowerCase();
}

export function getCached(query: string): DigResult | undefined {
  return store.get(key(query));
}

export function setCached(result: DigResult): void {
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
  store.set(key(result.query), result);
}
