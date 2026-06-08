"use client";

import {
  MessageSquare,
  Star,
  FileText,
  Newspaper,
  Video,
  Globe,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Redacted } from "@/components/Redacted";
import { Badge } from "@/components/ui/Badge";
import { buriedReasonLabel, sentimentMeta } from "@/lib/sentiment";
import type { BuriedReview, SourceKind } from "@/lib/types";

const ICON: Record<SourceKind, LucideIcon> = {
  reddit: MessageSquare,
  forum: MessageSquare,
  trustpilot: Star,
  yelp: Star,
  blog: FileText,
  news: Newspaper,
  youtube: Video,
  other: Globe,
};

function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

export function BuriedTestimony({
  review,
  index,
}: {
  review: BuriedReview;
  index: number;
}) {
  const sm = sentimentMeta[review.sentiment];
  const Icon = ICON[review.sourceKind] ?? Globe;

  return (
    <article className="rounded-2xl border border-line bg-surface/40 p-5 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Icon className="h-4 w-4 text-muted" />
          <span className="font-medium text-cream">{review.sourceName}</span>
          {review.author && (
            <span className="text-faint">· {review.author}</span>
          )}
          <span className={`h-1.5 w-1.5 rounded-full ${sm.dot}`} />
        </div>
        {review.date && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
            {review.date}
          </span>
        )}
      </div>

      <Redacted
        as="blockquote"
        delay={Math.min(index, 6) * 0.12}
        className="mt-3 font-serif text-[17px] leading-relaxed text-cream/90"
      >
        “{review.quote}”
      </Redacted>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {review.buriedReasons.map((reason) => (
          <Badge key={reason} className="border-accent/30 text-accent/90">
            {buriedReasonLabel(reason)}
          </Badge>
        ))}
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-accent"
        >
          Read it on {host(review.url)}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
