/** Server-only environment access + run-mode detection. */

export const env = {
  nimbleApiKey: process.env.NIMBLE_API_KEY?.trim() ?? "",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY?.trim() ?? "",
};

/** True when we have what we need to hit the live web AND synthesise. */
export function hasLiveKeys(): boolean {
  return Boolean(env.nimbleApiKey && env.anthropicApiKey);
}

/**
 * Mock mode runs the full UX on canned data with zero keys.
 * Also force-able via HIDDEN_REVIEWS_FORCE_MOCK=1 for bulletproof demos.
 */
export function isMockMode(): boolean {
  return !hasLiveKeys() || process.env.HIDDEN_REVIEWS_FORCE_MOCK === "1";
}
