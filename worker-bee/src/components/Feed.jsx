import React, { useMemo, useState } from 'react';
import { SOURCE_LABELS } from '../engine/index.js';
import { CategoryChip, Ice, SourceChip, STATUS_LABEL } from './ui.jsx';
import OpportunityDetail from './OpportunityDetail.jsx';
import { digestOf } from './Digest.jsx';

const CATS = ['All', 'Content', 'Promotion', 'PR', 'SEO', 'Seasonal', 'Social proof', 'Ops flag', 'Thank-you'];
const TABS = [
  { id: 'new', label: 'To review' },
  { id: 'approved', label: 'Approved' },
  { id: 'snoozed', label: 'Not now' },
  { id: 'notrelevant', label: 'Not relevant' },
];

export default function Feed(props) {
  const { opps, statuses, selectedId, setSelectedId } = props;
  const [cat, setCat] = useState('All');
  const [src, setSrc] = useState('all');
  const [tab, setTab] = useState('new');
  const inDigest = new Set(digestOf(opps, statuses).top.map((o) => o.id));

  const list = useMemo(() => opps.filter((o) => {
    const st = statuses[o.id]?.status || 'new';
    return st === tab && (cat === 'All' || o.category === cat) && (src === 'all' || o.sources.includes(src));
  }), [opps, statuses, tab, cat, src]);

  const selected = opps.find((o) => o.id === selectedId);
  const count = (id) => opps.filter((o) => (statuses[o.id]?.status || 'new') === id).length;

  return (
    <div className={`feed ${selected ? 'has-detail' : ''}`}>
      <div className="feed-list">
        <header className="feed-head">
          <h1>Review queue</h1>
          <p className="footnote">Everything the engine detected, ranked by ICE. In the pilot you review every draft here before it reaches the client.</p>
          <div className="tabs" role="tablist">
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
                {t.label} <small>{count(t.id)}</small>
              </button>
            ))}
          </div>
          <div className="filters">
            <div className="chips">
              {CATS.map((c) => <button key={c} type="button" className={`filter ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
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
                  {inDigest.has(o.id) && <span className="multi">In digest</span>}
                  {o.signals.length > 1 && <span className="multi" title="More than one signal agrees">{o.signals.length} signals</span>}
                  <span className="spacer" />
                  <Ice o={o} />
                </div>
                <h3>{o.title}</h3>
                <p>{o.whyNow}</p>
                <div className="opp-card-foot">
                  {o.sources.map((s) => <SourceChip key={s} source={s} />)}
                  {statuses[o.id] && <span className="status-pill">{STATUS_LABEL[statuses[o.id].status]}</span>}
                </div>
              </button>
            </li>
          ))}
          {!list.length && <li className="empty">Nothing here. Try another tab or filter.</li>}
        </ul>
      </div>

      <div className="feed-detail">
        {selected
          ? <OpportunityDetail key={selected.id} opp={selected} {...props} onClose={() => setSelectedId(null)} />
          : <div className="detail-empty"><p>Pick an opportunity to see the evidence, the ICE breakdown and the drafts.</p></div>}
      </div>
    </div>
  );
}
