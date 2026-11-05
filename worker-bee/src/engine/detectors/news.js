import { matchedKeywords, matchesAny, daysAgo, bucket } from '../text.js';

/**
 * Signal 9 (Phase 2): industry news. Keyword match on the store's topic list.
 * Relevance = industry keywords (title counts double) + a watched-topic match.
 */
export function detectNews(news, store, cfg) {
  const { enabled, params: p } = cfg.news;
  if (!enabled) return [];
  const opps = [];
  for (const a of news) {
    const titleHits = matchedKeywords(a.title, store.industryKeywords);
    const bodyHits = matchedKeywords(a.summary, store.industryKeywords);
    const topic = store.topics.find((t) => matchesAny(`${a.title} ${a.summary}`, t.keywords));
    const relevance = Math.min(10, titleHits.length * 2 + bodyHits.length + (topic ? 2 : 0));
    const age = daysAgo(a.date);
    if (relevance < p.minRelevance || age > p.maxAgeDays) continue;
    opps.push({
      id: `news-${a.id}`,
      signal: 'news',
      kind: 'opinion',
      category: 'PR',
      mergeKey: `news:${a.id}`,
      topic: topic?.id || `news:${a.id}`,
      sources: ['news'],
      output: 'social',
      title: `Have your say: “${a.title}”`,
      whyNow: `${a.outlet}, ${age} day${age === 1 ? '' : 's'} ago. Relevance ${relevance}/10 to your topics${topic ? ` (${topic.label.toLowerCase()})` : ''}. Only timely for about a week.`,
      doThis: 'Post a short owner opinion on LinkedIn and use it as this week’s newsletter angle.',
      evidence: [{ source: 'news', date: a.date, who: a.outlet, text: `${a.title}. ${a.summary}` }],
      metrics: [{ label: 'Relevance', value: `${relevance}/10` }, { label: 'Age', value: `${age} days` }],
      impact: topic ? 3 : 2,
      volume: bucket(relevance, [3, 5, 7, 9]),
      data: { article: a, stance: store.stances[topic?.id] || store.stances.default, topic },
    });
  }
  return opps;
}
