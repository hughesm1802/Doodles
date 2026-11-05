import { matchedKeywords, matchesAny, daysAgo } from '../text.js';

/**
 * Industry news → timely "have your say" opportunities.
 * Relevance = industry keyword overlap (title counts double) + topic match.
 * Timeliness decays over ~2 weeks: news is only an opportunity while it's news.
 */
export function detectNews(news, business) {
  const opps = [];
  for (const a of news) {
    const titleHits = matchedKeywords(a.title, business.industryKeywords);
    const bodyHits = matchedKeywords(a.summary, business.industryKeywords);
    const topic = business.topics.find((t) => matchesAny(`${a.title} ${a.summary}`, t.keywords));
    const relevance = titleHits.length * 2 + bodyHits.length + (topic ? 2 : 0);
    const age = daysAgo(a.date);
    if (relevance < 4 || age > 21) continue;
    const stance = business.stances[topic?.id] || business.stances.default;
    opps.push({
      id: `news-${a.id}`,
      kind: 'opinion',
      category: 'PR',
      topic: topic?.id || `news:${a.id}`,
      sources: ['news'],
      title: `Have your say: “${a.title}”`,
      insight: `${a.outlet} · ${age === 0 ? 'today' : `${age} day${age === 1 ? '' : 's'} ago`} · relevance ${Math.min(10, relevance)}/10`,
      why: `Journalists and customers look for local voices when a story like this breaks. A short, honest take from you positions ${business.name} as the business that leads on this, and it's only timely for about a week.`,
      evidence: [{ source: 'news', date: a.date, who: a.outlet, text: `${a.title}. ${a.summary}` }],
      metrics: [
        { label: 'Relevance', value: `${Math.min(10, relevance)}/10` },
        { label: 'Matched', value: [...new Set([...titleHits, ...bodyHits])].slice(0, 4).join(', ') },
      ],
      impact: topic ? 4 : 3,
      confidence: Math.min(1, 0.3 + relevance * 0.07),
      urgency: Math.max(0, 1 - age / 14),
      effort: 'Low',
      data: { article: a, stance, topic },
    });
  }
  return opps;
}
