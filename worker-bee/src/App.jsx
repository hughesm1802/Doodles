import React, { useMemo, useState } from 'react';
import { business, defaultBrand } from './data/business.js';
import { emails } from './data/emails.js';
import { orders } from './data/orders.js';
import { reviews } from './data/reviews.js';
import { news } from './data/news.js';
import { searchQueries } from './data/search.js';
import { runEngine } from './engine/index.js';
import { usePersistentState } from './lib/store.js';
import { BeeMark, Icon } from './components/ui.jsx';
import Briefing from './components/Briefing.jsx';
import Feed from './components/Feed.jsx';
import Plan from './components/Plan.jsx';
import Sources from './components/Sources.jsx';
import BrandProfile from './components/BrandProfile.jsx';

const DATA = { emails, orders, reviews, news, searchQueries };

const NAV = [
  { id: 'briefing', label: 'Briefing', icon: 'home' },
  { id: 'feed', label: 'Opportunities', icon: 'spark' },
  { id: 'plan', label: 'Plan', icon: 'calendar' },
  { id: 'sources', label: 'Data sources', icon: 'plug' },
  { id: 'brand', label: 'Brand & voice', icon: 'palette' },
];

export default function App() {
  const [view, setView] = useState('briefing');
  const [selectedId, setSelectedId] = useState(null);
  const [brand, setBrand] = usePersistentState('wb.brand.v1', defaultBrand);
  const [statuses, setStatuses] = usePersistentState('wb.status.v1', {});

  const opps = useMemo(() => runEngine(DATA, business), []);

  const setStatus = (id, status) => setStatuses((s) => {
    const next = { ...s };
    if (status) next[id] = status; else delete next[id];
    return next;
  });

  const open = (id) => { setSelectedId(id); setView('feed'); window.scrollTo(0, 0); };
  const go = (id) => { setView(id); if (id !== 'feed') setSelectedId(null); window.scrollTo(0, 0); };
  const newCount = opps.filter((o) => !statuses[o.id]).length;
  const ctx = { opps, statuses, setStatus, brand, setBrand, business, data: DATA, open, go };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <BeeMark />
          <div>
            <strong>Worker Bee</strong>
            <small>for {business.name}</small>
          </div>
        </div>
        <nav>
          {NAV.map((n) => (
            <button key={n.id} type="button" className={`nav-item ${view === n.id ? 'active' : ''}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.id === 'feed' && newCount > 0 && <em className="badge">{newCount}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p className="demo-note">Prototype with sample data. {business.name} is a fictional business.</p>
          <button type="button" className="btn-link" onClick={() => { setStatuses({}); setBrand(defaultBrand); }}>Reset demo</button>
        </div>
      </aside>
      <main className="main">
        {view === 'briefing' && <Briefing {...ctx} />}
        {view === 'feed' && <Feed {...ctx} selectedId={selectedId} setSelectedId={setSelectedId} />}
        {view === 'plan' && <Plan {...ctx} />}
        {view === 'sources' && <Sources {...ctx} />}
        {view === 'brand' && <BrandProfile {...ctx} />}
      </main>
    </div>
  );
}
