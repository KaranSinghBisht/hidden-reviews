/**
 * Data contracts for hidden.reviews.
 *
 * One "dig" = the user searches a product / place / company, and we surface the
 * honest, buried reviews that the polished top-of-search results hide.
 */

/** Where a buried opinion was found. */
export type SourceKind =
  | "reddit"
  | "forum"
  | "trustpilot"
  | "yelp"
  | "blog"
  | "news"
  | "youtube"
  | "other";

/** Why a given take counts as "buried" / hard for a normal user to find. */
export type BuriedReason =
  | "low_search_rank" // showed up deep in results (page 2+)
  | "candid_community" // Reddit/forum, not SEO-optimised marketing
  | "contrarian" // disagrees with the marketed / top-line narrative
  | "downvoted_or_old" // aged or low-visibility
  | "niche_source"; // small blog / specialist site

export type Sentiment = "positive" | "mixed" | "negative";

/** A single surfaced "buried" opinion, always tied to its source. */
export interface BuriedReview {
  /** The actual words, verbatim and trimmed. */
  quote: string;
  /** One-line gist when the quote is long. */
  summary?: string;
  sourceKind: SourceKind;
  /** e.g. "r/BuyItForLife", "Trustpilot". */
  sourceName: string;
  url: string;
  author?: string;
  /** ISO date or human string, when known. */
  date?: string;
  sentiment: Sentiment;
  buriedReasons: BuriedReason[];
  /** Search rank where it was found — higher means more buried. */
  rank?: number;
}

/** The divergence between the marketed story and what real users say. */
export interface SentimentGap {
  /** What the brand / top results push. */
  marketingClaim: string;
  /** What candid sources actually report. */
  realityFinding: string;
  /** 0-100: how large the divergence is. */
  gapScore: number;
}

/** A concrete thing the marketing doesn't tell you. */
export interface HiddenInsight {
  /** e.g. "Battery degrades ~20% within 6 months". */
  point: string;
  /** How many independent sources mention it. */
  supportCount: number;
  sentiment: Sentiment;
}

/** One step in the research agent's visible trace ("watch it work"). */
export interface AgentStep {
  /** Short label, e.g. "Searching Reddit" or "Reading long-term reviews". */
  label: string;
  /** Optional detail, e.g. "12 candid sources". */
  detail?: string;
  status: "running" | "done";
}

/** The full result of digging into one query. */
export interface DigResult {
  /** What the user searched (product / place / company). */
  query: string;
  /** The synthesised, plain-spoken "honest verdict" paragraph. */
  verdict: string;
  overallSentiment: Sentiment;
  /** 0-100 honest trust score derived from candid sources. */
  trustScore: number;
  hiddenInsights: HiddenInsight[];
  buriedReviews: BuriedReview[];
  sentimentGaps: SentimentGap[];
  /** How many pages/sources we scanned to produce this. */
  sourcesScanned: number;
  /** How many distinct, targeted web searches the agent ran. */
  searchesRun?: number;
  /** The agent's research trace, for the "watch it work" UI. */
  agentSteps?: AgentStep[];
  /** ISO timestamp, stamped by the API. */
  generatedAt: string;
  /** True when served from canned data (no API keys configured). */
  usedMock: boolean;
}

/** Inbound API request shape. */
export interface DigRequest {
  query: string;
}
