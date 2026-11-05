import React, { useMemo, useState } from 'react';
import { SOURCE_LABELS } from '../engine/index.js';
import { CategoryChip, Score, SourceChip, STATUS_LABEL } from './ui.jsx';
import OpportunityDetail from './OpportunityDetail.jsx';

const CATS = ['All', 'Content', 'Promotion', 'PR', 'Reputation', 'Moments', 'SEO'];
const TABS = [
  { id: 'new', label: 'New' },
  { id: 'approved', label: 'Approved' },
  { id: 'snoozed', label: 'Snoozed' },
  { id: 'dismissed', label: 'Dismissed' },
];

export default function Feed(props) {
  const { opps, statuses, selectedId, setSelectedId } = props;
  const [cat, setCat] = useState('All');
  const [src, setSrc] = useState('all');
  const [tab, setTab] = useState('new');

  const list = useMemo(() => opps.filter((o) => {
    const st = statuses[o.id] || 'new';
    return st === tab && (cat === 'All' || o.category === cat) && (src === 'all' || o.sources.includes(src));
  }), [opps, statuses, tab, cat, src]);

  const selected = opps.find((o) => o.id === selectedId);
  const count = (id) => opps.filter((o) => (statuses[o.id] || 'new') === id).length;

  return (
    <div className={`feed ${selected ? 'has-detail' : ''}`}>
      <div className="feed-list">
        <header className="feed-head">
          <h1>Opportunities</h1>
          <div className="tabs" role="tablist">
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
                {t.label} <small>{count(t.id)}</small>
              </button>
            ))}
          </div>
          <div className="filters">
            <div className="chips">
              {CATS.map((c) => (
                <button key={c} type="button" className={`filter ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
            <select value={src} onChange={(e) => setSrc(e.target.value)} aria-label="Filter by data source">
              <option value="all">All sources</option>
              {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </header>

        <ul className="cards">
          {list.map((o) => (
            <li key={o.id}>
              <button type="button" className={`opp-card ${o.id === selectedId ? 'selected' : ''}`} onClick={() => setSelectedId(o.id)}>
                <div className="opp-card-top">
                  <CategoryChip category={o.category} />
                  {o.signalCount > 1 && <span className="multi" title="Corroborated by more than one data source">{o.signalCount} signals</span>}
                  <span className="spacer" />
                  <Score value={o.score} size={38} />
                </div>
                <h3>{o.title}</h3>
                <p>{o.insight}</p>
                <div className="opp-card-foot">
                  {o.sources.map((s) => <SourceChip key={s} source={s} />)}
                  <span className="effort">{o.effort} effort</span>
                  {statuses[o.id] && <span className="status-pill">{STATUS_LABEL[statuses[o.id]]}</span>}
                </div>
              </button>
            </li>
          ))}
          {!list.length && <li className="empty">Nothing here. {tab === 'new' ? 'You’ve worked through everything. Check back tomorrow.' : 'Try another tab or filter.'}</li>}
        </ul>
      </div>

      <div className="feed-detail">
        {selected
          ? <OpportunityDetail key={selected.id} opp={selected} {...props} onClose={() => setSelectedId(null)} />
          : <div className="detail-empty"><p>Pick an opportunity to see the evidence and the ready-made drafts.</p></div>}
      </div>
    </div>
  );
}
