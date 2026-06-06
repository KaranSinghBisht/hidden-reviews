import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { sentimentMeta } from "@/lib/sentiment";
import type { DigResult } from "@/lib/types";
import { TrustMeter } from "./TrustMeter";
import { HiddenInsights } from "./HiddenInsights";
import { SentimentGapBar } from "./SentimentGapBar";
import { BuriedReviewCard } from "./BuriedReviewCard";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">
      {children}
    </h2>
  );
}

export function DigResults({ result }: { result: DigResult }) {
  const s = sentimentMeta[result.overallSentiment];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 pb-24">
      {/* The honest verdict */}
      <Card className="overflow-hidden">
        <div className="bg-beam p-6 sm:p-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <TrustMeter
              score={result.trustScore}
              sentiment={result.overallSentiment}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                <span
                  className={`text-xs font-medium uppercase tracking-widest ${s.text}`}
                >
                  {s.label} consensus
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-cream">
                {result.query}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-cream/85">
                {result.verdict}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {result.hiddenInsights.length > 0 && (
        <section>
          <SectionTitle>What they don’t tell you</SectionTitle>
          <HiddenInsights insights={result.hiddenInsights} />
        </section>
      )}

      {result.sentimentGaps.length > 0 && (
        <section>
          <SectionTitle>Marketing vs. reality</SectionTitle>
          <div className="space-y-3">
            {result.sentimentGaps.map((gap, i) => (
              <SentimentGapBar key={i} gap={gap} />
            ))}
          </div>
        </section>
      )}

      {result.buriedReviews.length > 0 && (
        <section>
          <SectionTitle>Buried reviews · {result.buriedReviews.length}</SectionTitle>
          <div className="space-y-3">
            {result.buriedReviews.map((review, i) => (
              <BuriedReviewCard key={i} review={review} />
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-muted">
        Scanned {result.sourcesScanned} sources ·{" "}
        {result.usedMock ? "demo data" : "live web via Nimble"}
      </p>
    </div>
  );
}
