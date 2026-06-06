# DWNY 2026 — DeveloperWeek New York Hackathon — Build Plan

> **For the next Claude Code instance:** You are building a submission to win cash at the
> **DeveloperWeek New York 2026 Hackathon** ("DWNY") on Devpost — deadline **June 10, 2026,
> 10:00 AM EDT** (the earliest in the campaign). The cash is concentrated in two sponsor tracks, and
> the single best move is to **build ONE project that double-dips: a `name.com` "Domain Roulette"
> entry that is also a Nimble live-web agent.** That makes you eligible for **$2,500 (name.com 1st)
> + $500 (Nimble 1st) simultaneously.** This is the lowest-effort-per-dollar target. Read this whole
> file, then start.

---

## At a glance

| | |
|---|---|
| **Official name** | DeveloperWeek New York 2026 Hackathon (DWNY = DeveloperWeek New York) |
| **Host** | DevNetwork |
| **Sponsors** | **name.com**, **Nimble**, **Tower**, Runpod |
| **URL** | https://dwny-2026-hackathon.devpost.com/ · rules: https://dwny-2026-hackathon.devpost.com/rules |
| **Status** | OPEN |
| **Submission deadline** | **June 10, 2026, 10:00 AM EDT** — *no late submissions* |
| **Finalist logistics** | Top-5 notified by phone ~1 PM; demo + Q&A on Main Stage ~3 PM (June 10). **Be reachable.** |
| **Format** | Hybrid (online OK; awards at TWA Hotel, Queens NY); teams 1–5; solo allowed; 18+ |
| **Eligibility** | Most countries (standard Devpost exclusions) |

### Prizes (~$8,500+; cash is in two tracks)
- **name.com "Domain Roulette": 1st $2,500 cash · 2nd $1,000 cash** ← the real money
- **Nimble "Agentic App That Sees the Live Web": 1st $500 Amazon GC + $500 Nimble credits · 2nd
  $250 + $250**
- **Overall Winner:** non-cash (Amazon Echos, conference passes, announced to 60k subscribers)
- **Tower "Data-to-AI Pipeline":** non-cash (6 mo Tower + "Brick for Builders" devices); every team
  gets 2 months free Tower
- Runpod: sponsor (compute), no published challenge

> ⚠️ **Don't confuse with the San Jose "DeveloperWeek 2026" event** (different sponsors — Perfect
> Corp, Retool, etc.). Build for **name.com / Nimble / Tower.**

---

## The winning project (recommended — the double-dip)

> **Grab a domain from https://domainroulette.dev/ whose theme suggests "live web / research /
> monitoring," then build it as a polished Nimble-powered agentic web app.** One project → eligible
> for **name.com Domain Roulette ($2,500/$1,000)** AND **Nimble ($500+$500 / $250+$250)**.

**Why it wins:** name.com judges on *creative interpretation of the domain + technical execution +
polish + originality + how deeply the project connects back to the domain* — a solo dev with Claude
Code + a clean UI can nail that. Nimble wants an agentic app that *searches/browses/extracts live
web data*. A monitoring/research app satisfies both rubrics at once, and most teams won't structure
for the double-dip.

**Example:** assigned domain `pricewatch.*` (or similar) → an agent that uses **Nimble
Crawl/Extract** to track competitor prices/availability across the live web, reasons over changes,
and emails/alerts the user. The name ties tightly to the build (scores name.com) and it literally
"sees the live web" (scores Nimble).

### Backups
- **name.com "surprise-delight" play:** take an absurd assigned domain and turn it into a genuinely
  useful or delightful polished micro-product. name.com explicitly rewards "unexpected domain →
  surprisingly thoughtful/useful." Pure creativity + polish.
- **Tower Data-to-AI pipeline** (lowest competition, but non-cash): messy public dataset → dbt
  transform on Tower → AI agent answers questions → Marimo/Hex dashboard. High win-probability for
  credits + Brick devices.

---

## Required tech (per chosen track)

- **name.com Domain Roulette** → build around a **domainroulette.dev**-assigned domain; any stack.
- **Nimble** → must use Nimble's **Search / Extract / Crawl / Map / Web Search Agents / MCP server /
  APIs**. Discord: https://discord.gg/qRptsGRVh · email hackathon2026@nimbleway.com.
- **Tower** → tower.dev Python serverless/orchestration/lakehouse (+ optional Hex/Marimo, dbt).

Recommended stack: **Next.js + Tailwind + shadcn/ui** front end, **Nimble MCP/API** for live-web
data, deploy to **Vercel**.

---

## Architecture

```
[ Next.js app on Vercel ]
        │  (UI themed tightly around the assigned domain)
        ▼
[ Agent / server actions ]  ──▶ [ Nimble: Search / Extract / Crawl / MCP ]  ──▶ live web data
        │
        └──▶ reason over results ──▶ alerts / dashboard / output to user
```

---

## Build plan

**Phase 0 — Setup (day 1)**
1. Register on Devpost; form/confirm team (≤5). Join Nimble Discord.
2. Go to https://domainroulette.dev/ and **claim a domain** that fits a live-web/monitoring/research
   idea. Lock the concept around it.
3. Get Nimble API access/credits.

**Phase 1 — Core**
4. Scaffold Next.js + Tailwind + shadcn. Wire the **Nimble MCP/API** for live-web data.
5. Build the agent loop: query the live web → extract → reason → produce the user-facing output.

**Phase 2 — Tie it to the domain (this is scored)**
6. Make the product *obviously* about the assigned domain — name, copy, UX all reinforce it. The
   "depth of connection to the domain" is an explicit name.com criterion.

**Phase 3 — Polish + deploy**
7. Deploy to Vercel; get a working public URL. Polish the UI (polish is scored by name.com).

**Phase 4 — Submission**
8. Record a tight **≤2-min** demo (no explicit cap published, but keep it short).
9. Devpost fields: project name, elevator pitch, full description ("the whole story"), team,
   technologies, screenshots, project link, video.
10. **Frame the Feasibility story** ("who pays for this, why it's a business") — Round-1 Overall
    judges score Progress / Concept / Feasibility.
11. Submit before **June 10, 10:00 AM EDT**. **Be phone-reachable 10 AM–3 PM EDT on June 10** in case
    you make the top 5.

---

## Judging criteria → how we map

- **Round 1 (Overall, non-cash):** Progress (how far you got) · Concept (real problem?) ·
  Feasibility (could it be a business?). Ship something finished and narrate the business case.
- **Round 2 (sponsor tracks, the cash):**
  - **name.com:** creative domain interpretation · technical execution · polish/experience ·
    concept strength/originality · **depth of connection to the domain**.
  - **Nimble:** fit to "agentic app that sees the live web" + technical impressiveness.

The judging panel is senior enterprise engineers — **working software + a crisp "this could be a
real business" story beats flashy-but-broken.**

---

## Pitfalls to avoid

- ❌ A generic AI chatbot with no domain/sponsor tie-in — ineligible for cash, forgettable in R1.
- ❌ Over-scoping in ~11 days — **Progress is an explicit criterion**; a finished narrow app beats an
  unfinished ambitious one.
- ❌ Missing the **June 10, 10 AM EDT** hard cutoff, or being **unreachable by phone** at 1 PM (you
  can lose the top prize by not answering).
- ❌ Confusing this with the San Jose DeveloperWeek event.

---

## Demo video script (≤2:00)

1. **0:00–0:15** — "We were assigned the domain `X` — here's what we built around it."
2. **0:15–1:15** — Live walkthrough: the agent pulls live web data via Nimble, reasons, and delivers
   the output; show the domain tie-in throughout.
3. **1:15–1:45** — Why it's useful + the business case (Feasibility).
4. **1:45–2:00** — Close on the polished UI + domain branding.

---

## Key links

- Hackathon: https://dwny-2026-hackathon.devpost.com/ · rules: https://dwny-2026-hackathon.devpost.com/rules · updates: https://dwny-2026-hackathon.devpost.com/updates
- Domain Roulette: https://domainroulette.dev/
- Nimble: Discord https://discord.gg/qRptsGRVh · hackathon2026@nimbleway.com
- Tower: https://tower.dev · Brick devices: https://getbrick.app
- Official instructions (Google Doc): linked from the Devpost overview page
