# hidden.reviews

**Reviews are usually hidden. Not here.**

The top of every search result is polished, SEO-optimised marketing. The honest takes — the ones real people leave on Reddit, Trustpilot, niche forums, and long-form blogs — are buried pages deep, and a quick question to ChatGPT only skims the surface. **hidden.reviews** is an AI research agent that digs them out: it sees the live web, reads the candid sources, and gives you the honest verdict before you buy, book, or watch.

🔗 **Live:** https://hidden-reviews.vercel.app · 🔌 **MCP server:** `https://hidden-reviews.vercel.app/api/mcp`

Built for **DeveloperWeek New York 2026** — name.com *Domain Roulette* (`hidden.reviews`) + Nimble *agentic live-web app*.

---

## What it does

Search any product, place, company, restaurant, or movie. The agent returns:

- an **honest verdict** + a 0–100 **trust score**
- **what the marketing doesn't tell you** (sourced)
- **marketing vs. reality** sentiment gaps
- **buried reviews** — candid quotes with the real source URL

…and it streams its reasoning live so you watch it work.

## How the agent works (it's not one API call)

```
query
  │
  ├─ 1. PLAN     Claude reasons about the subject and designs 4–5 distinct
  │              search angles, tailored to what it is:
  │                product   → Reddit · Trustpilot/Sitejabber · long-term blogs
  │                movie     → Letterboxd · r/movies · audience reviews
  │                restaurant→ Yelp · local Reddit · candid write-ups
  │
  ├─ 2. SEARCH   Runs every angle against Nimble in PARALLEL — domain-targeted
  │              live-web searches — then dedupes (~20–38 sources per dig).
  │
  ├─ 3. READ     Claude synthesises the candid sources into a structured,
  │              honest verdict. It cites sources by INDEX; the real URLs are
  │              rebuilt in code, so a source can never be hallucinated.
  │
  └─ 4. STREAM   Every step is streamed to the UI (SSE) — plan, search, read.
```

Each step is visible in the result's **"How the agent dug"** trace.

## Using Nimble heavily

The engine is built on the **Nimble Search API** (`/v1/search`) and uses it as a real toolbox, not a single call:

- **Multi-angle search** — 4–5 distinct, model-planned queries per dig
- **Domain targeting** — `include_domains` to hit Reddit, Trustpilot, Letterboxd, Yelp… specifically
- **Depth** — `search_depth` for snippet vs. full-page content
- **Parallel + resilient** — `Promise.allSettled`, per-search timeouts; one angle failing never sinks the dig

## Honest by construction

- **No hallucinated sources.** Claude references each source by index; `agent/run.ts` rebuilds the real URL/host from the Nimble result.
- **Live vs. demo is labelled.** Real digs show a `Live · Nimble` badge; the showcase queries are pre-captured *real* digs (so a demo never waits on — or fails — a live call), and everything else runs fully live.
- **Graceful, never a 500.** If synthesis is slow, the agent returns the raw buried sources it already pulled.

## As an MCP server

hidden.reviews is also a remote **MCP server**, so Claude / Cursor / ChatGPT can call it as a tool:

```json
{
  "mcpServers": {
    "hidden-reviews": { "url": "https://hidden-reviews.vercel.app/api/mcp" }
  }
}
```

Tool: `get_hidden_reviews(query)` → the honest, sourced verdict, formatted for an LLM.

## Stack

- **Next.js 16** (App Router, Turbopack) · TypeScript · Tailwind v4
- **Nimble Search API** — live-web intelligence
- **Claude Sonnet 4.6** — planning + structured synthesis (`messages.parse` + Zod)
- **mcp-handler** — Streamable HTTP MCP server
- Deployed on **Vercel**

## Architecture

```
src/lib/agent/plan.ts      model plans the search angles (adaptive)
src/lib/agent/gather.ts    runs the searches in parallel, dedupes
src/lib/agent/run.ts       orchestrates plan → search → synth, emits the trace
src/lib/nimble/client.ts   configurable Nimble Search client
src/lib/synth/claude.ts    structured, index-grounded synthesis
src/lib/dig/               cache → seed → mock → live, + SSE streaming
src/app/api/dig/stream     Server-Sent Events endpoint (the live trace)
src/app/api/mcp            remote MCP server
```

## Run locally

```bash
npm install
cp .env.example .env.local   # add NIMBLE_API_KEY + ANTHROPIC_API_KEY
npm run dev
```

Without keys it runs in **demo mode** (canned data) so the UI is fully explorable offline.
