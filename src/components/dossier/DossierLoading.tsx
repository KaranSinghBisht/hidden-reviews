"use client";

import { motion } from "motion/react";
import { InvestigationLog } from "./InvestigationLog";
import { caseNo } from "@/lib/dig/slugs";
import type { AgentStep } from "@/lib/types";

/** The live money-shot: the agent visibly working the case before the file lands. */
export function DossierLoading({
  query,
  slug,
  steps,
}: {
  query: string;
  slug: string;
  steps: AgentStep[];
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6"
    >
      <div className="overflow-hidden rounded-2xl border border-line-strong bg-surface/40">
        <div className="flex items-center justify-between gap-2 border-b border-line/60 bg-ink/40 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-faint">
          <span className="truncate">
            Case no. {caseNo(slug)} ·{" "}
            <span className="text-muted">hidden.reviews/{slug}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-positive/15 px-2.5 py-0.5 font-semibold text-positive">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
            </span>
            Live · Nimble
          </span>
        </div>
        <div className="p-6 sm:p-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
            Opening investigation
          </p>
          <h1 className="mt-2 text-2xl font-semibold capitalize tracking-tight text-cream sm:text-3xl">
            {query}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sending the research agent across the live web — planning angles,
            searching, reading, and filling the gaps. Watch it work.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <InvestigationLog steps={steps} live />
      </div>
    </motion.article>
  );
}
