import type { DigResult } from "@/lib/types";
import seedData from "./seeds.json";

/**
 * Pre-captured REAL live digs for the showcase queries. These are genuine
 * Nimble + Claude results (usedMock: false) saved ahead of time so the
 * most-clicked demo queries return instantly and never wait on — or fail —
 * a live API call. Any query that isn't seeded still runs fully live.
 */
const seeds = seedData as unknown as Record<string, DigResult>;

function key(query: string): string {
  return query.trim().toLowerCase();
}

export function getSeed(query: string): DigResult | undefined {
  return seeds[key(query)];
}
