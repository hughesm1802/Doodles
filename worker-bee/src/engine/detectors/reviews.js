import { matchesAny, sentences, sentiment, daysAgo, bucket } from '../text.js';

/**
 * Product reviews (review app API).
 * Signal 2: same theme in ≥ minCount reviews in windowDays.
 *   Positive → social proof post + ad angle.
 *   Negative → private ops note to the owner. Never marketing copy.
 */
export function detectReviews(reviews, store, cfg) {
  const { enabled, params: p } = cfg['review-theme'];
  if (!enabled) return [];
  const products = Object.fromEntries(store.products.map((x) => [x.id, x.name]));
  const recent = reviews.filter((r) => daysAgo(r.date) <= p.windowDays);
  const opps = [];

  for (const [aspect, kws] of Object.entries(store.aspects)) {
    const mentions = [];
    for (const r of recent) {
      const hits = sentences(r.text).filter((s) => matchesAny(s, kws));
      if (!hits.length) continue;
      const pol = hits.map((s) => sentiment(s, r.rating));
      mentions.push({ review: r, quote: hits.join(' '), polarity: pol.includes(-1) ? -1 : pol.includes(1) ? 1 : 0 });
    }
    const label = store.aspectLabels[aspect] || aspect;
    const ev = (list) => list.map((m) => ({
      source: 'reviews', date: m.review.date, who: `${m.review.author} · ${'★'.repeat(m.review.rating)} · ${products[m.review.product] || ''}`, text: m.quote,
    }));

    const neg = mentions.filter((m) => m.polarity < 0);
    if (neg.length >= p.minCount) {
      const avg = neg.reduce((s, m) => s + m.review.rating, 0) / neg.length;
      opps.push({
        id: `ops-${aspect}`,
        signal: 'review-theme',
        kind: 'review-ops',
        category: 'Ops flag',
        mergeKey: `ops:${aspect}`,
        topic: aspect,
        sources: ['reviews'],
        output: 'ops',
        title: `Recurring complaint: ${label.toLowerCase()}`,
        whyNow: `${neg.length} reviews in ${p.windowDays} days raise the same problem (average ${avg.toFixed(1)}★). That's a pattern, not a bad day.`,
        doThis: 'Fix the cause first. This stays a private note: no marketing copy until it’s solved.',
        evidence: ev(neg),
        metrics: [{ label: `Negative mentions (${p.windowDays}d)`, value: neg.length }, { label: 'Avg rating', value: `${avg.toFixed(1)}★` }],
        impact: 4,
        volume: bucket(neg.length, [0, 4, 6, 8]),
        data: { aspect, label, mentions: neg },
      });
    }

    const pos = mentions.filter((m) => m.polarity > 0);
    if (pos.length >= p.minCount) {
      opps.push({
        id: `proof-${aspect}`,
        signal: 'review-theme',
        kind: 'review-proof',
        category: 'Social proof',
        mergeKey: `proof:${aspect}`,
        topic: aspect,
        sources: ['reviews'],
        output: 'social',
        title: `${pos.length} customers praised your ${label.toLowerCase()} unprompted`,
        whyNow: `${pos.length} reviews in ${p.windowDays} days say the same good thing, in words you couldn't write yourself.`,
        doThis: 'Turn their words into a social proof post, and test the theme as an ad angle.',
        evidence: ev(pos),
        metrics: [{ label: `Positive mentions (${p.windowDays}d)`, value: pos.length }],
        impact: 3,
        volume: bucket(pos.length, [0, 4, 6, 8]),
        data: { aspect, label, mentions: pos },
      });
    }
  }
  return opps;
}
