import React, { useMemo } from 'react';
import { TODAY } from '../data/business.js';
import { buildDrafts, draftMinutes } from '../engine/drafts.js';
import { SOURCE_LABELS } from '../engine/index.js';
import { CategoryChip, Icon, Score, SourceChip } from './ui.jsx';

function MiniCard({ o, open, rank }) {
  return (
    <button type="button" className="mini-card" onClick={() => open(o.id)}>
      <div className="mini-top">
        {rank && <span className="rank">{rank}</span>}
        <CategoryChip category={o.category} />
        <span className="spacer" />
        {o.sources.map((s) => <SourceChip key={s} source={s} compact />)}
        <Score value={o.score} size={36} />
      </div>
      <h3>{o.title}</h3>
      <p>{o.insight}</p>
    </button>
  );
}

export default function Briefing({ opps, statuses, brand, business, data, open, go }) {
  const live = opps.filter((o) => statuses[o.id] !== 'dismissed');
  const fresh = live.filter((o) => !statuses[o.id]);

  const stats = useMemo(() => {
    const drafts = live.flatMap((o) => buildDrafts(o, brand, business));
    return {
      drafts: drafts.length,
      hours: Math.round(draftMinutes(drafts) / 60),
      multi: live.filter((o) => o.signalCount > 1).length,
    };
  }, [live, brand, business]);

  const top = fresh.filter((o) => o.category !== 'Moments' && o.kind !== 'reply-reviews').slice(0, 3);
  const moments = live.filter((o) => o.category === 'Moments' || o.kind === 'reply-reviews');
  const fixes = live.filter((o) => o.kind === 'review-fix');
  const bySource = Object.keys(SOURCE_LABELS).map((s) => ({ s, n: live.filter((o) => o.sources.includes(s)).length }));
  const maxN = Math.max(...bySource.map((x) => x.n), 1);
  const day = new Date(TODAY).toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">{day}</p>
        <h1>Morning, {business.owner}.</h1>
        <p className="lede">
          While you were busy running the business, I read <b>{data.emails.length} emails</b>, <b>{data.orders.length} orders</b>, <b>{data.reviews.length} reviews</b>, <b>{data.news.length} news stories</b> and <b>{data.searchQueries.length} search queries</b>.
          Here's what's worth your time this week.
        </p>
      </header>

      <section className="stat-row">
        <div className="stat"><span>{fresh.length}</span><small>new opportunities</small></div>
        <div className="stat"><span>{stats.drafts}</span><small>drafts ready to use</small></div>
        <div className="stat"><span>~{stats.hours}h</span><small>of marketing work drafted</small></div>
        <div className="stat"><span>{stats.multi}</span><small>backed by more than one source</small></div>
      </section>

      <section>
        <div className="section-head">
          <h2>Your top 3 this week</h2>
          <button type="button" className="btn-link" onClick={() => go('feed')}>See all {live.length} →</button>
        </div>
        <div className="mini-grid">
          {top.map((o, i) => <MiniCard key={o.id} o={o} open={open} rank={i + 1} />)}
          {!top.length && <p className="empty">You're all caught up. Nice work.</p>}
        </div>
      </section>

      <section className="split">
        <div className="panel panel-moments">
          <div className="panel-head">
            <Icon name="heart" />
            <div>
              <h2>Moments that matter</h2>
              <p>Real marketing is great service. This is where yours is showing, and where it needs you.</p>
            </div>
          </div>
          {moments.map((o) => (
            <button key={o.id} type="button" className="row-link" onClick={() => open(o.id)}>
              <span>{o.title}</span>
              <small>{o.insight}</small>
            </button>
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <Icon name="alert" />
            <div>
              <h2>Needs fixing before it needs marketing</h2>
              <p>Patterns in your reviews that no post can paper over.</p>
            </div>
          </div>
          {fixes.map((o) => (
            <button key={o.id} type="button" className="row-link" onClick={() => open(o.id)}>
              <span>{o.title}</span>
              <small>{o.insight}</small>
            </button>
          ))}
          {!fixes.length && <p className="empty">No recurring complaints. Your customers are happy.</p>}
        </div>
      </section>

      <section className="panel">
        <h2>Where this week's opportunities came from</h2>
        <div className="bars">
          {bySource.map(({ s, n }) => (
            <div key={s} className="bar-row">
              <SourceChip source={s} />
              <div className="bar"><i style={{ width: `${(n / maxN) * 100}%` }} /></div>
              <b>{n}</b>
            </div>
          ))}
        </div>
        <p className="footnote">Opportunities that combine sources (for example, a question customers email about <em>and</em> search for) score higher, because more than one signal is pointing the same way.</p>
      </section>
    </div>
  );
}
