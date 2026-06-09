import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { dig } from "@/lib/dig/dig";
import { formatDigAsText } from "@/lib/dig/format";
import { getCached } from "@/lib/dig/cache";
import { getSeed } from "@/lib/dig/seeds";
import { isMockMode } from "@/lib/env";
import { clientIp, rateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

/**
 * hidden.reviews as a remote MCP server (Streamable HTTP).
 * Endpoint: /api/mcp — add it to Claude, Cursor, or ChatGPT as a connector and
 * the agent can pull the honest, buried reviews it otherwise can't see.
 */
const handler = createMcpHandler(
  (server) => {
    server.tool(
      "get_hidden_reviews",
      "Surface the honest, buried reviews real people leave about a product, place, company, restaurant, movie, or item — the candid takes (Reddit, Trustpilot, forums, long-tail blogs) that polished top-of-search results and shallow LLM summaries miss. Returns an honest verdict, a 0-100 trust score, what the marketing doesn't tell you, and sourced buried quotes. Use it before buying, booking, or watching anything.",
      {
        query: z
          .string()
          .min(1)
          .max(120)
          .describe(
            "The product, place, company, restaurant, movie, or item to investigate — e.g. 'Dyson V15', \"Joe's Pizza NYC\", 'Dune Part Two'",
          ),
      },
      async ({ query }) => {
        const result = await dig(query);
        return { content: [{ type: "text", text: formatDigAsText(result) }] };
      },
    );
  },
  {},
  { basePath: "/api", maxDuration: 60 },
);

/** Pull the tool query out of a JSON-RPC tools/call body, if that's what this is. */
async function toolCallQuery(req: Request): Promise<string | null> {
  try {
    const body = (await req.clone().json()) as {
      method?: string;
      params?: { arguments?: { query?: unknown } };
    };
    if (body?.method !== "tools/call") return null;
    const q = body.params?.arguments?.query;
    return typeof q === "string" ? q.trim() : null;
  } catch {
    return null; // not JSON / not a tool call — let the handler respond
  }
}

/** Tool calls that would trigger a LIVE dig count against the credit limiter. */
async function guardedPost(req: Request): Promise<Response> {
  const query = await toolCallQuery(req);
  const live =
    query !== null && !getCached(query) && !getSeed(query) && !isMockMode();
  if (live && rateLimited(clientIp(req))) {
    return Response.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
  }
  return handler(req);
}

export { handler as GET, guardedPost as POST, handler as DELETE };

export const maxDuration = 60;
