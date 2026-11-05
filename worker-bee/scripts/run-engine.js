// Run the engine headless (the shape of the nightly job) and print the ranked list + digest.
// Usage: npm run engine
import { business } from '../src/data/business.js';
import { emails } from '../src/data/emails.js';
import { orders } from '../src/data/orders.js';
import { reviews } from '../src/data/reviews.js';
import { news } from '../src/data/news.js';
import { searchQueries } from '../src/data/search.js';
import { retailCalendar } from '../src/data/calendar.js';
import { history, pilotStats } from '../src/data/history.js';
import { detect, learn, rank, PRIVATE_OUTPUTS } from '../src/engine/index.js';
import { defaultSignalConfig } from '../src/engine/signals.js';

const all = process.argv.includes('--phase2');
const cfg = defaultSignalConfig();
if (all) { cfg.news.enabled = true; cfg.lapsed.enabled = true; }
const data = { emails, orders, reviews, news, searchQueries, calendar: retailCalendar };
const opps = detect(data, business, cfg);
const ranked = rank(opps, learn(history, {}, opps, pilotStats));

console.log(`Store ${business.storeId} · ${emails.length} emails · ${orders.length} orders · ${reviews.length} reviews · ${searchQueries.length} queries${all ? ' · Phase 2 on' : ''}`);
console.log(`${ranked.length} opportunities detected\n`);
for (const o of ranked) {
  console.log(`${String(o.ice).padStart(4)}  I${o.impact}×C${o.confidence}×E${o.ease}  [${o.category}] ${o.title}`);
  console.log(`      ${o.signals.join('+')} · ${o.sources.join('+')} · output ${o.output}`);
}
console.log('\nMonday digest (top 5):');
ranked.filter((o) => !PRIVATE_OUTPUTS.has(o.output)).slice(0, 5).forEach((o, i) => console.log(`  ${i + 1}. ${o.title} (${o.ice})`));
