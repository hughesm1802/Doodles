import React from 'react';
import { Icon, SourceChip } from './ui.jsx';

const CONNECTED = [
  { id: 'email', name: 'Gmail / Outlook inbox', count: (d) => `${d.emails.length} emails`, looks: 'Recurring customer questions → FAQ and blog topics. Big confirmed deals and client praise → PR, with permission tracking.' },
  { id: 'orders', name: 'Shopify orders', count: (d) => `${d.orders.length} orders`, looks: 'Products bought together → bundles (market-basket lift). Products trending up → spotlight. Record orders → PR. Loyalty milestones → personal thank-yous.' },
  { id: 'reviews', name: 'Google Business Profile reviews', count: (d) => `${d.reviews.length} reviews`, looks: 'Repeated praise → testimonials. Repeated complaints → fix-first alerts. Staff named in reviews → thank them. Unanswered reviews → drafted replies.' },
  { id: 'news', name: 'Industry & local news', count: (d) => `${d.news.length} articles`, looks: 'Stories relevant to your industry and location → timely opinion posts and journalist pitches, ranked by relevance and freshness.' },
  { id: 'search', name: 'Google Search Console', count: (d) => `${d.searchQueries.length} queries`, looks: 'Searches you show up for but don’t win → content gaps. Pages ranking 4–15 → quick title and FAQ fixes.' },
];

const NEXT = [
  ['GA4', 'Which content actually drives sales'],
  ['Meta & TikTok insights', 'Learn what your audience engages with'],
  ['Square / Lightspeed POS', 'In-store sales patterns'],
  ['Xero', 'Margin-aware promotions'],
  ['Mailchimp / Klaviyo', 'Send approved emails directly'],
  ['Deliveroo / Just Eat', 'Third-party order and rating data'],
  ['Local events calendar', 'Festivals, matches and holidays worth riding'],
  ['AI answer tracking', 'Is ChatGPT / Google AI recommending you?'],
];

export default function Sources({ data, opps }) {
  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Data sources</p>
        <h1>What I read, and what I look for</h1>
        <p className="lede">Every opportunity traces back to real evidence from these sources. Nothing is a generic content idea.</p>
      </header>

      <div className="source-grid">
        {CONNECTED.map((s) => (
          <div key={s.id} className="source-card">
            <div className="source-card-head">
              <SourceChip source={s.id} />
              <span className="connected"><i /> Connected · sample data</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.looks}</p>
            <div className="source-card-foot">
              <span>{s.count(data)} read</span>
              <b>{opps.filter((o) => o.sources.includes(s.id)).length} opportunities</b>
            </div>
          </div>
        ))}
      </div>

      <section className="panel">
        <h2>On the roadmap</h2>
        <div className="next-grid">
          {NEXT.map(([n, why]) => (
            <div key={n} className="next-item">
              <Icon name="plug" size={16} />
              <div><b>{n}</b><small>{why}</small></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
