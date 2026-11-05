# CLAUDE.md: Marketing Worker Bee

Read this before every session. It is the shared spec that every build session works from. Source: *Marketing Worker Bee: MVP Spec* (5 Nov 2026).

## Product in one line
Worker Bee turns a small e-commerce store's own data into a ranked weekly list of marketing opportunities, each with a draft ready to approve. **Opportunity-first, closed loop, suggest-only.**

## Locked decisions (don't change these without the owner)
| Decision | Choice |
|---|---|
| Delivery | SaaS, multi-tenant (every table has `store_id`, row-level security) |
| Go-to-market | Productised service first: 5–10 pilot stores before self-serve screens |
| Vertical | E-commerce (Shopify, then WooCommerce). Hospitality second |
| Autonomy | **Suggest only.** Nothing is published. Drafts go to the owner or into platforms unpublished |
| Build | Claude Code, no in-house dev; paid security review before public launch |

## What lives in this folder
`worker-bee/` is the **clickable MVP prototype** (React + Vite, sample data, runs offline). It is the reference for the digest, signal rules, ICE scoring, hand-off and feedback loop. The **pilot engine** is to be built as scheduled Python jobs (see "Pilot build" below). Port the logic in `src/engine/` across; don't reinvent it.

```
src/data/        fictional store (Ember & Crust, st_7f3a91) + sample inbox, orders, reviews, GSC, news, calendar, history
src/engine/
  signals.js     signal library: the 10 rules + calendar, default thresholds, phase
  detectors/     one module per connector: inbox, shopify, reviews, gsc, news, calendar
  index.js       merge (same mergeKey) → link (same topic) → learn (track record) → rank (ICE)
  outputs.js     per output type: Ease, hand-off on approval, measurement plan
  drafts.js      draft templates per opportunity kind, brand check, pseudonymised Claude brief
scripts/run-engine.js   headless run (shape of the nightly job): npm run engine [-- --phase2]
```

## Signal library v1 (defaults; tuned per store)
| # | Signal | Source | Default trigger | Phase |
|---|---|---|---|---|
| 1 | Repeated customer question | Inbox | Same cluster ≥ 3 times in 30 days | MVP |
| 2 | Review theme | Reviews | Same theme in ≥ 5 reviews in 60 days. Negative → private ops note only | MVP |
| 3 | Product pair | Shopify | ≥ 20 co-orders in 90 days and lift ≥ 1.5 | MVP |
| 4 | Striking-distance query | GSC | Avg position 8–20, ≥ 100 impressions in 28 days | MVP |
| 5 | Rising query | GSC | Impressions up ≥ 50% vs previous 28 days | MVP |
| 6 | Fast mover | Shopify | Units up ≥ 40% vs prior 4 weeks | MVP |
| 7 | Overstock | Shopify | > 90 days of stock at current sell rate | MVP |
| 8 | Milestone | Shopify | Customer order-count milestone, record day, unusually large order | MVP |
| 9 | Industry news | News feeds | Keyword match on store's topic list | Phase 2 |
| 10 | Lapsed customers | Shopify + Klaviyo | No order in 2× the customer's usual gap | Phase 2 |
| + | Irish retail calendar | Built in | Black Friday, Christmas cut-off, Mother's Day (March), St Patrick's, back to school | MVP |

Lift(A,B) = P(A∩B) / (P(A)·P(B)).

## Scoring
- **ICE = Impact × Confidence × Ease**, each 1–5, max 125. The owner sees the **top 5 only**, Monday 8:00 (email + web).
- Impact = revenue or traffic at stake (bucketed per signal).
- Confidence = data volume (bucketed) + store track record for that signal type (win rate shrunk to a 35% prior, ±1.5) − 0.5 per "Not relevant".
- Ease by output: social 5, note 5, email 4, bundle 4, page 3, blog 3, PR 3, ops 2.
- Signals agreeing on the same `mergeKey` merge into one opportunity; each extra signal adds +1 data volume.
- Ops flags and customer thank-yous are **private notes**, outside the top 5, never marketing copy.

## Card format (digest)
Why now · Do this · Draft ready · We'll measure · [Approve] [Edit] [Not now] [Not relevant].
"Not now" = snooze 30 days, no penalty. "Not relevant" = lowers Confidence for that signal type at that store.

## Measurement (feedback loop)
| Output | Metric | Source | Window | Win if |
|---|---|---|---|---|
| Blog / FAQ | Clicks + impressions for target queries | GSC | 28/56/90 | Top 10 for a target query, or clicks beat store median |
| Page optimisation | Avg position + CTR | GSC | 28/56 | Position +3 or CTR +20% |
| Bundle / promo | Bundle orders, AOV | Shopify | 28 vs prior 28 | AOV or pair revenue up |
| Email | Revenue per recipient | Klaviyo | 7 | Beats trailing 90-day average |
| Social / PR | Referral sessions, branded impressions | GA4, GSC | 14 | Above trailing average |

The window starts when the owner marks it live (or the URL/SKU is detected). Outcome: win / neutral / miss.

## Metric rules (non-negotiable)
- Re-fetch a trailing window nightly (GSC finalises 2–3 days late).
- Missing data = "not available", **never zero**.
- Compare like-for-like periods.
- CTR = total clicks ÷ total impressions. Never average ratios.

## Data & privacy rules
- Strip customer names and emails before **any** AI prompt (`pseudonymise()` in drafts.js). Company names of B2B clients may stay, but naming them in public copy needs a permission check.
- EU hosting. Raw inbox text deleted after 90 days; keep only question clusters.
- Tokens encrypted, never in the repo. A failed token affects one store and triggers a reconnect email.
- Email: forwarding address (Postmark inbound) in the pilot; Klaviyo Phase 2; Gmail API only after product-market fit.

## Pilot build (next)
Python · Postgres (Supabase/Neon, EU) · Render cron or GitHub Actions · Claude API · Postmark.
One module per connector, one per signal, **each signal with tests on a small fixture dataset**. Review every diff before it touches real store data. First proof: signal 3 on a sample Shopify order export.

## Writing rules for drafts
Irish English. Brand voice from the onboarding questionnaire + site copy. Never invent facts, prices or quotes; anything the owner must decide goes in `[brackets]`. Check against the store's never-say list.
