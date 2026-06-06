import type { DigResult } from "@/lib/types";

/**
 * Live mode: Nimble (search + extract over Reddit/Trustpilot/forums) → Claude
 * synthesis of the honest verdict. Wired in a later step; mock mode stays active
 * until both NIMBLE_API_KEY and ANTHROPIC_API_KEY are set.
 */
export async function liveDig(query: string): Promise<DigResult> {
  throw new Error(`Live mode is not wired yet for "${query}". Running in mock mode.`);
}
