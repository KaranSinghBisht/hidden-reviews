import type { DigResult } from "@/lib/types";
import { isMockMode } from "@/lib/env";
import { mockDig } from "@/lib/mock/fixtures";
import { getCached, setCached } from "./cache";
import { liveDig } from "./live";

/**
 * The one entry point: take a query, return the honest dig.
 * Cached → mock (no keys) → live (Nimble + Claude).
 */
export async function dig(query: string): Promise<DigResult> {
  const q = query.trim();

  const cached = getCached(q);
  if (cached) return cached;

  const result = isMockMode() ? await mockDig(q) : await liveDig(q);
  setCached(result);
  return result;
}
