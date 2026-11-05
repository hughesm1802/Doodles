import { matchesAny, bucket } from '../text.js';

/**
 * Google Search Console, last 28 days vs the 28 before (like-for-like).
 * Signal 4: striking distance (avg position minPos–maxPos, ≥ minImpressions).
 * Signal 5: rising query (impressions up ≥ minGrowth%).
 * Queries are grouped by watched topic (→ content) or by ranking page (→ page optimisation).
 * CTR is always total clicks ÷ total impressions, never an average of ratios.
 */
export function detectSearch(queries, store, cfg) {
  const sc = cfg.striking;
  const rc = cfg['rising-query'];
  const tagged = [];
  for (const q of queries) {
    const striking = sc.enabled && q.position >= sc.params.minPos && q.position <= sc.params.maxPos && q.impressions >= sc.params.minImpressions;
    const growth = q.prevImpressions ? (q.impressions / q.prevImpressions - 1) * 100 : null;
    const rising = rc.enabled && growth != null && q.impressions >= rc.params.minImpressions && growth >= rc.params.minGrowth;
    if (!striking && !rising) continue;
    const topic = store.topics.find((t) => matchesAny(q.query, t.keywords));
    tagged.push({ ...q, striking, rising, growth, topic });
  }

  const groups = {};
  for (const q of tagged) {
    const key = q.topic ? `content:${q.topic.id}` : q.page ? `page:${q.page}` : `query:${q.query}`;
    (groups[key] = groups[key] || []).push(q);
  }

  return Object.entries(groups).map(([key, rows]) => {
    const impressions = rows.reduce((s, r) => s + r.impressions, 0);
    const clicks = rows.reduce((s, r) => s + r.clicks, 0);
    const avgPos = rows.reduce((s, r) => s + r.position * r.impressions, 0) / impressions;
    const signals = [...new Set(rows.flatMap((r) => [r.striking && 'striking', r.rising && 'rising-query']).filter(Boolean))];
    const rise = rows.filter((r) => r.rising);
    const topic = rows[0].topic;
    const isContent = key.startsWith('content:');
    const label = topic ? topic.label.toLowerCase() : rows[0].page || rows[0].query;
    const lead = [...rows].sort((a, b) => b.impressions - a.impressions)[0];
    const parts = [];
    if (rows.some((r) => r.striking)) parts.push(`${rows.filter((r) => r.striking).length} quer${rows.filter((r) => r.striking).length === 1 ? 'y' : 'ies'} sit at positions ${Math.round(Math.min(...rows.filter((r) => r.striking).map((r) => r.position)))}–${Math.round(Math.max(...rows.filter((r) => r.striking).map((r) => r.position)))}, just off page one`);
    if (rise.length) parts.push(`${rise.length} quer${rise.length === 1 ? 'y is' : 'ies are'} up ${Math.round(Math.min(...rise.map((r) => r.growth)))}–${Math.round(Math.max(...rise.map((r) => r.growth)))}% on the previous 28 days`);
    return {
      id: isContent ? `content-${topic.id}` : `page-${key.slice(5).replace(/\W+/g, '-')}`,
      signal: signals.includes('striking') ? 'striking' : 'rising-query',
      signals,
      kind: isContent ? 'content' : 'seo-page',
      category: isContent ? 'Content' : 'SEO',
      mergeKey: key,
      topic: topic?.id || key,
      sources: ['search'],
      output: isContent && rows.some((r) => !r.page) ? 'blog' : 'page',
      title: isContent ? `People are searching for ${label} and finding someone else` : `Optimise ${label}: ${rows.length} quer${rows.length === 1 ? 'y' : 'ies'} close to page one`,
      whyNow: `${parts.join('; ')}. ${impressions.toLocaleString('en-IE')} impressions in 28 days, CTR ${((clicks / impressions) * 100).toFixed(1)}%.`,
      doThis: isContent
        ? (rows.some((r) => !r.page) ? 'Write a supporting post that targets these searches and links to the product.' : 'Update the ranking page with a section that answers these searches.')
        : 'Rewrite the title and meta, add an FAQ block using the exact phrases, and link to it from two blog posts.',
      evidence: rows.map((r) => ({
        source: 'search', date: '2026-11-02', who: `“${r.query}”`,
        text: `${r.impressions.toLocaleString('en-IE')} impr. (prev ${r.prevImpressions.toLocaleString('en-IE')}) · ${r.clicks} clicks · pos ${r.position} · ${r.page || 'no matching page'}${r.rising ? ` · ↑${Math.round(r.growth)}%` : ''}`,
      })),
      metrics: [
        { label: 'Impressions (28d)', value: impressions.toLocaleString('en-IE') },
        { label: 'Avg position', value: avgPos.toFixed(1) },
        { label: 'CTR', value: `${((clicks / impressions) * 100).toFixed(1)}%` },
      ],
      impact: bucket(impressions, [150, 400, 1000, 2000]),
      volume: bucket(impressions, [0, 300, 800, 1500]),
      data: { topic, queries: rows, primaryKeyword: lead.query, impressions, page: rows[0].page },
    };
  });
}
