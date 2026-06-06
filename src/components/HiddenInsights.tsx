import { sentimentMeta } from "@/lib/sentiment";
import type { HiddenInsight } from "@/lib/types";

export function HiddenInsights({ insights }: { insights: HiddenInsight[] }) {
  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl border border-line bg-surface/40 p-4"
        >
          <span
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${sentimentMeta[insight.sentiment].dot}`}
          />
          <p className="flex-1 text-[15px] leading-snug text-cream/90">
            {insight.point}
          </p>
          <span className="shrink-0 font-mono text-xs text-muted">
            {insight.supportCount} sources
          </span>
        </div>
      ))}
    </div>
  );
}
