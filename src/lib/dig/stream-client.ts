import type { AgentStep, DigResult } from "@/lib/types";

/**
 * POST a query to the streaming dig endpoint and consume the SSE stream,
 * calling onTrace with the agent's steps as they arrive. Resolves with the
 * final DigResult (or throws a friendly error).
 */
export async function streamDig(
  query: string,
  onTrace: (steps: AgentStep[]) => void,
): Promise<DigResult> {
  const res = await fetch("/api/dig/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Something went wrong.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: DigResult | null = null;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";
    for (const chunk of chunks) {
      const line = chunk.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload) continue;

      const evt = JSON.parse(payload) as
        | { type: "trace"; steps: AgentStep[] }
        | { type: "result"; result: DigResult }
        | { type: "error"; error: string };

      if (evt.type === "trace") onTrace(evt.steps);
      else if (evt.type === "result") result = evt.result;
      else if (evt.type === "error") throw new Error(evt.error);
    }
  }

  if (!result) throw new Error("The dig ended without a result. Try again.");
  return result;
}
