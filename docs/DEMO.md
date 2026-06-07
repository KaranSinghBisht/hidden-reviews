# Demo video script — hidden.reviews (~2 min)

Goal: in 2 minutes a judge should *get it*, *believe it's real*, and *remember it*. Talk over a screen recording. Keep it fast.

## Before you hit record
- Open https://hidden-reviews.vercel.app in a clean browser window.
- Have **Claude Desktop** open with the MCP server added (see snippet at the bottom) — or skip the MCP beat if short on time.
- Optional B-roll: a Google search for one product showing the honest stuff on page 3+, and the product's glossy marketing page.
- The example chips (Dyson V15 · Dune Part Two · Joe's Pizza NYC) are **instant**. Pick one **fresh** product (e.g. "Sony WH-1000XM5") to show the agent working live.

## Shot-by-shot

**[0:00–0:12] The problem (hook)**
> *Voiceover:* "The first reviews you ever see are marketing. The honest ones — the 'I owned this two years and here's what broke' — are buried pages deep. And asking an AI just summarizes the same shiny surface."
- Show: a glowing 4.5★ product page, then a Google result page 3 with a candid Reddit thread.

**[0:12–0:20] The reveal**
> "Reviews are usually hidden. Not here."
- Show: the hidden.reviews landing page. Let the tagline land.

**[0:20–0:52] The money shot — watch the agent work (LIVE)**
- Type a fresh product ("Sony WH-1000XM5"), hit search. Let the **live trace stream**.
> "This is a research agent. It plans search angles for *this* subject, searches the live web in parallel — Reddit, Trustpilot, forums, blogs — then reads what came back, spots the gap, and digs again."
- Point at the streaming steps as they appear: Planning → Searching (35+ sources) → **Assessing coverage** → **Digging deeper** → Reading.

**[0:52–1:18] The honest verdict — with receipts**
- Result loads: trust score, "What they don't tell you," **Marketing vs. reality** gap bars, buried reviews.
> "An honest verdict and a trust score — and every quote is linked to its real source. Nothing is hallucinated; the URLs come straight from the live search."
- **Click a buried Reddit/Trustpilot link** so it opens the real page. (This is the credibility beat — do it.)
- Scroll to **"How the agent dug"** — the trace, "6 targeted searches · N sources."

**[1:18–1:34] Breadth (instant)**
- Click **Dune Part Two** (instant) → "It curates from Letterboxd and film communities."
- Click **Joe's Pizza NYC** (instant) → "Or a restaurant, from Yelp and local Reddit. Anything."

**[1:34–1:52] It's also an MCP server**
- Switch to Claude Desktop. Ask: *"Use hidden reviews to check the Sony WH-1000XM5."* Show the tool call + result.
> "It's a remote MCP server too — so Claude, Cursor, or ChatGPT can see the reviews they're blind to, right inside your workflow."

**[1:52–2:00] Close on the domain**
> "Reviews are usually hidden. Not here. hidden dot reviews."
- Show the wordmark / URL. End.

## One-liner if a judge asks "how?"
Claude plans 4–5 tailored search angles → Nimble searches the live web in parallel (~6 searches, ~35 sources) → the agent assesses coverage and re-searches the gap → Claude synthesizes with index-grounded citations (so sources can't be faked). Next.js on Vercel; also an MCP server.

## MCP config for the demo (Claude Desktop / Cursor)
```json
{
  "mcpServers": {
    "hidden-reviews": { "url": "https://hidden-reviews.vercel.app/api/mcp" }
  }
}
```

## Recording tips
- Keep it under 2:00 — judges skim. The live trace (0:20–0:52) is the star; don't rush it.
- If a live query feels slow on the day, the example chips are instant — lead with one, then do one live.
- Record at 1080p, no dead air, end on the domain.
