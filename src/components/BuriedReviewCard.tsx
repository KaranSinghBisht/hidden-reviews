import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buriedReasonLabel, sentimentMeta } from "@/lib/sentiment";
import type { BuriedReview } from "@/lib/types";

export function BuriedReviewCard({ review }: { review: BuriedReview }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`h-2 w-2 rounded-full ${sentimentMeta[review.sentiment].dot}`}
          />
          <span className="font-medium text-cream">{review.sourceName}</span>
          {review.author && (
            <span className="text-muted">· {review.author}</span>
          )}
        </div>
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted transition-colors hover:text-accent"
          aria-label={`Open source on ${review.sourceName}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-cream/90">
        “{review.quote}”
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {review.buriedReasons.map((reason) => (
          <Badge key={reason} className="border-accent/30 text-accent/90">
            {buriedReasonLabel(reason)}
          </Badge>
        ))}
        <span className="ml-auto flex items-center gap-3 text-xs text-muted">
          {typeof review.rank === "number" && review.rank >= 4 && (
            <span className="text-accent/80">
              ↓ buried at result #{review.rank}
            </span>
          )}
          {review.date && <span>{review.date}</span>}
        </span>
      </div>
    </Card>
  );
}
