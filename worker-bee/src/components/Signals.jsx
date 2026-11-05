import React from 'react';
import { SIGNALS, defaultSignalConfig } from '../engine/signals.js';
import { SourceChip } from './ui.jsx';

const LABELS = {
  minCount: 'min count', windowDays: 'window (days)', minCoOrders: 'min co-orders', minLift: 'min lift', minPos: 'min position',
  maxPos: 'max position', minImpressions: 'min impressions', minGrowth: 'min growth %', minUnits: 'min units', maxDaysCover: 'max days of cover',
  largeOrderMultiple: 'large order (× AOV)', minRelevance: 'min relevance', maxAgeDays: 'max age (days)', gapMultiple: 'gap multiple', minOrders: 'min orders',
};

export default function Signals({ cfg, setSavedCfg, opps }) {
  const defaults = defaultSignalConfig();
  const update = (key, patch) => setSavedCfg((s) => ({ ...s, [key]: { ...cfg[key], ...(s[key] || {}), ...patch } }));
  const setParam = (key, p, v) => update(key, { params: { ...cfg[key].params, [p]: v } });

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Signal library v1</p>
        <h1>Ten rules, tuned per store</h1>
        <p className="lede">Each signal is a rule with a default threshold: a starting assumption to test in the pilot, not a benchmark. Lower thresholds for small stores with thin data. Changes re-run the engine instantly.</p>
      </header>

      <div className="signal-list">
        {SIGNALS.map((s) => {
          const c = cfg[s.key];
          const fired = opps.filter((o) => o.signals.includes(s.key)).length;
          const changed = JSON.stringify(c.params) !== JSON.stringify(defaults[s.key].params);
          return (
            <article key={s.key} className={`signal ${c.enabled ? '' : 'off'}`}>
              <header>
                <span className="sig-n">{s.n || '+'}</span>
                <div>
                  <h3>{s.name}</h3>
                  <small>{s.trigger(c.params)}</small>
                </div>
                <span className="spacer" />
                <span className={`phase phase-${s.phase === 'MVP' ? 'mvp' : 'p2'}`}>{s.phase}{s.phase !== 'MVP' ? ' preview' : ''}</span>
                <label className="switch">
                  <input type="checkbox" checked={c.enabled} onChange={(e) => update(s.key, { enabled: e.target.checked })} />
                  <span>{c.enabled ? 'On' : 'Off'}</span>
                </label>
              </header>
              <div className="signal-body">
                <SourceChip source={s.source} />
                <span className="muted">→ {s.action}</span>
                <span className="spacer" />
                <b className="fired">{c.enabled ? `${fired} firing` : 'off'}</b>
              </div>
              {Object.keys(c.params).length > 0 && (
                <div className="params">
                  {Object.entries(c.params).map(([p, v]) => (
                    <label key={p}>
                      <span>{LABELS[p] || p}</span>
                      <input type="number" step={p === 'minLift' ? 0.1 : 1} value={v} disabled={!c.enabled} onChange={(e) => setParam(s.key, p, Number(e.target.value))} />
                    </label>
                  ))}
                  {changed && <button type="button" className="btn-link" onClick={() => update(s.key, { params: { ...defaults[s.key].params } })}>Reset to default</button>}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
