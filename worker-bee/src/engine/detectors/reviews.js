import { matchesAny, sentences, sentiment, daysAgo, hasKeyword, recency } from '../text.js';

/**
 * Reviews → repeated praise (amplify), repeated complaints (fix + respond),
 * staff called out by name (thank them), and reviews still waiting for a reply.
 */
export function detectReviews(reviews, business) {
  const opps = [];

  // Aspect sentiment per review (a review counts once per aspect)
  const byAspect = {};
  for (const r of reviews) {
    for (const [aspect, kws] of Object.entries(business.aspects)) {
      const hits = sentences(r.text).filter((s) => matchesAny(s, kws));
      if (!hits.length) continue;
      const sents = hits.map((s) => sentiment(s, r.rating));
      const polarity = sents.includes(-1) ? -1 : sents.includes(1) ? 1 : 0;
      (byAspect[aspect] = byAspect[aspect] || []).push({ review: r, quote: hits.join(' '), polarity });
    }
  }

  for (const [aspect, mentions] of Object.entries(byAspect)) {
    const label = business.aspectLabels[aspect] || aspect;
    const neg = mentions.filter((m) => m.polarity < 0);
    const pos = mentions.filter((m) => m.polarity > 0);

    if (neg.length >= 3) {
      const last60 = neg.filter((m) => daysAgo(m.review.date) <= 60).length;
      opps.push({
        id: `fix-${aspect}`,
        kind: 'review-fix',
        category: 'Reputation',
        topic: aspect,
        sources: ['reviews'],
        title: `Recurring complaint: ${label.toLowerCase()}`,
        insight: `${neg.length} reviews mention it, ${last60} of them in the last 60 days`,
        why: `One complaint is a bad day. ${neg.length} is a pattern. Fix the cause first, then tell people you fixed it. That turns a weakness into a story about how much you listen.`,
        evidence: neg.map((m) => ({ source: 'reviews', date: m.review.date, who: `${m.review.author} · ${'★'.repeat(m.review.rating)}`, text: m.quote })),
        metrics: [
          { label: 'Negative mentions', value: neg.length },
          { label: 'Avg rating (these)', value: (neg.reduce((s, m) => s + m.review.rating, 0) / neg.length).toFixed(1) },
        ],
        impact: 4,
        confidence: Math.min(1, 0.4 + neg.length * 0.12),
        urgency: Math.min(1, 0.4 + last60 * 0.15),
        effort: 'Medium',
        data: { aspect, label, mentions: neg },
      });
    }

    if (pos.length >= 5) {
      opps.push({
        id: `amplify-${aspect}`,
        kind: 'review-amplify',
        category: 'Reputation',
        topic: aspect,
        sources: ['reviews'],
        title: `Customers love your ${label.toLowerCase()}. Say it louder`,
        insight: `${pos.length} unprompted 5-star mentions. Use their words, not yours`,
        why: 'Customers trust other customers far more than ads. These people already wrote your best marketing copy. Put it where new customers will see it.',
        evidence: pos.map((m) => ({ source: 'reviews', date: m.review.date, who: `${m.review.author} · ${'★'.repeat(m.review.rating)}`, text: m.quote })),
        metrics: [{ label: 'Positive mentions', value: pos.length }],
        impact: 3,
        confidence: Math.min(1, 0.4 + pos.length * 0.08),
        urgency: 0.4,
        effort: 'Low',
        data: { aspect, label, mentions: pos },
      });
    }
  }

  // Staff praised by name
  for (const name of business.staff) {
    const praise = reviews.filter((r) => hasKeyword(r.text, name) && r.rating >= 4);
    if (praise.length < 3) continue;
    opps.push({
      id: `moment-staff-${name.toLowerCase()}`,
      kind: 'moment-staff',
      category: 'Moments',
      topic: `staff:${name}`,
      sources: ['reviews'],
      title: `${name} has been named in ${praise.length} five-star reviews`,
      insight: 'Your team is your marketing. Make sure they know it',
      why: `Customers remember people, not logos. Thank ${name} properly first. Then, with their OK, a team spotlight is some of the most engaging content a local business can post.`,
      evidence: praise.map((r) => ({ source: 'reviews', date: r.date, who: `${r.author} · ${'★'.repeat(r.rating)}`, text: r.text })),
      metrics: [{ label: 'Mentions', value: praise.length }],
      impact: 3,
      confidence: Math.min(1, 0.5 + praise.length * 0.1),
      urgency: Math.max(...praise.map((r) => recency(r.date, 30)), 0.3),
      effort: 'Low',
      data: { name, reviews: praise },
    });
  }

  // Unreplied reviews
  const waiting = reviews.filter((r) => !r.replied).sort((a, b) => a.rating - b.rating);
  if (waiting.length) {
    const negatives = waiting.filter((r) => r.rating <= 3).length;
    opps.push({
      id: 'reply-reviews',
      kind: 'reply-reviews',
      category: 'Reputation',
      topic: 'replies',
      sources: ['reviews'],
      title: `${waiting.length} reviews are waiting for a reply`,
      insight: `${negatives} of them are 3 stars or below. Replies are drafted and ready to post`,
      why: 'Future customers read your replies more closely than the reviews. A warm reply to a 2-star review often wins more trust than a 5-star one.',
      evidence: waiting.map((r) => ({ source: 'reviews', date: r.date, who: `${r.author} · ${'★'.repeat(r.rating)}`, text: r.text })),
      metrics: [{ label: 'Unreplied', value: waiting.length }, { label: '≤ 3 stars', value: negatives }],
      impact: 3,
      confidence: 1,
      urgency: Math.min(1, 0.5 + negatives * 0.15),
      effort: 'Low',
      data: { reviews: waiting },
    });
  }

  return opps;
}
