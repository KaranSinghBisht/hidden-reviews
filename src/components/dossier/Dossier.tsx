"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { TrustMeter } from "@/components/TrustMeter";
import { HiddenInsights } from "@/components/HiddenInsights";
import { SentimentGapBar } from "@/components/SentimentGapBar";
import { BuriedTestimony } from "./BuriedTestimony";
import { InvestigationLog } from "./InvestigationLog";
import { caseNo } from "@/lib/dig/slugs";
import { sentimentMeta } from "@/lib/sentiment";
import { rise, inView } from "@/lib/motion";
import type { DigResult } from "@/lib/types";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-px w-6 bg-accent/60" />
      <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
        {children}
      </h2>
    </div>
  );
}

function StatusChip({ result, mode }: { result: DigResult; mode: Mode }) {
  if (result.usedMock) {
    return <Chip className="bg-accent/15 text-accent">Demo data</Chip>;
  }
  if (mode === "live") {
    return (
      <Chip className="bg-positive/15 text-positive">
        <span className="h-1.5 w-1.5 rounded-full bg-positive" />
        Live · Nimble
      </Chip>
    );
  }
  return <Chip className="bg-accent/15 text-accent">On file · Nimble</Chip>;
}

function Chip({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest ${className}`}
    >
      {children}
    </span>
  );
}

type Mode = "live" | "file";

export function Dossier({
  result,
  slug,
  mode,
}: {
  result: DigResult;
  slug: string;
  mode: Mode;
}) {
  const sm = sentimentMeta[result.overallSentiment];

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6">
      <motion.header
        variants={rise}
        initial="hidden"
        animate="show"
        className="overflow-hidden rounded-2xl border border-line-strong bg-surface/40"
      >
        <div className="flex items-center justify-between gap-2 border-b border-line/60 bg-ink/40 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-faint">
          <span className="truncate">
            Case no. {caseNo(slug)} ·{" "}
            <span className="text-muted">hidden.reviews/{slug}</span>
          </span>
          <StatusChip result={result} mode={mode} />
        </div>
        <div className="bg-beam p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <TrustMeter score={result.trustScore} sentiment={result.overallSentiment} />
            <div className="flex-1">
              <p
                className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest ${sm.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${sm.dot}`} />
                {sm.label} consensus
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                {result.query}
              </h1>
              <p className="mt-3 font-serif text-lg leading-relaxed text-cream/90 sm:text-xl">
                {result.verdict}
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="mt-10 space-y-10">
        {result.hiddenInsights.length > 0 && (
          <motion.section {...inView} variants={rise}>
            <SectionTitle>What they don’t tell you</SectionTitle>
            <HiddenInsights insights={result.hiddenInsights} />
          </motion.section>
        )}

        {result.sentimentGaps.length > 0 && (
          <motion.section {...inView} variants={rise}>
            <SectionTitle>Marketing vs. reality</SectionTitle>
            <div className="space-y-3">
              {result.sentimentGaps.map((gap, i) => (
                <SentimentGapBar key={i} gap={gap} />
              ))}
            </div>
          </motion.section>
        )}

        {result.buriedReviews.length > 0 && (
          <motion.section {...inView} variants={rise}>
            <SectionTitle>Buried testimony · {result.buriedReviews.length}</SectionTitle>
            <div className="space-y-3">
              {result.buriedReviews.map((review, i) => (
                <BuriedTestimony key={i} review={review} index={i} />
              ))}
            </div>
          </motion.section>
        )}

        <motion.section {...inView} variants={rise}>
          <SectionTitle>How the agent dug</SectionTitle>
          <InvestigationLog
            steps={result.agentSteps ?? []}
            searchesRun={result.searchesRun ?? 0}
            sourcesScanned={result.sourcesScanned}
            buried={result.buriedReviews.length}
          />
        </motion.section>
      </div>
    </article>
  );
}
