import type {
  BuriedReview,
  DigResult,
  HiddenInsight,
  SentimentGap,
  Sentiment,
} from "@/lib/types";

/** A canned dig minus the fields the orchestrator stamps on. */
interface Fixture {
  verdict: string;
  overallSentiment: Sentiment;
  trustScore: number;
  hiddenInsights: HiddenInsight[];
  buriedReviews: BuriedReview[];
  sentimentGaps: SentimentGap[];
  sourcesScanned: number;
}

const DYSON_V15: Fixture = {
  trustScore: 64,
  overallSentiment: "mixed",
  sourcesScanned: 47,
  verdict:
    "The Dyson V15 genuinely cleans well, and owners love it for the first year. The buried story is longevity: across candid threads the non-replaceable battery degrades noticeably within 18–24 months, replacement parts are pricey, and the brush still clogs on long hair. Buy it for the suction, not for the 'lasts forever' promise.",
  hiddenInsights: [
    { point: "Battery is not user-replaceable and noticeably degrades within ~2 years", supportCount: 23, sentiment: "negative" },
    { point: "Still clogs with long / pet hair despite the anti-tangle claim", supportCount: 14, sentiment: "negative" },
    { point: "Raw suction is genuinely class-leading when new", supportCount: 31, sentiment: "positive" },
  ],
  buriedReviews: [
    {
      quote:
        "Mine's 20 months old and runtime went from 60 min to about 12. The battery is $90 and a pain to swap. Love the suction, hate the lifespan.",
      sourceKind: "reddit", sourceName: "r/vacuumcleaners", url: "https://www.reddit.com/r/vacuumcleaners/",
      author: "u/clean_freak92", date: "2025-11-02", sentiment: "negative",
      buriedReasons: ["candid_community", "low_search_rank"], rank: 14,
    },
    {
      quote: "Marketing says it 'de-tangles automatically'. With two long-haired cats I'm cutting hair off the brush every week.",
      sourceKind: "reddit", sourceName: "r/dyson", url: "https://www.reddit.com/r/dyson/",
      author: "u/petparent", date: "2026-01-18", sentiment: "negative",
      buriedReasons: ["contrarian", "candid_community"], rank: 9,
    },
    {
      quote: "Three stars. Incredible when new, but battery and filter costs add up fast. Wish I'd known before buying.",
      sourceKind: "trustpilot", sourceName: "Trustpilot", url: "https://www.trustpilot.com/",
      date: "2025-09-12", sentiment: "mixed", buriedReasons: ["downvoted_or_old"], rank: 22,
    },
  ],
  sentimentGaps: [
    { marketingClaim: "Powerful suction that lasts.", realityFinding: "Suction is great; battery life drops sharply after ~18 months.", gapScore: 58 },
    { marketingClaim: "Anti-tangle conehead brush bar.", realityFinding: "Still tangles with long / pet hair for many owners.", gapScore: 44 },
  ],
};

const NOTION: Fixture = {
  trustScore: 71,
  overallSentiment: "mixed",
  sourcesScanned: 52,
  verdict:
    "Notion is beloved for its flexibility, but the buried complaints are remarkably consistent: it gets sluggish on large workspaces, offline mode is unreliable, and teams worry about lock-in because exports are messy. Great for individuals and small teams — pressure-test performance before betting a whole company on it.",
  hiddenInsights: [
    { point: "Noticeable slowdown / lag on large or image-heavy workspaces", supportCount: 19, sentiment: "negative" },
    { point: "Offline mode is unreliable despite being advertised", supportCount: 16, sentiment: "negative" },
    { point: "Extremely flexible — people genuinely run their whole life in it", supportCount: 28, sentiment: "positive" },
  ],
  buriedReviews: [
    {
      quote: "Once our workspace passed a few thousand pages, search and page loads got painfully slow. Support basically said 'archive stuff'.",
      sourceKind: "reddit", sourceName: "r/Notion", url: "https://www.reddit.com/r/Notion/",
      author: "u/pm_overload", date: "2025-12-04", sentiment: "negative",
      buriedReasons: ["candid_community", "low_search_rank"], rank: 11,
    },
    {
      quote: "'Works offline' is a stretch. I lost edits on a flight twice. Now I draft elsewhere and paste in.",
      sourceKind: "forum", sourceName: "Hacker News", url: "https://news.ycombinator.com/",
      author: "throwaway_hn", date: "2025-10-21", sentiment: "negative",
      buriedReasons: ["contrarian"], rank: 7,
    },
    {
      quote: "Love it for personal use, but exporting to move off it is a mess of broken links. Mild lock-in anxiety.",
      sourceKind: "blog", sourceName: "indie dev blog", url: "https://example.com/notion-lockin",
      date: "2026-02-09", sentiment: "mixed", buriedReasons: ["niche_source"], rank: 18,
    },
  ],
  sentimentGaps: [
    { marketingClaim: "Fast, all-in-one workspace.", realityFinding: "Slows down at scale; large workspaces lag.", gapScore: 49 },
    { marketingClaim: "Take your work offline.", realityFinding: "Offline editing is unreliable and can lose changes.", gapScore: 63 },
  ],
};

const HERO: Record<string, Fixture> = {
  "dyson v15": DYSON_V15,
  notion: NOTION,
};

/** Loose match so "dyson v15 detect" still finds the Dyson fixture. */
function matchHero(query: string): Fixture | undefined {
  const norm = query.trim().toLowerCase();
  if (HERO[norm]) return HERO[norm];
  for (const k of Object.keys(HERO)) {
    if (norm.includes(k) || k.includes(norm)) return HERO[k];
  }
  return undefined;
}

/** Believable result for any query, so a live demo never breaks on unknown input. */
function generateGeneric(query: string): Fixture {
  const name = query.trim() || "this product";
  const q = encodeURIComponent(name);
  return {
    trustScore: 61,
    overallSentiment: "mixed",
    sourcesScanned: 38,
    verdict:
      `Page-one results for ${name} are mostly polished marketing and affiliate roundups. Dig into candid communities and a more mixed picture appears: a solid core experience, but recurring complaints about reliability after the honeymoon period, slow support, and value that depends heavily on which plan you land on. Worth it — with eyes open.`,
    hiddenInsights: [
      { point: `Reliability / consistency complaints about ${name} recur in candid threads`, supportCount: 12, sentiment: "negative" },
      { point: "Customer support is widely described as slow to respond", supportCount: 9, sentiment: "negative" },
      { point: `The core experience of ${name} still wins fans when it works`, supportCount: 17, sentiment: "positive" },
    ],
    buriedReviews: [
      {
        quote: `Honestly ${name} was great at first, then a few months in the cracks showed. Not the flawless thing the page-one reviews sell.`,
        sourceKind: "reddit", sourceName: "Reddit thread", url: `https://www.reddit.com/search/?q=${q}`,
        sentiment: "mixed", buriedReasons: ["candid_community", "low_search_rank"], rank: 13,
      },
      {
        quote: `The 5-star reviews feel planted. The detailed 2–3 star ones tell you what ${name} is actually like to live with.`,
        sourceKind: "trustpilot", sourceName: "Trustpilot", url: `https://www.trustpilot.com/search?query=${q}`,
        sentiment: "negative", buriedReasons: ["contrarian", "downvoted_or_old"], rank: 20,
      },
    ],
    sentimentGaps: [
      { marketingClaim: `${name} is the best in its class.`, realityFinding: "Strong start, but reliability and support drag the real-world experience down.", gapScore: 47 },
    ],
  };
}

/** Mock dig: a small delay so the "digging" state is felt, then canned data. */
export async function mockDig(query: string): Promise<DigResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const fixture = matchHero(query) ?? generateGeneric(query);
  return {
    query: query.trim(),
    ...fixture,
    generatedAt: new Date().toISOString(),
    usedMock: true,
  };
}
