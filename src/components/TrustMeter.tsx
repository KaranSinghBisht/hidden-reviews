import type { Sentiment } from "@/lib/types";

const STROKE: Record<Sentiment, string> = {
  positive: "#4ade80",
  mixed: "#f5b14c",
  negative: "#fb7185",
};

/** Radial trust score (0-100) coloured by overall sentiment. */
export function TrustMeter({
  score,
  sentiment,
}: {
  score: number;
  sentiment: Sentiment;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score));
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(245,241,234,0.08)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={STROKE[sentiment]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-semibold text-cream">{pct}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted">Trust</span>
      </div>
    </div>
  );
}
