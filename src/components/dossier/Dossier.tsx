"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Check, X, type LucideIcon } from "lucide-react";
import { TrustMeter } from "@/components/TrustMeter";
import { SentimentGapBar } from "@/components/SentimentGapBar";
import { BuriedTestimony } from "./BuriedTestimony";
import { InvestigationLog } from "./InvestigationLog";
import { caseNo } from "@/lib/dig/slugs";
import { sentimentMeta } from "@/lib/sentiment";
import { rise, inView } from "@/lib/motion";
import type { DigResult, Sentiment } from "@/lib/types";

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

const GLANCE_ICON: Record<Sentiment, LucideIcon> = {
  positive: Check,
  mixed: AlertTriangle,
  negative: X,
};

/** The serif verdict, clamped for glanceability with an expand toggle. */
function Verdict({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 170;
  return (
    <div>
      <p
        className={`mt-3 font-serif text-lg leading-relaxed text-cream/90 ${
          long && !open ? "line-clamp-2" : ""
        }`}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-accent/90 transition-colors hover:text-accent"
        >
          {open ? "Show less" : "Read the full verdict"}
        </button>
      )}
    </div>
  );
}

function Stat({ n, label }: { n: number | string; label: string }) {
  return (
    <div className="bg-ink/60 px-4 py-3 text-center">
      <div className="font-mono text-2xl font-semibold text-accent">{n}</div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-faint">
        {label}
      </div>
    </div>
  );
}

type Mode = "live" | "file";

/**
 * The case file. The cover sheet answers everything in one glance — score,
 * consensus, the things marketing hides, the receipts — and the sections
 * below hold the depth for whoever wants it.
 */
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
              <Verdict text={result.verdict} />
            </div>
          </div>

          {result.hiddenInsights.length > 0 && (
            <div className="mt-7 border-t border-line/60 pt-5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                What they don&rsquo;t tell you
              </p>
              <ul className="mt-3 space-y-2.5">
                {result.hiddenInsights.map((insight, i) => {
                  const Icon = GLANCE_ICON[insight.sentiment];
                  return (
                    <li key={i} className="flex items-start gap-2.5">
                      <Icon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${sentimentMeta[insight.sentiment].text}`}
                      />
                      <span className="flex-1 text-sm leading-snug text-cream/90">
                        {insight.point}
                      </span>
                      <span className="shrink-0 pt-0.5 font-mono text-[10px] uppercase tracking-wider text-faint">
                        ×{insight.supportCount} sources
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {typeof result.searchesRun === "number" && (
            <div className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
              <Stat n={result.searchesRun} label="Nimble searches" />
              <Stat n={result.sourcesScanned} label="live sources" />
              <Stat n={result.buriedReviews.length} label="buried takes" />
            </div>
          )}
        </div>
      </motion.header>

      <div className="mt-10 space-y-10">
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
          <InvestigationLog steps={result.agentSteps ?? []} />
        </motion.section>
      </div>
    </article>
  );
}
