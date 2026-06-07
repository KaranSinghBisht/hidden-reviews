import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";

/** Strong model for the final synthesis. Override via ANTHROPIC_MODEL. */
export const SYNTH_MODEL =
  process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-6";

/** Fast model for planning / lightweight agent steps. */
export const FAST_MODEL =
  process.env.ANTHROPIC_FAST_MODEL?.trim() || "claude-haiku-4-5-20251001";

/**
 * A bounded Anthropic client. Short timeouts so a slow/overloaded API fails
 * fast (the agent degrades gracefully) instead of hanging past Vercel's cap.
 */
export function anthropic(timeoutMs = 30_000, maxRetries = 1): Anthropic {
  return new Anthropic({
    apiKey: env.anthropicApiKey,
    timeout: timeoutMs,
    maxRetries,
  });
}
