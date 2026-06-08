# Devpost submission — hidden.reviews

> Paste-ready copy for the Devpost form. Tagline, then each section maps to a Devpost field.

---

**Project name:** hidden.reviews

**Tagline:** Reviews are usually hidden. Not here. — an AI agent that digs the honest, buried reviews off the live web.

**Elevator pitch (one line):** hidden.reviews is an agentic research tool that searches the live web across Reddit, Trustpilot, forums, and long-form blogs to surface the candid, buried reviews that polished top-of-search results and shallow AI answers miss — before you buy, book, or watch.

---

## Inspiration

The top of every search result is marketing. The real opinions — the "I've owned this 2 years and here's what broke," the downvoted-but-honest Reddit comment, the niche blog teardown — are buried pages deep. And when you ask ChatGPT, it confidently summarizes the same shiny surface. We kept getting burned: great star ratings, miserable reality.

We drew the Domain Roulette domain **`hidden.reviews`** and it was instantly the product: a place where the *hidden* reviews aren't hidden anymore.

## What it does

Search any product, place, company, restaurant, or movie. A research agent:

1. **Plans** 4–5 search angles tailored to what you searched (a movie → Letterboxd + film subs; a product → Reddit + Trustpilot + long-term blogs; a restaurant → Yelp + local subs).
2. **Searches** the live web on all angles in parallel via Nimble, pulling ~35 candid sources.
3. **Assesses** what came back, names the biggest coverage gap, and **re-searches** to fill it.
4. **Synthesizes** an honest verdict: a 0–100 trust score, "what the marketing doesn't tell you," marketing-vs-reality gaps, and buried-review quotes — each linked to its real source.

You watch every step stream live, then it files a **dossier** — buried quotes load *redacted* and declassify as you read, each linked to its real page. The home page is an **archive of case files** you can browse, and every investigation lives at its own shareable **`hidden.reviews/<slug>`** URL. Because it's also a **remote MCP server**, your AI assistant (Claude, Cursor, ChatGPT) can call it as a tool.

## How we built it

- **Next.js 16 + TypeScript + Tailwind v4** on Vercel.
- **Nimble Search API** as the agent's eyes on the live web — multi-angle, domain-targeted (`include_domains`), parallel, resilient.
- **Claude Sonnet 4.6** for the planning, the coverage-assessment feedback loop, and the structured synthesis (`messages.parse` + Zod schemas).
- **Anti-hallucination by construction:** Claude cites every source by *index*; the real URL is rebuilt in code, so the model can never invent a source.
- **Server-Sent Events** stream the agent's trace to the UI.
- **mcp-handler** exposes it as a Streamable-HTTP MCP server (`/api/mcp`, tool `get_hidden_reviews`).
- Showcase queries are served from **pre-captured real digs** so demos are instant; everything else runs fully live.

## Challenges we ran into

- **Hard-to-scrape sources.** Reddit returns no full-page content even on deep scrapes; we lean on its rich snippets and let Nimble's deep extraction handle long-form sources.
- **Latency vs. the serverless cap.** A genuine multi-step agent that finishes inside Vercel's function limit meant careful bounding: parallel searches, per-search timeouts, and a graceful fallback that returns raw sources instead of ever erroring.
- **Honesty.** It's easy to make an "AI reviews" toy that hallucinates. Grounding every quote and URL to a real Nimble result — and labelling live vs. demo — was a core design constraint, not an afterthought.

## Accomplishments we're proud of

- A real **agentic loop** — plan → search → assess → re-search → synthesize — not a single API call with a prompt.
- **Zero hallucinated sources** by design.
- A **declassified-archive UI** that makes the idea legible at a glance: a wall of redacted case files that reveal on hover, and dossiers whose buried quotes declassify as you read.
- It hits **two prizes with one project**, and the product *is* the domain.

## What we learned

How to turn a single web-search API into an actual research agent: planning diverse angles, fanning out in parallel, and—crucially—reading the results to decide what to search *next*.

## What's next

A true multi-turn loop (keep digging until confidence is high), per-source credibility weighting, and one-click MCP install so any AI can see the reviews it's blind to.

## Built With

`nimble` `claude` `anthropic` `next.js` `typescript` `tailwindcss` `model-context-protocol` `vercel` `server-sent-events` `zod`

## Links

- **Live app:** https://hidden-reviews.vercel.app
- **MCP server:** https://hidden-reviews.vercel.app/api/mcp
- **Repo:** https://github.com/KaranSinghBisht/hidden-reviews
- **Demo video:** _(add link)_
