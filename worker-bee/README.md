# Marketing Worker Bee 🐝

**You run the business. Worker Bee spots the marketing in it.**

Worker Bee turns a small e-commerce store's own data into a ranked weekly list of marketing opportunities, each with a draft ready to approve. It is the CMO a 1–20 person store can't afford.

- **Opportunity-first, not content-first.** It says *what is worth saying*, grounded in the store's data, before writing anything.
- **Closed loop.** Every approved opportunity is measured, and the results reshape future suggestions.
- **Suggest-only.** Nothing publishes without the owner's approval.

This folder is the **clickable MVP prototype**, aligned to the *MVP Spec (5 Nov 2026)*. It runs on sample data for *Ember & Crust*, a **fictional** Irish Shopify store. The build rules and the full spec summary are in [`CLAUDE.md`](./CLAUDE.md).

```bash
cd worker-bee
npm install
npm run dev                  # the app
npm run engine               # headless engine run: ranked list + Monday digest
npm run engine -- --phase2   # include Phase 2 signals (news, lapsed customers)
```

## What's in the prototype

| Screen | What it shows | Spec section |
|---|---|---|
| **Monday digest** | Top 5 by ICE, each card with Why now / Do this / Draft ready / We'll measure and the buttons Approve · Edit · Not now · Not relevant. Private notes (ops flags, customer thank-yous) sit below, outside the top 5 | Scoring & weekly digest |
| **Review queue** | Every detected opportunity with evidence, ICE breakdown, hand-off on approval, measurement plan, editable drafts, and the Claude API brief with personal data stripped | Suggest-only workflow; pilot review |
| **Results & learning** | Pilot success metrics vs targets; live items with measurement windows; log win / neutral / miss and watch Confidence and the ranking change; learned track record per signal | Feedback loop & measurement |
| **Signal library** | The 10 signals + Irish retail calendar, on/off and editable thresholds per store; Phase 2 signals start as off previews | Signal library |
| **Data sources** | Sources by phase with access notes, per-store sync health, forwarding address, email integration path, GDPR handling | Data sources, email integration, compliance |
| **Brand voice** | Tone, never-say list (every draft is checked), channels | Brand-voice onboarding |

On the sample data the MVP signals find **20 opportunities**. The digest's top 5 are:
1. Bundle the Nduja kit with Hot Honey: 97 co-orders, lift 2.9 (ICE 100)
2. Black Friday: 22 days to go (100)
3. Christmas delivery cut-off: 42 days to go (100)
4. Freezing & storing kits: 3 customer questions plus 2,710 search impressions at positions 15–20 (75)
5. Corporate pizza nights: 3 questions plus searches up 225% (75)

12 more are held back on purpose. Two recurring complaints (delivery timing, plastic packaging) go to the owner as private ops notes.

## How the engine works

```
 nightly sync          detect (one module per source)       merge + link        learn            rank                 digest
┌──────────────┐     ┌──────────────────────────────┐     ┌──────────────┐   ┌────────────┐   ┌───────────────┐   ┌──────────────┐
│ Shopify      │──▶  │ shopify.js  #3 #6 #7 #8 #10  │     │ same key →   │   │ outcomes + │   │ I × C × E     │   │ top 5, Mon   │
│ GSC (+GA4)   │──▶  │ gsc.js      #4 #5            │ ──▶ │ one opp,     │──▶│ dismissals │──▶│ (max 125)     │──▶│ 8:00, email  │
│ Review app   │──▶  │ reviews.js  #2               │     │ more signals │   │ per signal │   │               │   │ + web        │
│ Fwd. inbox   │──▶  │ inbox.js    #1 (+deal ctx)   │     │ = more conf. │   │ type/store │   └───────────────┘   └──────┬───────┘
│ Calendar     │──▶  │ calendar.js (seasonal)       │     └──────────────┘   └─────▲──────┘                              │
│ News (P2)    │──▶  │ news.js     #9               │                                │       approve → hand-off → measure ┘
└──────────────┘     └──────────────────────────────┘                                └──── win / neutral / miss ◀──────────
```

## Not in the prototype yet (next build)
- **Pilot engine in Python.** Scheduled jobs → Postgres (EU) → Postmark digest, with the same signal rules ported over and tested against fixtures.
- **Real connectors.** Shopify custom app, Google OAuth (GSC + GA4), a review-app API, Postmark inbound.
- **Claude API drafting.** The prototype uses templates. The brief it would send is shown in the app.
- **Real hand-off.** Shopify unpublished articles; Klaviyo campaign drafts in Phase 2.

All sample data (store, people, companies, news outlets and articles) is fictional.
