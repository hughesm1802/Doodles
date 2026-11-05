import { detectInbox } from './detectors/inbox.js';
import { detectShopify } from './detectors/shopify.js';
import { detectReviews } from './detectors/reviews.js';
import { detectSearch } from './detectors/gsc.js';
import { detectNews } from './detectors/news.js';
import { detectCalendar } from './detectors/calendar.js';
import { OUTPUTS } from './outputs.js';
import { clamp } from './text.js';

export const SOURCE_LABELS = {
  inbox: 'Inbox',
  orders: 'Shopify',
  reviews: 'Reviews',
  search: 'Search',
  news: 'News',
  calendar: 'Calendar',
};

// Which signal leads when several merge into one opportunity
const LEAD = ['question', 'milestone', 'striking', 'rising-query', 'pair', 'fast-mover', 'overstock', 'review-theme', 'lapsed', 'news', 'calendar'];

/** Same mergeKey from different signals/sources = one opportunity, more evidence. */
function merge(raw) {
  const groups = {};
  raw.forEach((o) => { (groups[o.mergeKey] = groups[o.mergeKey] || []).push(o); });
  const out = [];
  for (const list of Object.values(groups)) {
    const real = list.filter((o) => !o.contextOnly);
    if (!real.length) continue;
    real.sort((a, b) => LEAD.indexOf(a.signal) - LEAD.indexOf(b.signal));
    const lead = real[0];
    const signals = [...new Set(list.flatMap((o) => o.signals || [o.signal]))];
    const sources = [...new Set(list.flatMap((o) => o.sources))];
    const data = Object.assign({}, ...list.map((o) => o.data).reverse());
    if (list.some((o) => o.data.consent)) data.consent = true;
    const questions = list.find((o) => o.data.questions)?.data.questions;
    const queries = list.find((o) => o.data.queries)?.data.queries;
    if (questions) data.questions = questions;
    if (queries) { data.queries = queries; data.primaryKeyword = list.find((o) => o.data.primaryKeyword).data.primaryKeyword; }
    out.push({
      ...lead,
      signals,
      sources,
      title: lead.kind === 'content' && signals.includes('question') && sources.includes('search')
        ? `${data.topic.label}: customers are asking, and Google shows the demand`
        : lead.title,
      whyNow: [lead.whyNow, ...list.filter((o) => o !== lead && o.whyNow).map((o) => o.whyNow)].join(' '),
      output: lead.kind === 'content' && real.some((o) => o.output === 'blog') ? 'blog' : lead.output,
      evidence: list.flatMap((o) => o.evidence),
      metrics: list.flatMap((o) => o.metrics).filter((m, i, arr) => arr.findIndex((x) => x.label === m.label) === i),
      impact: Math.max(...real.map((o) => o.impact)),
      // corroboration: each extra independent signal adds data volume
      volume: Math.min(5, Math.max(...real.map((o) => o.volume)) + (signals.length - 1)),
      data,
    });
  }
  return out;
}

/** Different opportunities on the same topic are linked, not merged. */
function link(opps) {
  return opps.map((o) => ({ ...o, related: opps.filter((x) => x.id !== o.id && x.topic === o.topic).map((x) => x.id) }));
}

/** Detection: depends on data + per-store signal config only. */
export function detect(data, store, cfg) {
  const raw = [
    ...detectInbox(data.emails, store, cfg),
    ...detectShopify(data.orders, store, cfg),
    ...detectReviews(data.reviews, store, cfg),
    ...detectSearch(data.searchQueries, store, cfg),
    ...detectNews(data.news, store, cfg),
    ...detectCalendar(data.calendar, store, cfg),
  ];
  return link(merge(raw));
}

/**
 * Learning: this store's track record per signal type.
 * Past outcomes + outcomes logged this session + "Not relevant" dismissals.
 */
export function learn(history, statuses, opps, pilotStats) {
  const L = {};
  const get = (k) => (L[k] = L[k] || { win: 0, neutral: 0, miss: 0, notRelevant: 0 });
  history.forEach((h) => { get(h.signal)[h.outcome] += 1; });
  Object.entries(pilotStats.notRelevant || {}).forEach(([k, n]) => { get(k).notRelevant += n; });
  for (const o of opps) {
    const s = statuses[o.id];
    if (!s) continue;
    if (s.status === 'notrelevant') get(o.signal).notRelevant += 1;
    if (s.outcome) get(o.signal)[s.outcome] += 1;
  }
  return L;
}

/**
 * Confidence (1–5) = data volume behind the signal, adjusted by this store's
 * win rate for the signal type (shrunk towards a 35% prior so one result
 * doesn't swing it) and by "Not relevant" dismissals.
 */
export function confidenceFor(o, L) {
  const t = L[o.signal] || { win: 0, neutral: 0, miss: 0, notRelevant: 0 };
  const n = t.win + t.neutral + t.miss;
  const rate = (t.win + 0.35 * 2) / (n + 2);
  const track = clamp((rate - 0.35) * 5, -1.5, 1.5);
  const dismiss = t.notRelevant * 0.5;
  const value = clamp(Math.round(o.volume + track - dismiss), 1, 5);
  return { value, volume: o.volume, track, dismiss, record: t, n };
}

/** ICE: Impact × Confidence × Ease, max 125. */
export function rank(opps, L) {
  return opps
    .map((o) => {
      const conf = confidenceFor(o, L);
      const ease = OUTPUTS[o.output].ease;
      return { ...o, confidence: conf.value, conf, ease, ice: o.impact * conf.value * ease };
    })
    .sort((a, b) => b.ice - a.ice || b.impact - a.impact || b.volume - a.volume);
}

/** Owner-facing digest: top N, marketing only. Ops flags and thank-yous are listed separately as private notes. */
export const PRIVATE_OUTPUTS = new Set(['ops', 'note']);
