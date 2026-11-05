import { matchesAny, sentences, daysAgo, norm, bucket } from '../text.js';

const QTY = /(\d{2,4})\s+(?:[a-z']+\s+){0,4}(boxes|kits|people|colleagues|staff|guests)/i;
const MONEY = /€\s?([\d,]+(?:\.\d+)?)/;
const CONSENT = /(happy for you to share|feel free to share|mention us|tag us|share the photo)/i;

/**
 * Forwarding inbox.
 * Signal 1: repeated customer question (same cluster ≥ minCount in windowDays).
 * Also emits context for signal 8: big-deal emails and client consent to be named,
 * which merge into the matching Shopify milestone (never shown on their own).
 */
export function detectInbox(emails, store, cfg) {
  const opps = [];
  const { enabled, params: p } = cfg.question;

  if (enabled) {
    for (const topic of store.topics) {
      const hits = [];
      for (const e of emails) {
        if (daysAgo(e.date) > p.windowDays) continue;
        const q = sentences(e.body).find((s) => s.includes('?') && matchesAny(s, topic.keywords));
        if (q) hits.push({ email: e, question: q });
      }
      if (hits.length < p.minCount) continue;
      opps.push({
        id: `content-${topic.id}`,
        signal: 'question',
        kind: 'content',
        category: 'Content',
        mergeKey: `content:${topic.id}`,
        topic: topic.id,
        sources: ['inbox'],
        output: 'blog',
        title: `${hits.length} customers asked about ${topic.label.toLowerCase()} this month`,
        whyNow: `${hits.length} forwarded customer emails asked the same question in the last ${p.windowDays} days.`,
        doThis: 'Publish one FAQ-style article that answers it, and add a two-line answer to the product page.',
        evidence: hits.map((h) => ({ source: 'inbox', date: h.email.date, who: h.email.from, text: h.question })),
        metrics: [{ label: `Questions (${p.windowDays}d)`, value: hits.length }],
        impact: topic.impact,
        volume: bucket(hits.length, [1, 2, 3, 4]),
        data: { topic, questions: hits.map((h) => h.question) },
      });
    }
  }

  // Context for milestone PR: big deals + permission to name the client
  const byOrg = {};
  for (const e of emails) {
    if (!e.org) continue;
    const qty = Number((e.body.match(QTY) || [])[1] || 0);
    const value = Number(((e.body.match(MONEY) || [])[1] || '0').replace(/,/g, ''));
    if (qty < 50 && value < 1000) continue;
    const k = norm(e.org);
    byOrg[k] = byOrg[k] || { org: e.org, emails: [], consent: false };
    byOrg[k].emails.push(e);
    byOrg[k].consent = byOrg[k].consent || CONSENT.test(e.body);
  }
  for (const [k, d] of Object.entries(byOrg)) {
    opps.push({
      id: `deal-ctx-${k.replace(/\W+/g, '-')}`,
      contextOnly: true,
      signal: 'milestone',
      mergeKey: `deal:${k}`,
      sources: ['inbox'],
      evidence: d.emails.map((e) => ({ source: 'inbox', date: e.date, who: `${e.from}, ${e.org}`, text: e.body })),
      metrics: [{ label: 'Permission to name', value: d.consent ? 'Given by client' : 'Not yet' }],
      data: { consent: d.consent, quote: d.emails.map((e) => e.body).find((b) => CONSENT.test(b)) },
    });
  }
  return opps;
}
