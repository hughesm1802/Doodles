// ─────────────────────────────────────────────────────────────
// Signal library v1 (MVP spec, 5 Nov 2026). Ten rules; eight run in the
// MVP. Thresholds are starting assumptions to test in the pilot and are
// tuned per store (see Signal library screen).
// ─────────────────────────────────────────────────────────────

export const SIGNALS = [
  { n: 1, key: 'question', name: 'Repeated customer question', source: 'inbox', phase: 'MVP',
    params: { minCount: 3, windowDays: 30 },
    trigger: (p) => `Same question cluster ≥ ${p.minCount} times in ${p.windowDays} days`,
    action: 'Blog post or FAQ; product page copy update' },
  { n: 2, key: 'review-theme', name: 'Review theme', source: 'reviews', phase: 'MVP',
    params: { minCount: 5, windowDays: 60 },
    trigger: (p) => `Same theme in ≥ ${p.minCount} reviews in ${p.windowDays} days (positive or negative)`,
    action: 'Positive: social proof post, ad angle. Negative: ops flag to owner' },
  { n: 3, key: 'pair', name: 'Product pair', source: 'orders', phase: 'MVP',
    params: { minCoOrders: 20, windowDays: 90, minLift: 1.5 },
    trigger: (p) => `≥ ${p.minCoOrders} co-orders in ${p.windowDays} days and lift ≥ ${p.minLift}`,
    action: 'Bundle, joint promo, cross-sell block' },
  { n: 4, key: 'striking', name: 'Striking-distance query', source: 'search', phase: 'MVP',
    params: { minPos: 8, maxPos: 20, minImpressions: 100 },
    trigger: (p) => `Avg position ${p.minPos}–${p.maxPos}, ≥ ${p.minImpressions} impressions in 28 days`,
    action: 'Optimise page or write supporting post' },
  { n: 5, key: 'rising-query', name: 'Rising query', source: 'search', phase: 'MVP',
    params: { minGrowth: 50, minImpressions: 100 },
    trigger: (p) => `Impressions up ≥ ${p.minGrowth}% vs previous 28 days (min ${p.minImpressions})`,
    action: 'Content or product page update' },
  { n: 6, key: 'fast-mover', name: 'Fast mover', source: 'orders', phase: 'MVP',
    params: { minGrowth: 40, minUnits: 15 },
    trigger: (p) => `Units sold up ≥ ${p.minGrowth}% vs prior 4 weeks (min ${p.minUnits} units)`,
    action: 'Feature in email and social while momentum lasts' },
  { n: 7, key: 'overstock', name: 'Overstock', source: 'orders', phase: 'MVP',
    params: { maxDaysCover: 90 },
    trigger: (p) => `> ${p.maxDaysCover} days of stock at current sell rate`,
    action: 'Bundle with a fast mover, promo' },
  { n: 8, key: 'milestone', name: 'Milestone', source: 'orders', phase: 'MVP',
    params: { largeOrderMultiple: 10, windowDays: 14 },
    trigger: (p) => `Customer order-count milestone, record day, or order ≥ ${p.largeOrderMultiple}× AOV (last ${p.windowDays} days)`,
    action: 'PR, social post, customer thank-you' },
  { n: 9, key: 'news', name: 'Industry news', source: 'news', phase: 'Phase 2',
    params: { minRelevance: 4, maxAgeDays: 14 },
    trigger: (p) => `Keyword match on the store's topic list, relevance ≥ ${p.minRelevance}, ≤ ${p.maxAgeDays} days old`,
    action: 'Owner opinion post, newsletter angle' },
  { n: 10, key: 'lapsed', name: 'Lapsed customers', source: 'orders', phase: 'Phase 2',
    params: { gapMultiple: 2, minOrders: 3 },
    trigger: (p) => `Previous buyers (≥ ${p.minOrders} orders) with no order in ${p.gapMultiple}× their usual gap`,
    action: 'Win-back email draft (Klaviyo)' },
  { n: 0, key: 'calendar', name: 'Irish retail calendar', source: 'calendar', phase: 'MVP',
    params: {},
    trigger: () => 'Seasonal moment inside its lead time (Black Friday, Christmas cut-offs, Mother’s Day in March…)',
    action: 'Seasonal prompt on top of the signals' },
];

export const SIGNAL_BY_KEY = Object.fromEntries(SIGNALS.map((s) => [s.key, s]));

/** Per-store config: on/off + thresholds. Phase 2 signals start off. */
export function defaultSignalConfig() {
  return Object.fromEntries(SIGNALS.map((s) => [s.key, { enabled: s.phase === 'MVP', params: { ...s.params } }]));
}
