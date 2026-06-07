import type { DigResult } from "@/lib/types";
import { isMockMode } from "@/lib/env";
import { mockDig } from "@/lib/mock/fixtures";
import { getCached, setCached } from "./cache";
import { liveDig } from "./live";
import { getSeed } from "./seeds";

/**
 * The one entry point: take a query, return the honest dig.
 * Cached → seed (pre-captured live) → mock (no keys) → live (Nimble + Claude).
 */
export async function dig(query: string): Promise<DigResult> {
  const q = query.trim();

  const cached = getCached(q);
  if (cached) return cached;

  // Pre-captured real digs for showcase queries — instant, no live wait.
  const seeded = getSeed(q);
  if (seeded) {
    setCached(seeded);
    return seeded;
  }

  const result = isMockMode() ? await mockDig(q) : await liveDig(q);
  setCached(result);
  return result;
}
