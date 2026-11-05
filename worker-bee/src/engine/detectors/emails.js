import { matchesAny, sentences, recency, norm } from '../text.js';

const QTY = /(\d{2,4})\s+(?:[a-z']+\s+){0,4}(boxes|kits|people|colleagues|staff|guests)/i;
const MONEY = /€\s?([\d,]+(?:\.\d+)?)/;
const CONSENT = /(happy for you to share|feel free to share|mention us|tag us|share the photo)/i;

/**
 * Customer emails → (1) recurring questions = content topics,
 *                    (2) big confirmed deals / praise = PR angles.
 */
export function detectEmails(emails, business) {
  const opps = [];

  // 1. Recurring questions per topic
  for (const topic of business.topics) {
    const hits = [];
    for (const e of emails) {
      const q = sentences(e.body).find((s) => s.includes('?') && matchesAny(s, topic.keywords));
      if (q) hits.push({ email: e, question: q });
    }
    if (hits.length < 3) continue;
    const fresh = hits.filter((h) => recency(h.email.date, 45) > 0).length;
    opps.push({
      id: `faq-${topic.id}`,
      kind: 'faq-content',
      category: 'Content',
      topic: topic.id,
      sources: ['email'],
      title: `Customers keep asking about ${topic.label.toLowerCase()}`,
      insight: `${hits.length} customer emails in 10 weeks`,
      why: `Each of these emails took someone on your team time to answer, one at a time. A single helpful page answers all of them, before they're asked, and it's the kind of page Google and AI assistants quote.`,
      evidence: hits.map((h) => ({ source: 'email', date: h.email.date, who: h.email.from, text: h.question })),
      metrics: [{ label: 'Customer emails', value: hits.length }],
      impact: topic.impact,
      confidence: Math.min(1, 0.35 + hits.length * 0.1),
      urgency: Math.min(1, 0.3 + fresh / hits.length),
      effort: 'Medium',
      data: { topic, questions: hits.map((h) => h.question) },
    });
  }

  // 2. Big deals worth talking about
  const byOrg = {};
  for (const e of emails) {
    if (!e.org) continue;
    const qty = Number((e.body.match(QTY) || [])[1] || 0);
    const value = Number(((e.body.match(MONEY) || [])[1] || '0').replace(/,/g, ''));
    if (qty < 50 && value < 1000) continue;
    const key = norm(e.org);
    byOrg[key] = byOrg[key] || { org: e.org, emails: [], qty: 0, value: 0, consent: false };
    const d = byOrg[key];
    d.emails.push(e);
    d.qty = Math.max(d.qty, qty);
    d.value = Math.max(d.value, value);
    d.consent = d.consent || CONSENT.test(e.body);
  }
  for (const d of Object.values(byOrg)) {
    const latest = d.emails[d.emails.length - 1];
    opps.push({
      id: `deal-${norm(d.org).replace(/\W+/g, '-')}`,
      kind: 'pr-deal',
      category: 'PR',
      topic: `deal:${norm(d.org)}`,
      sources: ['email'],
      title: `${d.org}'s ${d.qty}-person pizza night is a story worth telling`,
      insight: `${d.qty} people · ${d.value ? `€${d.value.toLocaleString('en-IE')}` : 'large order'} · ${d.consent ? 'client said you can share it' : 'ask for permission first'}`,
      why: `Your biggest single order of the year, and the client loved it. Stories like this win the next corporate booking, just in time for Christmas party season.`,
      evidence: d.emails.map((e) => ({ source: 'email', date: e.date, who: `${e.from}, ${e.org}`, text: e.body })),
      metrics: [{ label: 'Headcount', value: d.qty }, { label: 'Permission', value: d.consent ? 'Given' : 'Not yet' }],
      impact: 5,
      confidence: d.consent ? 0.95 : 0.6,
      urgency: recency(latest.date, 21),
      effort: 'Medium',
      data: { org: d.org, qty: d.qty, value: d.value, consent: d.consent, quote: d.emails.map((e) => e.body).find((b) => CONSENT.test(b)) },
    });
  }
  return opps;
}
