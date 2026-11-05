# Marketing Worker Bee 🐝

**A marketing engine for small businesses. It reads the business's own data, finds the opportunities hidden in it, and drafts the content, so the owner can get back to the work that grows the business.**

> Real marketing is great service and lasting memories in customers' minds. The Worker Bee handles the rest: what to post, when, where, and at what aspect ratio.

This folder is a **clickable prototype**. It is built around *Ember & Crust*, a **fictional** Cork pizza-kit and coffee business, with realistic sample data.

```bash
cd worker-bee
npm install
npm run dev        # the app
npm run engine     # the opportunity engine on its own, prints the ranked feed
```

---

## The problem

| Small business owner | Today's options |
|---|---|
| Too busy to think about marketing | Post whatever, whenever, or nothing |
| Too small for a CMO or an agency | Agencies run generic calendars and don't read the inbox, orders or reviews |
| Sitting on gold: customer questions, buying patterns, reviews | That data sits in 5 different tools and no one connects it |

**The insight:** the best marketing ideas are already in the business's data. A question 6 customers emailed is a blog post. Two products bought together are a bundle. A record order is a PR story. A staff member named in 5 reviews is a thank-you, and then a team spotlight.

---

## What the prototype does

1. **Reads** 5 sources: inbox, Shopify orders, Google reviews, industry news, Search Console.
2. **Detects** opportunities with explainable logic. Every card shows its evidence.
3. **Combines signals across sources.** If customers email a question *and* Google shows search demand, those merge into one stronger opportunity.
4. **Scores** each one: `impact × confidence × timeliness × effort`.
5. **Drafts** ready-to-use content per channel, already sized and specced (9:16 Reel scripts, 4:5 Instagram, GBP posts, blog briefs with FAQPage schema, press pitches, review replies, Shopify bundle setups).
6. **Plans**: approved items are slotted into a 2-week calendar on each channel's best days.
7. **Keeps it human**: a "Moments that matter" panel shows service moments (a regular's 10th order, a staff member praised by name) that are *not* content. They are relationships.

### Detectors (`src/engine/detectors/`)

| Source | Detector | Becomes |
|---|---|---|
| Inbox | Question sentences matched to watched topics (≥ 3 = pattern) | Blog/FAQ page + Reel + saved inbox reply |
| Inbox | Large quantities / € values + consent phrases ("happy for you to share") | PR story with a permission check |
| Orders | Market-basket analysis: support, confidence, **lift ≥ 2** | Bundle: Shopify setup, price, promo content |
| Orders | Share of orders, last 4 weeks vs previous 8 (≥ +50%) | "Rising star" spotlight + product idea |
| Orders | Orders ≥ €1,000 in the last 21 days | PR / case study |
| Orders | Customers hitting their 10th / 25th / 50th order this week | Handwritten-note prompt (private, never posted) |
| Reviews | Aspect-based sentiment, sentence level | Repeated praise → testimonials · repeated complaints → **fix first**, then "we listened" |
| Reviews | Staff named in ≥ 3 five-star reviews | Thank-you note + team spotlight (with consent) |
| Reviews | Unreplied reviews, worst first | Drafted replies |
| News | Industry-keyword relevance + topic match, decays over 14 days | LinkedIn take, journalist pitch, talking-head Reel, built from the owner's stated views |
| Search | Topic demand ranking > position 5 / no page | Content gap (merged with inbox questions) |
| Search | Queries in positions 4–15 on existing pages | Title/meta/FAQ quick wins |

On the sample data the engine finds **23 opportunities and 81 drafts (about 42 hours of marketing work)**. 13 of them are backed by more than one source.

### Guardrails built in
- **Evidence-first:** no generic "content ideas". Every card traces to real records.
- **Consent checks** wherever a customer, client or staff member is named.
- **Brand check** flags any phrase on the owner's "never say" list.
- **Fix before you market:** recurring complaints are routed to operations first.
- **Never invents commitments:** anything the owner must decide is left in `[brackets]`.

---

## From prototype to product

```
 Connectors            Opportunity engine              Generation             Owner
┌───────────┐   ┌─────────────────────────────┐   ┌─────────────────┐   ┌────────────┐
│ Gmail/365 │   │ detectors (rules + stats)   │   │ LLM agent with  │   │ Weekly     │
│ Shopify   │──▶│ + LLM classification/       │──▶│ brand profile,  │──▶│ briefing,  │
│ GBP       │   │   clustering                │   │ evidence and    │   │ approve /  │
│ GSC / GA4 │   │ merge → link → score        │   │ channel specs   │   │ snooze /   │
│ News/RSS  │   └─────────────────────────────┘   └─────────────────┘   │ dismiss    │
└───────────┘         ▲                                     │           └─────┬──────┘
                      └──── learns from approvals / dismissals ◀──────────────┘
```

- **What stays the same:** the opportunity schema, merge/score logic and channel specs in `src/engine/`.
- **What changes:**
  - The deterministic templates in `drafts.js` are replaced by LLM generation, using the structured brief from `buildPrompt()`. You can see it in the app under "Show the agent brief".
  - Keyword topic matching is upgraded to embedding clustering, so the Bee finds topics nobody told it to watch.
- **Feedback loop:** approvals and dismissals train the scoring for each business, so the Bee learns what *this* owner cares about.
- **Publishing:** Meta / GBP / Mailchimp / Shopify APIs, always behind owner approval.

### Suggested MVP path
| Phase | Scope | Proof point |
|---|---|---|
| 0–30 days | Gmail + GBP reviews + Shopify; weekly email briefing; drafts only | 5 pilot businesses open the briefing weekly |
| 30–60 days | GSC + news; in-app approve/schedule; GBP + Instagram publishing | ≥ 50% of top-3 opportunities approved |
| 60–90 days | Learning from approvals; GA4 attribution ("this post drove €X") | One pilot can tie revenue to a Bee opportunity |

---

## Project structure

```
worker-bee/
├── scripts/run-engine.js      # headless engine run
└── src/
    ├── data/                  # sample business profile + inbox, orders, reviews, news, search
    ├── engine/
    │   ├── detectors/         # one file per data source
    │   ├── index.js           # merge, link, score
    │   ├── drafts.js          # channel specs, draft templates, brand check, agent brief
    │   └── text.js            # matching, sentiment, dates
    └── components/            # Briefing, Feed, Detail, Draft studio, Plan, Sources, Brand
```

All sample data (business, people, companies, news outlets and articles) is fictional.
