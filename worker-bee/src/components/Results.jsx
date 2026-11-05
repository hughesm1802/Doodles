import React from 'react';
import { TODAY } from '../data/business.js';
import { OUTPUTS } from '../engine/outputs.js';
import { SIGNALS } from '../engine/signals.js';
import { confidenceFor } from '../engine/index.js';
import { fmtDate } from '../engine/text.js';
import { CategoryChip, Icon } from './ui.jsx';
import { DIGEST_SIZE } from './Digest.jsx';

const OUTCOME = { win: 'Win', neutral: 'Neutral', miss: 'Miss' };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

export default function Results({ opps, statuses, patchStatus, learning, history, pilotStats, open }) {
  const approved = opps.filter((o) => statuses[o.id]?.status === 'approved');
  const sessionDecided = opps.filter((o) => statuses[o.id]).length;
  const approvals = pilotStats.approved + approved.length;
  const shown = pilotStats.shown + (sessionDecided ? DIGEST_SIZE : 0);
  const outcomes = [...history.map((h) => h.outcome), ...approved.map((o) => statuses[o.id].outcome).filter(Boolean)];
  const wins = outcomes.filter((x) => x === 'win').length;

  const metrics = [
    { label: 'Approval rate', value: `${Math.round((approvals / shown) * 100)}%`, target: '≥ 40%', ok: approvals / shown >= 0.4, note: `${approvals} of ${shown} digest suggestions` },
    { label: 'Time to act', value: `${pilotStats.medianDaysToLive} days`, target: '< 3 days', ok: pilotStats.medianDaysToLive < 3, note: 'Median, digest to live' },
    { label: 'Win rate', value: `${Math.round((wins / outcomes.length) * 100)}%`, target: '≥ 30%', ok: wins / outcomes.length >= 0.3, note: `${wins} wins of ${outcomes.length} measured` },
    { label: 'Owner time', value: `${pilotStats.ownerMinutesPerWeek} min/wk`, target: '< 30 min', ok: pilotStats.ownerMinutesPerWeek < 30, note: 'Self-reported' },
    { label: 'Retention', value: '–', target: '4 of 5 at 3 months', ok: null, note: 'Measured from month 3' },
  ];

  const sigs = SIGNALS.filter((s) => learning[s.key] || opps.some((o) => o.signal === s.key));

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Feedback loop</p>
        <h1>Results & learning</h1>
        <p className="lede">Every approved opportunity gets a measurement window. Each result moves the Confidence score for that signal type at this store, so suggestions that work for you rise and the ones that don’t fall.</p>
      </header>

      <section className="metric-row">
        {metrics.map((m) => (
          <div key={m.label} className={`kpi ${m.ok === true ? 'ok' : m.ok === false ? 'off' : ''}`}>
            <small>{m.label}</small>
            <b>{m.value}</b>
            <span>Target {m.target}</span>
            <em>{m.note}</em>
          </div>
        ))}
      </section>

      <section className="panel">
        <h2>Live and measuring</h2>
        <p className="footnote">The window starts when the owner marks the item live (or when the URL or SKU is detected). In this demo you can log the outcome to see the loop re-rank the queue.</p>
        {!approved.length && <p className="empty">Approve something in the digest to start measuring it.</p>}
        <ul className="measure-list">
          {approved.map((o) => {
            const s = statuses[o.id];
            const m = OUTPUTS[o.output].measure;
            const ends = s.live ? addDays(s.live, m.windows[0]) : null;
            return (
              <li key={o.id}>
                <div className="measure-main">
                  <button type="button" className="title-link" onClick={() => open(o.id)}>{o.title}</button>
                  <small>{m.metric} · {m.source} · {m.windows.join('/')} days · win if: {m.win}</small>
                  <small>{s.live ? `Live ${fmtDate(s.live)} · first read ${fmtDate(ends)}` : `Approved ${fmtDate(s.at)} · ${OUTPUTS[o.output].handoff}`}</small>
                </div>
                <div className="measure-actions">
                  {!s.live && <button type="button" className="btn-secondary btn-sm" onClick={() => patchStatus(o.id, { live: TODAY })}>Mark live</button>}
                  {s.live && ['win', 'neutral', 'miss'].map((x) => (
                    <button key={x} type="button" className={`btn-sm outcome ${s.outcome === x ? `on ${x}` : 'btn-secondary'}`} onClick={() => patchStatus(o.id, { outcome: s.outcome === x ? undefined : x })}>{OUTCOME[x]}</button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel">
        <h2>What the Bee has learned about this store</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Signal</th><th>Wins</th><th>Neutral</th><th>Misses</th><th>Not relevant</th><th>Confidence adj.</th></tr></thead>
            <tbody>
              {sigs.map((s) => {
                const c = confidenceFor({ signal: s.key, volume: 3 }, learning);
                const adj = c.track - c.dismiss;
                const t = c.record;
                return (
                  <tr key={s.key}>
                    <td>{s.n ? `${s.n}. ` : ''}{s.name}</td>
                    <td>{t.win}</td><td>{t.neutral}</td><td>{t.miss}</td><td>{t.notRelevant}</td>
                    <td className={adj > 0.2 ? 'pos' : adj < -0.2 ? 'neg' : ''}>{adj > 0 ? '+' : ''}{adj.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="footnote">Win rate is shrunk towards a 35% prior so a single result can’t swing a signal. Each “Not relevant” lowers it by 0.5. “Not now” snoozes for 30 days with no penalty.</p>
      </section>

      <section className="panel">
        <h2>Past results (pilot weeks 1–4)</h2>
        <ul className="history">
          {history.map((h) => (
            <li key={h.id}>
              <span className={`outcome-pill ${h.outcome}`}>{OUTCOME[h.outcome]}</span>
              <div>
                <b>{h.title}</b>
                <small>{h.result} · live {fmtDate(h.live)} · {OUTPUTS[h.output].label}</small>
              </div>
              <CategoryChip category={SIGNALS.find((s) => s.key === h.signal).name} />
            </li>
          ))}
        </ul>
      </section>

      <section className="panel rules">
        <h2><Icon name="check" size={16} /> Measurement rules</h2>
        <ul>
          <li>Re-fetch a trailing window nightly: GSC finalises 2–3 days late.</li>
          <li>Missing data is “not available”, never zero.</li>
          <li>Compare like-for-like periods (28 days vs the previous 28).</li>
          <li>CTR = total clicks ÷ total impressions, never an average of ratios.</li>
        </ul>
      </section>
    </div>
  );
}
