import type { DigResult } from "@/lib/types";
import { runDigAgent } from "@/lib/agent/run";

/**
 * Live mode: a multi-step research agent (plan → parallel targeted Nimble
 * searches → read real content → synthesise) produces the honest dig.
 * See agent/run.ts. Pass an onTrace callback to stream its steps.
 */
export async function liveDig(query: string): Promise<DigResult> {
  return runDigAgent(query);
}
