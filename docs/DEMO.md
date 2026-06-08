# Demo video script — hidden.reviews (~2 min)

Goal: in 2 minutes a judge should *get it*, *believe it's real*, and *remember it*.
hidden.reviews is a **declassified intelligence archive for the honest web** — an AI
investigator that digs up the buried testimony marketing hides, and files it. Talk
over a screen recording. Keep it fast.

## ⚠️ Before you hit record (read this)
- **Warm the site up first.** The first live search after the site has been idle can
  be slow (serverless cold start, ~60s). 1–2 minutes before recording, run **one
  throwaway live search** (e.g. "AirPods Pro 2") and let it finish. After that, live
  searches land in ~25s.
- For the live beat, pick a **fresh** product you have *not* searched yet (so it runs
  live, not from server cache) — e.g. "Sony WH-1000XM5". The example case files
  (Dyson V15 · Dune Part Two · Joe's Pizza NYC) are **instant**.
- Open https://hidden-reviews.vercel.app in a clean window. **Keep the URL bar
  visible** — it reinforces the domain (every case is `hidden.reviews/<slug>`).
- Optional: Claude Desktop with the MCP server added (snippet at the bottom).
- Record at 1080p+, no dead air. You can **speed-ramp the ~25s live search** in editing.

## Shot-by-shot

**[0:00–0:12] The problem (hook)**
> "The first reviews you ever see are marketing. The honest ones — 'I owned this two
> years, here's what broke' — are buried pages deep. And asking an AI just summarizes
> the same shiny surface."
- B-roll: a glowing 5★ product page, then a Google results page 3 with a candid Reddit thread.

**[0:12–0:22] The reveal — The Archive**
> "hidden.reviews. Reviews are usually hidden. Not here."
- Land on the homepage. Let the serif hero land, then the **wall of redacted case files**.
- **Hover a case card** — the censor bar wipes away to reveal the buried quote underneath.
  (Do this — it's the signature interaction.)

**[0:22–0:40] Open a case (instant)**
- Click **Dyson V15** → the dossier opens instantly.
> "Every case is a dossier: an honest verdict, a trust score, what the marketing won't
> tell you — and the buried testimony, declassified."
- Scroll: the **redaction bars wipe** as quotes come into view. **Click a
  'Read it on reddit.com →' link** so the real thread opens. (Credibility beat — do it.)
- Point at the **Marketing vs. reality** gap bars.

**[0:40–1:06] The money shot — watch it work LIVE**
- Back to the Archive. Type a fresh product ("Sony WH-1000XM5") and hit **Dig**.
- The URL becomes **hidden.reviews/sony-wh-1000xm5** and the **live investigation streams**.
> "Type anything and it runs live. This is a research agent — it plans angles for *this*
> subject, searches the live web in parallel via Nimble, reads what came back, finds the
> gap, and digs again."
- Point at the streaming steps: Planning → Searching → **Assessing coverage** →
  **Digging deeper** → Reading.

**[1:06–1:26] The filed verdict — with receipts**
- The dossier lands (note the green **LIVE · NIMBLE** badge).
> "An honest verdict and a trust score — and every quote links to its real source.
> Nothing is hallucinated; the URLs come straight from the live Nimble search."
- Scroll to **"How the agent dug"** — the investigation log:
  **6 Nimble searches · N live sources · M buried takes**, then the 5-step trace.

**[1:26–1:46] It's also an MCP server**
- Scroll to **"Give your AI clearance"** (or switch to Claude Desktop).
> "LLMs are blind to buried reviews. hidden.reviews is a remote MCP server — so Claude,
> Cursor, or ChatGPT can see the honest web, right inside your workflow."
- If using Claude Desktop: ask *"Use hidden reviews to check the Sony WH-1000XM5."* —
  show the tool call + result.

**[1:46–2:00] Close on the domain**
> "Reviews are usually hidden. Not here. hidden dot reviews."
- Show the wordmark / URL bar. End.

## One-liner if a judge asks "how?"
Claude plans 4–5 tailored search angles → Nimble searches the live web in parallel
(~6 searches, ~35–44 sources) → the agent assesses its own coverage and re-searches the
gap → Claude synthesises with index-grounded citations (so sources can't be faked).
Next.js on Vercel; also a remote MCP server. Every case is a shareable
`hidden.reviews/<slug>` URL.

## MCP config for the demo (Claude Desktop / Cursor)
```json
{
  "mcpServers": {
    "hidden-reviews": { "url": "https://hidden-reviews.vercel.app/api/mcp" }
  }
}
```

## Recording tips
- Lead with instant case files; do exactly **one** live search (and warm the site first).
- Keep it under 2:00 — judges skim. The redaction reveals and the live trace are the stars.
- End on the domain.
