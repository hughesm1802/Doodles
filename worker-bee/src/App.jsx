import React, { useMemo, useState } from 'react';
import { business, defaultBrand } from './data/business.js';
import { emails } from './data/emails.js';
import { orders } from './data/orders.js';
import { reviews } from './data/reviews.js';
import { news } from './data/news.js';
import { searchQueries } from './data/search.js';
import { retailCalendar } from './data/calendar.js';
import { history, pilotStats } from './data/history.js';
import { detect, learn, rank } from './engine/index.js';
import { defaultSignalConfig } from './engine/signals.js';
import { usePersistentState } from './lib/store.js';
import { TODAY } from './data/business.js';
import { BeeMark, Icon } from './components/ui.jsx';
import Digest from './components/Digest.jsx';
import Feed from './components/Feed.jsx';
import Results from './components/Results.jsx';
import Signals from './components/Signals.jsx';
import Sources from './components/Sources.jsx';
import BrandProfile from './components/BrandProfile.jsx';

const DATA = { emails, orders, reviews, news, searchQueries, calendar: retailCalendar };

const NAV = [
  { id: 'digest', label: 'Monday digest', icon: 'home' },
  { id: 'feed', label: 'Review queue', icon: 'spark' },
  { id: 'results', label: 'Results & learning', icon: 'chart' },
  { id: 'signals', label: 'Signal library', icon: 'sliders' },
  { id: 'sources', label: 'Data sources', icon: 'plug' },
  { id: 'brand', label: 'Brand voice', icon: 'palette' },
];

function mergeConfig(saved) {
  const base = defaultSignalConfig();
  for (const [k, v] of Object.entries(saved || {})) {
    if (base[k]) base[k] = { enabled: v.enabled ?? base[k].enabled, params: { ...base[k].params, ...v.params } };
  }
  return base;
}

export default function App() {
  const [view, setView] = useState('digest');
  const [selectedId, setSelectedId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [brand, setBrand] = usePersistentState('wb.brand.v2', defaultBrand);
  const [statuses, setStatuses] = usePersistentState('wb.status.v2', {});
  const [savedCfg, setSavedCfg] = usePersistentState('wb.signals.v1', {});
  const [edits, setEdits] = usePersistentState('wb.edits.v1', {});

  const cfg = useMemo(() => mergeConfig(savedCfg), [savedCfg]);
  const detected = useMemo(() => detect(DATA, business, cfg), [cfg]);
  const learning = useMemo(() => learn(history, statuses, detected, pilotStats), [statuses, detected]);
  const opps = useMemo(() => rank(detected, learning), [detected, learning]);

  const setStatus = (id, status) => setStatuses((s) => {
    const next = { ...s };
    if (status) next[id] = { ...(s[id] || {}), status, at: TODAY };
    else delete next[id];
    return next;
  });
  const patchStatus = (id, patch) => setStatuses((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

  const open = (id, edit = false) => { setSelectedId(id); setEditMode(edit); setView('feed'); window.scrollTo(0, 0); };
  const go = (id) => { setView(id); if (id !== 'feed') setSelectedId(null); window.scrollTo(0, 0); };
  const reset = () => { setStatuses({}); setBrand(defaultBrand); setSavedCfg({}); setEdits({}); };

  const ctx = {
    opps, statuses, setStatus, patchStatus, brand, setBrand, business, data: DATA, open, go,
    cfg, setSavedCfg, learning, history, pilotStats, edits, setEdits, editMode, setEditMode,
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <BeeMark />
          <div>
            <strong>Worker Bee</strong>
            <small>{business.name} · {business.storeId}</small>
          </div>
        </div>
        <nav>
          {NAV.map((n) => (
            <button key={n.id} type="button" className={`nav-item ${view === n.id ? 'active' : ''}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p className="demo-note">MVP prototype · sample data. {business.name} is a fictional Shopify store. Suggest-only: nothing is ever published.</p>
          <button type="button" className="btn-link" onClick={reset}>Reset demo</button>
        </div>
      </aside>
      <main className="main">
        {view === 'digest' && <Digest {...ctx} />}
        {view === 'feed' && <Feed {...ctx} selectedId={selectedId} setSelectedId={setSelectedId} />}
        {view === 'results' && <Results {...ctx} />}
        {view === 'signals' && <Signals {...ctx} />}
        {view === 'sources' && <Sources {...ctx} />}
        {view === 'brand' && <BrandProfile {...ctx} />}
      </main>
    </div>
  );
}
