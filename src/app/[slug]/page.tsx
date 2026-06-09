"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSeedBySlug, deslugify, readQuery } from "@/lib/dig/slugs";
import { streamDig } from "@/lib/dig/stream-client";
import { Dossier } from "@/components/dossier/Dossier";
import { DossierLoading } from "@/components/dossier/DossierLoading";
import type { AgentStep, DigResult } from "@/lib/types";

export default function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const seed = getSeedBySlug(slug);
  const mode: "live" | "file" = seed ? "file" : "live";

  const [result, setResult] = useState<DigResult | null>(seed ?? null);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const queryRef = useRef(seed?.query ?? readQuery(slug) ?? deslugify(slug));

  useEffect(() => {
    if (seed) return;
    let cancelled = false;
    streamDig(queryRef.current, (s) => !cancelled && setSteps(s))
      .then((r) => !cancelled && setResult(r))
      .catch(
        (e) =>
          !cancelled &&
          setError(e instanceof Error ? e.message : "The investigation failed."),
      );
    return () => {
      cancelled = true;
    };
    // slug is the stable identity of this case
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <main className="pt-6">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-faint transition-colors hover:text-cream"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          The Archive
        </Link>
      </div>

      <div className="mt-5">
        {error && !result ? (
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="rounded-2xl border border-line bg-surface/40 p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-negative">
                Case file sealed
              </p>
              <h1 className="mt-2 font-serif text-3xl text-cream">
                This investigation couldn&apos;t be completed.
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">{error}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-accent transition-colors hover:bg-accent/20"
                >
                  Reopen the investigation
                </button>
                <Link
                  href="/"
                  className="rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-cream"
                >
                  Browse cases on file
                </Link>
              </div>
            </div>
          </div>
        ) : result ? (
          <Dossier result={result} slug={slug} mode={mode} />
        ) : (
          <DossierLoading query={queryRef.current} slug={slug} steps={steps} />
        )}
      </div>
    </main>
  );
}
