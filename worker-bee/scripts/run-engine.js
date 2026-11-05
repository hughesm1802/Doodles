// Run the opportunity engine headless and print the ranked feed.
// Usage: npm run engine
import { business } from '../src/data/business.js';
import { emails } from '../src/data/emails.js';
import { orders } from '../src/data/orders.js';
import { reviews } from '../src/data/reviews.js';
import { news } from '../src/data/news.js';
import { searchQueries } from '../src/data/search.js';
import { runEngine } from '../src/engine/index.js';

const opps = runEngine({ emails, orders, reviews, news, searchQueries }, business);
console.log(`Read ${emails.length} emails · ${orders.length} orders · ${reviews.length} reviews · ${news.length} articles · ${searchQueries.length} search queries`);
console.log(`Found ${opps.length} opportunities\n`);
for (const o of opps) {
  console.log(`${String(o.score).padStart(3)}  [${o.category}] ${o.title}`);
  console.log(`     ${o.sources.join('+')} · ${o.insight}`);
}
