import React from 'react';
import { Icon, SourceChip } from './ui.jsx';

const PHASES = [
  {
    name: 'MVP', note: 'Five sources power eight of the ten signals and close the search feedback loop.',
    items: [
      { src: 'orders', name: 'Shopify Admin API', what: 'Orders, products, inventory, customers', signals: 'Pairs, fast movers, overstock, milestones, lapsed, AOV', access: 'Custom app per pilot store; public app review later', health: 'ok', count: (d) => `${d.orders.length} orders` },
      { src: 'search', name: 'Google Search Console', what: 'Queries, pages, positions', signals: 'Striking distance, rising queries, loop measurement', access: 'Google OAuth app verification', health: 'ok', count: (d) => `${d.searchQueries.length} queries` },
      { src: 'search', name: 'GA4 Data API', what: 'Landing pages, referral sessions', signals: 'Loop measurement for social & PR', access: 'Same Google Cloud project', health: 'reconnect', count: () => 'measurement only' },
      { src: 'reviews', name: 'Review app API (Judge.me / Okendo / Yotpo)', what: 'Product reviews', signals: 'Review themes', access: 'Pick the one most pilot stores use', health: 'ok', count: (d) => `${d.reviews.length} reviews` },
      { src: 'inbox', name: 'Forwarding inbox (Postmark inbound)', what: 'Customer questions the owner auto-forwards', signals: 'Repeated questions, deal context', access: 'No external approval', health: 'ok', count: (d) => `${d.emails.length} emails` },
    ],
  },
  {
    name: 'Phase 2', note: 'Adds reaction and retention signals, and email becomes an output channel.',
    items: [
      { src: 'news', name: 'News feeds (Google News RSS, industry sites)', what: 'Industry stories', signals: 'Industry news', access: 'Check each source’s terms' },
      { src: 'inbox', name: 'Klaviyo', what: 'Segments, campaign results; campaigns created as drafts', signals: 'Lapsed customers, email measurement', access: 'OAuth app' },
      { src: 'reviews', name: 'Google Business Profile', what: 'Local reviews, Q&A', signals: 'Review themes', access: 'Separate approval; quota starts at zero' },
    ],
  },
  {
    name: 'Phase 3', note: 'Paid media and the second e-commerce platform.',
    items: [
      { src: 'search', name: 'Google Ads, Meta', what: 'Paid performance', signals: 'Budget suggestions', access: 'Developer token, app review' },
      { src: 'orders', name: 'WooCommerce', what: 'Same as Shopify', signals: 'All Shopify signals', access: 'Per-store keys' },
    ],
  },
  {
    name: 'Hospitality', note: 'The second vertical, once e-commerce is proven.',
    items: [
      { src: 'calendar', name: 'ResDiary, OpenTable, TripAdvisor', what: 'Covers, no-shows, peak days, reviews', signals: 'Booking patterns, review themes', access: 'Partner programmes' },
    ],
  },
];

const EMAIL_OPTIONS = [
  ['Forwarding address', 'MVP default', 'Low effort, no Google review'],
  ['Helpdesk API (Gorgias, Zendesk, Shopify Inbox)', 'If the store uses one', 'Per-platform OAuth app'],
  ['Klaviyo / Mailchimp', 'Phase 2', 'Signal source and output channel'],
  ['Microsoft Graph (Outlook)', 'Microsoft 365 stores', 'Publisher verification'],
  ['Gmail API', 'After product-market fit', 'Restricted scopes + annual security assessment'],
];

export default function Sources({ data, business }) {
  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Data sources · store {business.storeId}</p>
        <h1>Connected by the owner, checked every night</h1>
        <p className="lede">Owners connect their own accounts via OAuth. Every row carries the store ID with row-level security, and a failed token affects one store only and triggers a reconnect email, never a silent gap.</p>
      </header>

      {PHASES.map((ph) => (
        <section key={ph.name} className="panel">
          <div className="phase-head">
            <span className={`phase ${ph.name === 'MVP' ? 'phase-mvp' : 'phase-p2'}`}>{ph.name}</span>
            <p className="footnote">{ph.note}</p>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Source</th><th>Signals it powers</th><th>Access</th>{ph.name === 'MVP' && <th>Sync health</th>}</tr></thead>
              <tbody>
                {ph.items.map((it) => (
                  <tr key={it.name}>
                    <td><div className="src-cell"><SourceChip source={it.src} compact /><div><b>{it.name}</b><small>{it.what}</small></div></div></td>
                    <td>{it.signals}</td>
                    <td className="muted">{it.access}</td>
                    {ph.name === 'MVP' && (
                      <td>
                        {it.health === 'ok'
                          ? <span className="health ok"><i /> Synced 02:00 · {it.count(data)}</span>
                          : <span className="health warn"><i /> Token expired · reconnect email sent</span>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ph.name === 'MVP' && (
            <p className="forward"><Icon name="inbox" size={15} /> Forwarding address for this store: <code>{business.forwardingAddress}</code>. The owner sets an auto-forward rule for customer questions.</p>
          )}
        </section>
      ))}

      <section className="split">
        <div className="panel">
          <h2>Email integration path</h2>
          <ul className="plain">
            {EMAIL_OPTIONS.map(([a, b, c]) => <li key={a}><b>{a}</b><span>{b}</span><small>{c}</small></li>)}
          </ul>
        </div>
        <div className="panel">
          <h2><Icon name="lock" size={16} /> Data handling (GDPR processor)</h2>
          <ul className="plain">
            <li><b>EU hosting</b><small>Database, jobs and email in the EU region</small></li>
            <li><b>Pseudonymised analysis</b><small>Customers are IDs in the engine</small></li>
            <li><b>No personal data in AI prompts</b><small>Names and emails stripped before the Claude API call</small></li>
            <li><b>Retention</b><small>Raw inbox text deleted after 90 days; only question clusters kept</small></li>
            <li><b>Contracts</b><small>DPA with each pilot store; AI provider DPA, no training on API data</small></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
