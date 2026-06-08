"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Redacted } from "@/components/Redacted";
import { rise } from "@/lib/motion";
import { caseNo } from "@/lib/dig/slugs";
import { sentimentMeta } from "@/lib/sentiment";
import type { DigResult } from "@/lib/types";

const TRUST_BAR: Record<string, string> = {
  positive: "bg-positive",
  mixed: "bg-accent",
  negative: "bg-negative",
};

export function CaseCard({
  slug,
  result,
}: {
  slug: string;
  result: DigResult;
}) {
  const [hover, setHover] = useState(false);
  const s = sentimentMeta[result.overallSentiment];
  const teaser = result.buriedReviews[0]?.quote ?? result.verdict;
  const source = result.buriedReviews[0]?.sourceName ?? "live web";
  const sources = Array.from(
    new Set(result.buriedReviews.map((b) => b.sourceName)),
  ).slice(0, 3);

  return (
    <motion.article
      variants={rise}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/50 p-5 backdrop-blur-sm transition-colors hover:border-accent/40"
    >
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
        <span className="text-faint">Case no. {caseNo(slug)}</span>
        <span className={`inline-flex items-center gap-1.5 ${s.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold tracking-tight text-cream">
        {result.query}
      </h3>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-cream/10">
          <div
            className={`h-full rounded-full ${TRUST_BAR[result.overallSentiment]}`}
            style={{ width: `${result.trustScore}%` }}
          />
        </div>
        <span className="font-mono text-[11px] text-muted">
          {result.trustScore} trust
        </span>
      </div>

      <div className="mt-4 flex-1">
        <Redacted
          as="p"
          revealed={hover}
          locked
          className="font-serif text-[15px] leading-snug text-cream/90 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden"
        >
          “{teaser}”
        </Redacted>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-faint">
          — {source}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 font-mono text-[10px] uppercase tracking-widest text-faint">
        <span>
          {result.searchesRun ?? 0} searches · {result.sourcesScanned} sources
        </span>
        <span className="inline-flex items-center gap-1 text-muted transition-colors group-hover:text-accent">
          Open file <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>

      <Link
        href={`/${slug}`}
        aria-label={`Open case file: ${result.query}`}
        className="absolute inset-0"
      />
      {sources.length > 0 && (
        <span className="sr-only">{sources.join(", ")}</span>
      )}
    </motion.article>
  );
}
