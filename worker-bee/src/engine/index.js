import { detectEmails } from './detectors/emails.js';
import { detectOrders } from './detectors/orders.js';
import { detectReviews } from './detectors/reviews.js';
import { detectNews } from './detectors/news.js';
import { detectSearch } from './detectors/search.js';

export const SOURCE_LABELS = {
  email: 'Inbox',
  orders: 'Orders',
  reviews: 'Reviews',
  news: 'News',
  search: 'Search',
};

const EFFORT = { Low: 1, Medium: 0.8, High: 0.6 };

/**
 * Same kind + same topic from different sources = one opportunity with
 * stronger evidence ("customers ask it AND Google confirms it").
 */
function merge(opps) {
  const out = new Map();
  for (const o of opps) {
    const key = `${o.kind}::${o.topic}`;
    const prev = out.get(key);
    if (!prev) { out.set(key, { ...o, data: { ...o.data } }); continue; }
    const primary = prev.sources.includes('email') || prev.sources.length > o.sources.length ? prev : o;
    const other = primary === prev ? o : prev;
    out.set(key, {
      ...primary,
      sources: [...new Set([...primary.sources, ...other.sources])],
      title: primary.kind === 'faq-content' && other.sources.includes('search')
        ? `${primary.data.topic.label}: customers are asking, and so is Google`
        : primary.title,
      insight: `${primary.insight} · ${other.insightShort || other.insight}`,
      why: `${primary.why} ${other.why}`,
      evidence: [...primary.evidence, ...other.evidence],
      metrics: [...primary.metrics, ...other.metrics.filter((m) => !primary.metrics.some((p) => p.label === m.label))],
      impact: Math.max(primary.impact, other.impact),
      confidence: Math.min(1, Math.max(primary.confidence, other.confidence) + 0.15),
      urgency: Math.max(primary.urgency, other.urgency),
      data: { ...other.data, ...primary.data, ...mergeData(primary.data, other.data) },
    });
  }
  return [...out.values()];
}

function mergeData(a, b) {
  const d = {};
  if (a.queries || b.queries) d.queries = a.queries || b.queries;
  if (a.primaryKeyword || b.primaryKeyword) d.primaryKeyword = a.primaryKeyword || b.primaryKeyword;
  if (a.potential || b.potential) d.potential = a.potential || b.potential;
  if (a.questions || b.questions) d.questions = a.questions || b.questions;
  if ('consent' in a || 'consent' in b) d.consent = !!(a.consent || b.consent);
  if (a.value || b.value) d.value = Math.max(a.value || 0, b.value || 0);
  return d;
}

/** Different kinds on the same topic: link them and reward the corroboration. */
function link(opps) {
  const byTopic = {};
  opps.forEach((o) => { (byTopic[o.topic] = byTopic[o.topic] || []).push(o); });
  return opps.map((o) => {
    const related = byTopic[o.topic].filter((x) => x.id !== o.id);
    const allSources = new Set([o.sources, ...related.map((r) => r.sources)].flat());
    const boost = Math.min(0.2, (allSources.size - o.sources.length) * 0.07);
    return { ...o, related: related.map((r) => r.id), signalCount: allSources.size, confidence: Math.min(1, o.confidence + boost) };
  });
}

function score(o) {
  const s = 100 * (0.4 * (o.impact / 5) + 0.35 * o.confidence + 0.25 * o.urgency) * EFFORT[o.effort];
  return Math.round(Math.min(99, s));
}

export function runEngine(data, business) {
  const raw = [
    ...detectEmails(data.emails, business),
    ...detectOrders(data.orders, business),
    ...detectReviews(data.reviews, business),
    ...detectNews(data.news, business),
    ...detectSearch(data.searchQueries, business),
  ];
  const opps = link(merge(raw)).map((o) => ({ ...o, score: score(o) }));
  return opps.sort((a, b) => b.score - a.score);
}
