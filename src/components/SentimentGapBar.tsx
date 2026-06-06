import type { SentimentGap } from "@/lib/types";

export function SentimentGapBar({ gap }: { gap: SentimentGap }) {
  const pct = Math.max(0, Math.min(100, gap.gapScore));

  return (
    <div className="rounded-xl border border-line bg-surface/40 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted">
            Marketing says
          </p>
          <p className="mt-1 text-sm text-cream/75">{gap.marketingClaim}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-accent">
            Reality
          </p>
          <p className="mt-1 text-sm text-cream">{gap.realityFinding}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span>Gap</span>
          <span className="font-mono">{pct}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
