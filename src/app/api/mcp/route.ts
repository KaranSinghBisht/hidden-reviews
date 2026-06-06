import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { dig } from "@/lib/dig/dig";
import { formatDigAsText } from "@/lib/dig/format";

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

export { handler as GET, handler as POST, handler as DELETE };

export const maxDuration = 60;
