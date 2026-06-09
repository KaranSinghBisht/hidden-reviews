"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { rise, staggerContainer, inView } from "@/lib/motion";

const STEPS = [
  {
    tool: "Claude",
    title: "Plan the angles",
    body: "Claude reads the subject and tailors search angles to it — Amazon reviews and Reddit for a product, Letterboxd and IMDb for a film, TripAdvisor and local subreddits for a restaurant, Glassdoor and G2 for a company.",
  },
  {
    tool: "Nimble",
    title: "Search the live web",
    body: "Nimble runs every angle in parallel across the candid sources page one buries — and deep-reads the long-form angle, extracting full page text for the quotes that matter.",
  },
  {
    tool: "Claude",
    title: "Assess the coverage",
    body: "The agent reads what came back, finds the biggest blind spot, and writes a sharper follow-up query. This loop is what makes it an agent, not a search box.",
    loop: true,
  },
  {
    tool: "Nimble",
    title: "Dig deeper",
    body: "It searches again to fill the gap — chasing the durability complaint, the repair thread, the thing no one advertises.",
  },
  {
    tool: "Claude",
    title: "File the verdict",
    body: "Claude synthesises an honest verdict and a trust score, citing sources by index so every quote links to a real page — never invented.",
  },
];

function ToolChip({ tool }: { tool: string }) {
  const isNimble = tool === "Nimble";
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest ${
        isNimble
          ? "bg-accent/15 text-accent"
          : "border border-line text-muted"
      }`}
    >
      {tool}
    </span>
  );
}

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <motion.div {...inView} variants={staggerContainer(0.07)}>
        <motion.p
          variants={rise}
          className="text-center font-mono text-[11px] uppercase tracking-widest text-accent"
        >
          The method
        </motion.p>
        <motion.h2
          variants={rise}
          className="mt-2 text-center font-serif text-3xl tracking-tight text-cream sm:text-4xl"
        >
          How the investigation works
        </motion.h2>
        <motion.p
          variants={rise}
          className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-muted"
        >
          Not one API call — a research agent that plans, searches, critiques its
          own coverage, and digs again before it commits to a verdict.
        </motion.p>

        <ol className="mt-10 space-y-5 border-l border-line/60 pl-7">
          {STEPS.map((s, i) => (
            <motion.li key={s.title} variants={rise} className="relative">
              <span
                className={`absolute -left-[37px] flex h-7 w-7 items-center justify-center rounded-full border bg-ink font-mono text-xs ${
                  s.loop ? "border-accent/60 text-accent" : "border-line text-muted"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-cream">{s.title}</h3>
                <ToolChip tool={s.tool} />
                {s.loop && (
                  <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-accent">
                    <RotateCcw className="h-3 w-3" />
                    feedback loop
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
