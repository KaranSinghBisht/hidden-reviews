"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, Plug } from "lucide-react";
import { rise, staggerContainer, inView } from "@/lib/motion";

const MCP_URL = "https://hidden-reviews.vercel.app/api/mcp";
const SNIPPET = `{
  "mcpServers": {
    "hidden-reviews": {
      "url": "https://hidden-reviews.vercel.app/api/mcp"
    }
  }
}`;

const CLIENTS = ["Claude", "Cursor", "ChatGPT", "Windsurf"];

const TERMINAL = [
  { p: "›", t: 'you: "is the Sony WH-1000XM5 actually worth it?"', cls: "text-cream/80" },
  { p: "→", t: "get_hidden_reviews({ query: \"Sony WH-1000XM5\" })", cls: "text-accent" },
  { p: "←", t: "trust 68 · 5 buried takes · 43 live sources via Nimble", cls: "text-positive" },
  {
    p: " ",
    t: "“Outstanding ANC — but long-term owners flag hinge durability and a fussy app.”",
    cls: "text-cream/70",
  },
];

export function McpConnect() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(MCP_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <section className="border-y border-line bg-surface/20">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <motion.div
          {...inView}
          variants={staggerContainer(0.08)}
          className="grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <motion.div
              variants={rise}
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent"
            >
              <Plug className="h-4 w-4" />
              Model Context Protocol
            </motion.div>
            <motion.h2
              variants={rise}
              className="mt-3 font-serif text-3xl tracking-tight text-cream sm:text-4xl"
            >
              Give your AI clearance to the honest web
            </motion.h2>
            <motion.p
              variants={rise}
              className="mt-4 max-w-xl leading-relaxed text-muted"
            >
              Ask ChatGPT about a product and it parrots the glossy surface — LLMs
              are blind to buried reviews. hidden.reviews is a hosted MCP server, so
              Claude, Cursor, or ChatGPT can pull the sourced, buried truth live —
              right inside your workflow.
            </motion.p>

            <motion.div variants={rise} className="mt-6 flex flex-wrap gap-2">
              {CLIENTS.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line bg-ink/40 px-3 py-1 font-mono text-[11px] text-muted"
                >
                  {c}
                </span>
              ))}
            </motion.div>

            <motion.div
              variants={rise}
              className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-ink/60 p-3"
            >
              <code className="flex-1 truncate font-mono text-sm text-cream">
                {MCP_URL}
              </code>
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
            </motion.div>
          </div>

          <motion.div variants={rise}>
            <div className="overflow-hidden rounded-2xl border border-line-strong bg-vault shadow-2xl">
              <div className="flex items-center gap-2 border-b border-line/60 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-negative/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-positive/70" />
                <span className="ml-2 font-mono text-[11px] text-faint">
                  hidden-reviews · MCP tool call
                </span>
              </div>
              <div className="space-y-2 p-5 font-mono text-[12.5px] leading-relaxed sm:text-sm">
                {TERMINAL.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.5, duration: 0.4 }}
                    className="flex gap-2.5"
                  >
                    <span className="select-none text-faint">{line.p}</span>
                    <span className={line.cls}>{line.t}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-faint">
              Or drop the snippet into your mcp.json
            </p>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-line bg-ink/60 p-4 font-mono text-[11px] leading-relaxed text-cream/70">
              {SNIPPET}
            </pre>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
