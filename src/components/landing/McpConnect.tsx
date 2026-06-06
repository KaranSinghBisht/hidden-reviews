"use client";

import { useState } from "react";
import { Check, Copy, Plug } from "lucide-react";

const MCP_URL = "https://hidden-reviews.vercel.app/api/mcp";
const SNIPPET = `{
  "mcpServers": {
    "hidden-reviews": {
      "url": "https://hidden-reviews.vercel.app/api/mcp"
    }
  }
}`;

export function McpConnect() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(MCP_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <section className="border-y border-line bg-surface/30">
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="flex items-center gap-2 text-accent">
          <Plug className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Model Context Protocol
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
          Reviews are hidden. Not from your AI.
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Add hidden.reviews to Claude, Cursor, or ChatGPT as a connector. Then ask your
          assistant “should I buy the Dyson V15?” and it pulls the buried, sourced truth
          live — instead of the shallow summary it had before.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-ink/60 p-3">
          <code className="flex-1 truncate font-mono text-sm text-cream">{MCP_URL}</code>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-cream/80 transition-colors hover:border-accent/50 hover:text-accent"
          >
            {copied ? (
              <Check className="h-4 w-4 text-positive" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy URL"}
          </button>
        </div>

        <p className="mt-4 text-xs uppercase tracking-widest text-muted">
          Or drop into your mcp.json
        </p>
        <pre className="mt-2 overflow-x-auto rounded-xl border border-line bg-ink/60 p-4 font-mono text-xs leading-relaxed text-cream/80">
          {SNIPPET}
        </pre>
      </div>
    </section>
  );
}
