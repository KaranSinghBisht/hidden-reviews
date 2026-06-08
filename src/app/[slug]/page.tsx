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
            <div className="rounded-2xl border border-negative/30 bg-negative/10 p-6">
              <p className="text-sm text-negative">{error}</p>
              <Link
                href="/"
                className="mt-3 inline-block text-sm text-cream underline-offset-4 hover:underline"
              >
                Back to the Archive
              </Link>
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
