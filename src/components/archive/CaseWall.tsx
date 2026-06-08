"use client";

import { motion } from "motion/react";
import { Search } from "lucide-react";
import { CaseCard } from "./CaseCard";
import { FEATURED } from "@/lib/dig/slugs";
import { rise, staggerContainer, inView } from "@/lib/motion";

export function CaseWall() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
      <motion.div {...inView} variants={staggerContainer(0.06)}>
        <motion.div
          variants={rise}
          className="flex items-end justify-between gap-4"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
              The Archive
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-cream sm:text-4xl">
              Recently declassified
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-snug text-muted sm:block">
            Real investigations the agent has already run.{" "}
            <span className="text-cream/80">Hover to peek</span> — open a file
            for the full dossier.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((c) => (
            <CaseCard key={c.slug} slug={c.slug} result={c.result} />
          ))}
          <motion.button
            variants={rise}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex min-h-[210px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-strong bg-surface/20 p-5 text-center transition-colors hover:border-accent/50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-accent transition-colors group-hover:border-accent/60">
              <Search className="h-4 w-4" />
            </span>
            <span className="font-serif text-lg text-cream">
              Investigate anything
            </span>
            <span className="max-w-[13rem] text-xs leading-snug text-muted">
              A product, place, film, or company — the agent opens a fresh case
              on the live web.
            </span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
