"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { SearchBar } from "@/components/SearchBar";
import { rise, staggerContainer } from "@/lib/motion";
import { slugify, stashQuery } from "@/lib/dig/slugs";

const EXAMPLES = ["Dyson V15", "Dune Part Two", "Joe's Pizza NYC"];

export function Hero() {
  const router = useRouter();
  const go = (query: string) => {
    stashQuery(query);
    router.push(`/${slugify(query)}`);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 pt-20 text-center sm:pt-28">
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.1)}
      >
        <motion.p
          variants={rise}
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent"
        >
          An AI investigator for the honest web
        </motion.p>

        <motion.h1
          variants={rise}
          className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-7xl"
        >
          Reviews are usually hidden.
          <br />
          <span className="italic text-accent">Not here.</span>
        </motion.h1>

        <motion.p
          variants={rise}
          className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted"
        >
          Name a product, place, film, or company. The agent digs past page-one
          marketing to the candid, buried takes real people leave — Reddit,
          Trustpilot, forums — and files an honest verdict.{" "}
          <span className="text-cream/90">With sources you can open.</span>
        </motion.p>

        <motion.div variants={rise} className="mx-auto mt-8 w-full max-w-xl">
          <SearchBar onSearch={go} loading={false} />
        </motion.div>

        <motion.div
          variants={rise}
          className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm"
        >
          <span className="text-faint">Open a case</span>
          {EXAMPLES.map((ex) => (
            <Link
              key={ex}
              href={`/${slugify(ex)}`}
              className="rounded-full border border-line px-3 py-1 text-cream/80 transition-colors hover:border-accent/50 hover:text-accent"
            >
              {ex}
            </Link>
          ))}
        </motion.div>

        <motion.p
          variants={rise}
          className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-faint"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
          </span>
          Searched in real time on the live web via Nimble
        </motion.p>
      </motion.div>
    </section>
  );
}
