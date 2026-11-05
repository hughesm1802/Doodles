import { matchesAny } from '../text.js';

const ctrAt = (pos) => (pos <= 1 ? 0.3 : pos <= 3 ? 0.15 : pos <= 5 ? 0.08 : pos <= 10 ? 0.03 : 0.01);

/**
 * Search Console → (1) topics people search for that you have no page for (content gaps),
 *                  (2) queries ranking 4–15 on an existing page (striking-distance quick wins).
 */
export function detectSearch(queries, business) {
  const opps = [];
  const assigned = new Set();

  // 1. Topic-level content gaps
  for (const topic of business.topics) {
    const rows = queries.filter((q) => !assigned.has(q.query) && matchesAny(q.query, topic.keywords));
    rows.forEach((r) => assigned.add(r.query));
    if (!rows.length) continue;
    const impressions = rows.reduce((s, r) => s + r.impressions, 0);
    const clicks = rows.reduce((s, r) => s + r.clicks, 0);
    const avgPos = rows.reduce((s, r) => s + r.position * r.impressions, 0) / impressions;
    const noPage = rows.filter((r) => !r.page).length;
    if (impressions < 800 || avgPos <= 5) continue;
    const potential = Math.round(rows.reduce((s, r) => s + r.impressions * ctrAt(3), 0) - clicks);
    const lead = [...rows].sort((a, b) => b.impressions - a.impressions)[0];
    opps.push({
      id: `faq-${topic.id}`,
      kind: 'faq-content',
      category: 'Content',
      topic: topic.id,
      sources: ['search'],
      title: `People are Googling ${topic.label.toLowerCase()} and finding someone else`,
      insight: `${impressions.toLocaleString('en-IE')} searches in 3 months · average position ${avgPos.toFixed(1)} · ${noPage} with no matching page`,
      insightShort: `${impressions.toLocaleString('en-IE')} Google searches, avg position ${avgPos.toFixed(1)}`,
      why: `Google already shows you for these searches but ranks you too low to get the click. A dedicated page could win about ${Math.max(potential, 0).toLocaleString('en-IE')} extra visits a quarter.`,
      evidence: rows.map((r) => ({
        source: 'search', date: '2026-11-04', who: `“${r.query}”`,
        text: `${r.impressions.toLocaleString('en-IE')} impressions · ${r.clicks} clicks · position ${r.position} · ${r.page ? `ranking page ${r.page}` : 'no dedicated page'}`,
      })),
      metrics: [
        { label: 'Searches (3 mo)', value: impressions.toLocaleString('en-IE') },
        { label: 'Avg position', value: avgPos.toFixed(1) },
        { label: 'Extra visits / qtr', value: `~${Math.max(potential, 0).toLocaleString('en-IE')}` },
      ],
      impact: topic.impact,
      confidence: Math.min(1, 0.3 + impressions / 10000),
      urgency: 0.5,
      effort: 'Medium',
      data: { topic, queries: rows, primaryKeyword: lead.query, impressions, potential },
    });
  }

  // 2. Striking distance on existing pages
  const quick = queries.filter((q) => q.page && q.page !== '/' && !assigned.has(q.query) && q.position >= 4 && q.position <= 15 && q.impressions >= 1200);
  if (quick.length) {
    const gain = Math.round(quick.reduce((s, q) => s + q.impressions * (ctrAt(3) - ctrAt(q.position)), 0));
    opps.push({
      id: 'seo-quickwins',
      kind: 'seo-quickwin',
      category: 'SEO',
      topic: 'seo-quickwins',
      sources: ['search'],
      title: `${quick.length} pages are one push away from page-one top 3`,
      insight: `Ranking positions ${Math.min(...quick.map((q) => q.position)).toFixed(0)}–${Math.max(...quick.map((q) => q.position)).toFixed(0)} · ~${gain.toLocaleString('en-IE')} extra visits a quarter if they reach the top 3`,
      why: 'These are the cheapest wins in SEO. The pages exist and Google already trusts them. Better titles, a short FAQ block and a few internal links usually get them over the line.',
      evidence: quick.map((q) => ({
        source: 'search', date: '2026-11-04', who: `“${q.query}”`,
        text: `${q.page} · position ${q.position} · ${q.impressions.toLocaleString('en-IE')} impressions · ${q.clicks} clicks`,
      })),
      metrics: [{ label: 'Queries', value: quick.length }, { label: 'Visit upside / qtr', value: `~${gain.toLocaleString('en-IE')}` }],
      impact: 3,
      confidence: 0.7,
      urgency: 0.4,
      effort: 'Low',
      data: { queries: quick, gain },
    });
  }
  return opps;
}
