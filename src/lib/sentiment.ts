import type { BuriedReason, Sentiment } from "@/lib/types";

/** Display metadata for each sentiment (premium, desaturated palette). */
export const sentimentMeta: Record<
  Sentiment,
  { label: string; text: string; dot: string }
> = {
  positive: { label: "Positive", text: "text-positive", dot: "bg-positive" },
  mixed: { label: "Mixed", text: "text-accent", dot: "bg-accent" },
  negative: { label: "Negative", text: "text-negative", dot: "bg-negative" },
};

const buriedReasonLabels: Record<BuriedReason, string> = {
  low_search_rank: "Buried in search",
  candid_community: "Candid community",
  contrarian: "Against the hype",
  downvoted_or_old: "Low visibility",
  niche_source: "Niche source",
};

export function buriedReasonLabel(reason: BuriedReason): string {
  return buriedReasonLabels[reason] ?? reason;
}
