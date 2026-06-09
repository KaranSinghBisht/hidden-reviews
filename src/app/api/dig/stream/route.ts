import { z } from "zod";
import { getCached, setCached } from "@/lib/dig/cache";
import { getSeed } from "@/lib/dig/seeds";
import { isMockMode } from "@/lib/env";
import { mockDig } from "@/lib/mock/fixtures";
import { runDigAgent } from "@/lib/agent/run";
import { clientIp, rateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

// The agent runs several searches + synthesis; give it room under the cap.
export const maxDuration = 60;

const DigSchema = z.object({
  query: z.string().trim().min(1, "Enter something to look up.").max(120),
});

/**
 * Streams the research agent's progress as Server-Sent Events:
 *   { type: "trace", steps }   — the live agent trace (repeated as it grows)
 *   { type: "result", result } — the final DigResult
 *   { type: "error", error }   — a friendly failure
 * Cached / seeded / mock results resolve instantly with a single result event.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = DigSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid query.";
    return Response.json({ error: message }, { status: 400 });
  }
  const query = parsed.data.query;

  // Instant paths (cached / seeded / mock) are free; only live agent runs burn
  // Nimble + Claude credits, so only those count against the abuse limiter.
  const fast = getCached(query) ?? getSeed(query);
  const live = !fast && !isMockMode();
  if (live && rateLimited(clientIp(req))) {
    return Response.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      try {
        if (fast) {
          send({ type: "result", result: fast });
        } else if (!live) {
          send({ type: "result", result: await mockDig(query) });
        } else {
          const result = await runDigAgent(query, (steps) =>
            send({ type: "trace", steps }),
          );
          setCached(result);
          send({ type: "result", result });
        }
      } catch {
        send({ type: "error", error: "Couldn't dig that up right now. Try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
