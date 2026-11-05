import { TODAY } from '../data/business.js';

export const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’‘]/g, "'");

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cache = new Map();
function re(keyword) {
  if (!cache.has(keyword)) cache.set(keyword, new RegExp(`\\b${esc(norm(keyword))}`, 'i'));
  return cache.get(keyword);
}

/** Prefix match at a word boundary: "freez" matches "freezer", "freezing". */
export const hasKeyword = (text, kw) => re(kw).test(norm(text));
export const matchesAny = (text, kws) => kws.some((k) => hasKeyword(text, k));
export const matchedKeywords = (text, kws) => kws.filter((k) => hasKeyword(text, k));

export const sentences = (s) => s.split(/(?<=[.!?])\s+/).map((t) => t.trim()).filter(Boolean);

export const daysAgo = (date) => Math.round((new Date(TODAY) - new Date(date)) / 864e5);

/** 1 = happened today, 0 = older than `window` days */
export const recency = (date, window = 30) => Math.max(0, 1 - daysAgo(date) / window);

const POS = ['amazing', 'brilliant', 'great', 'gorgeous', 'delicious', 'perfect', 'lovely', 'best', 'fantastic', 'easy',
  'love', 'loved', 'excellent', 'class', 'unreal', 'friendly', 'helpful', 'fun', 'gem', 'favourite', 'good value', 'worth it',
  'could not tell the difference', 'so easy', 'better than'];
const NEG = ['late', 'delayed', 'warm when', 'soggy', 'disappoint', 'missing', 'broken', 'too much', 'so much plastic',
  'so many', 'waste', 'pricey', 'expensive', 'poor', 'slow', 'never arrived', 'wrong', 'damaged', 'did not ring', 'wish',
  'reschedule', 'instead of'];

/** Sentence-level sentiment with the star rating as tie-breaker. */
export function sentiment(sentence, rating) {
  const neg = NEG.filter((w) => hasKeyword(sentence, w)).length;
  const pos = POS.filter((w) => hasKeyword(sentence, w)).length;
  if (neg > pos) return -1;
  if (pos > neg) return 1;
  if (neg && pos) return rating >= 4 ? 1 : -1;
  return rating >= 4 ? 1 : rating <= 2 ? -1 : 0;
}

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
export const euro = (n) => `€${n.toLocaleString('en-IE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
export const pct = (n) => `${Math.round(n * 100)}%`;
