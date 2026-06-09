# Demo video script — hidden.reviews (~1:55)

Goal: in under two minutes a judge should *get it*, *believe it's real*, and *remember it*.
hidden.reviews is a **declassified intelligence archive for the honest web** — an AI
investigator that digs up the buried testimony marketing hides, and files it.
Voiceover over a screen recording. Total VO ≈ 230 words — comfortable at a calm pace.

## ⚠️ Before you hit record

1. **Warm the site.** 1–2 min before recording, run one throwaway live search
   (e.g. "AirPods Pro 2") and let it finish. First call after idle can take ~60s
   (cold start); after that, live digs land in ~25s.
2. For the live beat use a **fresh** term you have NOT searched (cached terms return
   instantly and skip the live stream). Suggested: **"Sony WH-1000XM5"**.
   Already burned: AirPods Pro 2 (warm-up), Anker 737, Sennheiser Momentum 4, Bose QC Ultra.
3. Record at 1080p+, clean browser window. URL bar optional — if visible, fine,
   but **never end the video on it**; end on the wordmark.
4. Prepare two B-roll screenshots for the hook: a glossy 5★ product page, and a
   Google results page 3 with a candid Reddit thread.
5. If the live dig errors on camera: click "Reopen the investigation" once; if it
   fails again, open a case on file and say "here's one the agent filed earlier."

## Shot-by-shot (durations + exact voiceover)

**[0:00–0:10] THE HOOK — B-roll (10s)**
Show: glossy 5★ product page → cut to Google page 3 with a buried Reddit thread.
> VO: "The first reviews you see are marketing. The honest ones — 'I've owned this
> two years, here's what broke' — are buried pages deep. And your AI assistant?
> It only summarizes the shiny surface."

**[0:10–0:22] THE REVEAL — the Archive (12s)**
Show: land on the homepage; let the serif hero breathe for 2s; scroll to the wall
of case files; **hover two cards slowly** so the censor bars wipe away on camera.
> VO: "hidden dot reviews. A declassified archive for the honest web. Every case
> file is redacted — until you look."

**[0:22–0:40] OPEN A CASE — instant dossier (18s)**
Show: click **Dyson V15** → dossier opens instantly. Scroll steadily: trust score 62,
verdict, "What they don't tell you", redaction bars wiping as quotes enter view.
**Click one "Read it on reddit.com →" link** and show the real thread for a beat.
> VO: "Every case is a dossier: an honest verdict, a trust score, what the marketing
> won't tell you — and the buried testimony, declassified. Every quote links to the
> real page it came from. Nothing is generated."

**[0:40–0:57] THE MONEY SHOT — watch it dig, live (17s on screen; speed-ramped)**
Show: back to the Archive. Type **Sony WH-1000XM5**, hit Dig. The URL becomes
`/sony-wh-1000xm5` and the live investigation streams. Run at 1× for the first two
steps — **the actual Nimble queries appear on screen under "Searching the live web
via Nimble"** — then 2× through the rest, back to 1× as the dossier lands.
> VO: "Type anything, and a research agent goes to work — live. It plans search
> angles for this exact product, fires them in parallel on the live web through
> Nimble — those are the real queries — reads what came back, finds the coverage
> gap, and digs again."

**[0:57–1:20] THE FILED VERDICT — receipts (23s)**
Show: the dossier lands with the green **LIVE · NIMBLE** badge. Linger on verdict +
trust score; scroll the marketing-vs-reality gap bars; stop on **"How the agent
dug"**: the stat banner — N Nimble searches · N live sources · N buried takes —
and the step-by-step trace.
> VO: "Minutes old, straight off the live web. An honest verdict, the gap between
> the marketing and reality — and the receipts: every search the agent ran, every
> source it read. The URLs come straight from Nimble results, so the agent can't
> invent a source even if it wanted to."

**[1:20–1:27] THE METHOD — flash (7s)**
Show: scroll the "How the investigation works" timeline — the five steps with
NIMBLE and CLAUDE chips, the feedback-loop tag visible.
> VO: "Plan, search, assess, dig deeper, file. A real agent loop — not one prompt."

**[1:27–1:42] GIVE YOUR AI CLEARANCE — MCP (15s)**
Show: the "Give your AI clearance to the honest web" section; let the terminal
animation play a full tool call; flash the mcp.json snippet.
> VO: "And it's a remote MCP server. Add one URL, and Claude, Cursor, or ChatGPT
> can pull the honest, buried reviews they're blind to — right inside your chat."

**[1:42–1:52] CLOSE — the domain (10s)**
Show: back to the Archive; slow push toward the header wordmark **hidden.reviews**.
Hold on the wordmark. End there — not on the browser URL bar.
> VO: "Reviews are usually hidden. Not here. hidden dot reviews — built for
> DeveloperWeek New York."

## One-liner if a judge asks "how?"

Claude plans 4–5 tailored search angles → Nimble searches the live web in parallel
(~6 searches, 30–44 sources) → the agent assesses its own coverage and re-searches
the gap → Claude synthesizes with index-grounded citations (sources can't be faked).
Next.js on Vercel; also a remote MCP server. Every case is a shareable
`hidden.reviews/<slug>` URL.

## MCP config (Claude Desktop / Cursor)

```json
{
  "mcpServers": {
    "hidden-reviews": { "url": "https://hidden-reviews.vercel.app/api/mcp" }
  }
}
```

## Recording tips

- Seeded case files (Dyson V15 · Dune Part Two · Joe's Pizza NYC · Notion ·
  Peloton Bike+) are always instant — lead with one.
- Exactly **one** live search on camera, site warmed, fresh term.
- Hover the case cards *slowly* — the redaction wipe is the signature; give it air.
- The live-dig speed ramp does the pacing work: 1× → 2× → 1× on landing.
- No dead air; cut tight between beats. End on the wordmark.
