/**
 * Best-effort, in-memory guard for the cost-bearing LIVE digs (each one runs
 * several Nimble searches + Claude calls). Per serverless instance — resets on
 * cold start — which is enough to stop a curl loop from draining trial API
 * credits without adding any infrastructure. Cached/seeded queries are never
 * counted; only genuinely live investigations spend budget.
 */
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_IP = 10; // generous for a judge exploring, blocks loops
const MAX_GLOBAL = 60; // instance-wide backstop against distributed abuse
const MAX_TRACKED_IPS = 500;

const perIp = new Map<string, number[]>();
let globalHits: number[] = [];

function recent(times: number[], now: number): number[] {
  return times.filter((t) => now - t < WINDOW_MS);
}

/**
 * Record one live dig for this caller. Returns true when the caller (or the
 * instance as a whole) is over budget and the dig should be refused.
 */
export function rateLimited(ip: string): boolean {
  const now = Date.now();
  globalHits = recent(globalHits, now);
  if (globalHits.length >= MAX_GLOBAL) return true;

  const mine = recent(perIp.get(ip) ?? [], now);
  if (mine.length >= MAX_PER_IP) return true;

  mine.push(now);
  globalHits.push(now);
  perIp.set(ip, mine);
  if (perIp.size > MAX_TRACKED_IPS) {
    const oldest = perIp.keys().next().value;
    if (oldest !== undefined) perIp.delete(oldest);
  }
  return false;
}

/** Client IP as the platform reports it; unidentified callers share a bucket. */
export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export const RATE_LIMIT_MESSAGE =
  "That's a lot of live investigations at once. Browse the cases on file, or try again in a little while.";
