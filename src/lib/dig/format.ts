import type { DigResult } from "@/lib/types";

/**
 * Render a DigResult as markdown text for MCP / LLM consumption.
 * This is what an agent (Claude, ChatGPT, Cursor) receives when it calls the
 * get_hidden_reviews tool — sourced, structured, and ready to relay.
 */
export function formatDigAsText(r: DigResult): string {
  const lines: string[] = [];

  lines.push(`# Hidden reviews for "${r.query}"`);
  lines.push("");
  lines.push(
    `**Honest verdict** — trust ${r.trustScore}/100, ${r.overallSentiment} consensus:`,
  );
  lines.push(r.verdict);

  if (r.hiddenInsights.length > 0) {
    lines.push("");
    lines.push("## What they don't tell you");
    for (const i of r.hiddenInsights) {
      lines.push(`- ${i.point} (${i.supportCount} sources, ${i.sentiment})`);
    }
  }

  if (r.sentimentGaps.length > 0) {
    lines.push("");
    lines.push("## Marketing vs. reality");
    for (const g of r.sentimentGaps) {
      lines.push(
        `- Marketing: ${g.marketingClaim} → Reality: ${g.realityFinding} (gap ${g.gapScore}%)`,
      );
    }
  }

  if (r.buriedReviews.length > 0) {
    lines.push("");
    lines.push("## Buried reviews (with sources)");
    for (const b of r.buriedReviews) {
      lines.push(
        `- "${b.quote}" — ${b.sourceName} <${b.url}> [${b.buriedReasons.join(", ")}]`,
      );
    }
  }

  lines.push("");
  lines.push(
    `_Scanned ${r.sourcesScanned} sources · ${r.usedMock ? "demo data" : "live web via Nimble"}._`,
  );

  return lines.join("\n");
}
