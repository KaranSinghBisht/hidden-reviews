"use client";

import { Check, Loader2 } from "lucide-react";
import type { AgentStep } from "@/lib/types";

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

interface Props {
  steps: AgentStep[];
  searchesRun?: number;
  sourcesScanned?: number;
  buried?: number;
  live?: boolean;
}

/** The agent's research trace, styled as a filed investigation log. */
export function InvestigationLog({
  steps,
  searchesRun,
  sourcesScanned,
  buried,
  live,
}: Props) {
  const hasStats = typeof searchesRun === "number";

  return (
    <div className="rounded-2xl border border-line bg-surface/30 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        {live && <Loader2 className="h-4 w-4 animate-spin text-accent" />}
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
          {live ? "Investigation in progress" : "Investigation log"} · live web via{" "}
          <span className="text-accent">Nimble</span>
        </p>
      </div>

      {hasStats && (
        <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
          <Stat n={searchesRun ?? 0} label="Nimble searches" />
          <Stat n={sourcesScanned ?? 0} label="live sources" />
          <Stat n={buried ?? 0} label="buried takes" />
        </div>
      )}

      {steps.length > 0 && (
        <ol className="relative mt-5 space-y-4 border-l border-line/60 pl-6">
          {steps.map((s, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border border-line bg-ink">
                {s.status === "done" ? (
                  <Check className="h-3 w-3 text-positive" />
                ) : (
                  <Loader2 className="h-3 w-3 animate-spin text-accent" />
                )}
              </span>
              <p className="text-sm text-cream">{s.label}</p>
              {s.detail && (
                <p className="mt-0.5 font-mono text-[11px] text-muted">{s.detail}</p>
              )}
            </li>
          ))}
        </ol>
      )}

      {hasStats && (
        <p className="mt-5 border-t border-line/60 pt-4 text-xs leading-relaxed text-faint">
          Every source is a live Nimble result — quotes are verbatim and linked to
          their page. Nothing here is generated.
        </p>
      )}
    </div>
  );
}
