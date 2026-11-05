// What the feedback loop has learned so far for this store: results of
// opportunities approved in earlier digests (pilot weeks 1–4).
// Outcome is logged at the end of each measurement window and moves
// the Confidence score for that signal type at this store.
export const history = [
  { id: 'h1', signal: 'question', title: 'FAQ: what oven temperature for a pizza kit', output: 'blog', live: '2026-09-14', outcome: 'win', result: 'Reached position 7 for “pizza kit oven temperature” in 28 days' },
  { id: 'h2', signal: 'question', title: 'Product page copy: what’s in the box', output: 'page', live: '2026-09-21', outcome: 'win', result: 'Sales enquiries about box contents fell from 9 to 2 per month' },
  { id: 'h3', signal: 'question', title: 'Blog: kids party pizza ideas', output: 'blog', live: '2026-09-28', outcome: 'neutral', result: 'Clicks in line with the store median for new posts' },
  { id: 'h4', signal: 'pair', title: 'Bundle: Margherita kit + Garlic & Herb Dip', output: 'bundle', live: '2026-09-15', outcome: 'win', result: 'Pair revenue +31% vs the previous 28 days' },
  { id: 'h5', signal: 'pair', title: 'Bundle: Pepperoni kit + Cookie Dough Tub', output: 'bundle', live: '2026-10-01', outcome: 'neutral', result: 'AOV flat (+1%)' },
  { id: 'h6', signal: 'striking', title: 'Optimise /collections/kits for “pizza kits cork”', output: 'page', live: '2026-09-20', outcome: 'win', result: 'Position 8.1 → 3.4' },
  { id: 'h7', signal: 'fast-mover', title: 'Feature: Kids Party Kit in Friday email', output: 'email', live: '2026-09-25', outcome: 'miss', result: 'Revenue per recipient 18% below the 90-day average' },
  { id: 'h8', signal: 'milestone', title: 'Social post: 5,000th pizza kit shipped', output: 'social', live: '2026-10-05', outcome: 'win', result: 'Referral sessions 2.3× the trailing average' },
  { id: 'h9', signal: 'overstock', title: 'Promo: 15% off Pizza Stone', output: 'email', live: '2026-10-08', outcome: 'miss', result: 'Moved 4 units; margin lost on the discount' },
];

// Digest-level stats from the first 4 pilot weeks (for the success metrics panel)
export const pilotStats = {
  digestsSent: 4,
  shown: 20,
  approved: 9,
  medianDaysToLive: 2,
  ownerMinutesPerWeek: 24,
  notRelevant: { 'fast-mover': 1 },
};
