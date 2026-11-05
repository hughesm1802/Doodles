import React, { useMemo, useState } from 'react';
import { buildDrafts, buildPrompt, draftMinutes } from '../engine/drafts.js';
import { fmtDate } from '../engine/text.js';
import { CategoryChip, CopyButton, Icon, Score, SourceChip, STATUS_LABEL } from './ui.jsx';
import DraftStudio from './DraftStudio.jsx';

export default function OpportunityDetail({ opp, opps, statuses, setStatus, brand, business, onClose, setSelectedId }) {
  const [showAll, setShowAll] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const drafts = useMemo(() => buildDrafts(opp, brand, business), [opp, brand, business]);
  const related = opp.related.map((id) => opps.find((o) => o.id === id)).filter(Boolean);
  const status = statuses[opp.id];
  const evidence = showAll ? opp.evidence : opp.evidence.slice(0, 4);
  const hours = draftMinutes(drafts) / 60;

  return (
    <article className="detail">
      <div className="detail-top">
        <button type="button" className="btn-ghost back" onClick={onClose}><Icon name="back" size={16} /> All opportunities</button>
        <span className="spacer" />
        {status && <span className="status-pill">{STATUS_LABEL[status]}</span>}
      </div>

      <header className="detail-head">
        <div className="detail-meta">
          <CategoryChip category={opp.category} />
          {opp.sources.map((s) => <SourceChip key={s} source={s} />)}
        </div>
        <div className="detail-title">
          <h2>{opp.title}</h2>
          <Score value={opp.score} size={56} />
        </div>
        <p className="insight">{opp.insight}</p>
      </header>

      <section className="why">
        <h4>Why I flagged this</h4>
        <p>{opp.why}</p>
        <div className="factors">
          <span>Impact <b>{opp.impact}/5</b></span>
          <span>Confidence <b>{Math.round(opp.confidence * 100)}%</b></span>
          <span>Timeliness <b>{Math.round(opp.urgency * 100)}%</b></span>
          <span>Effort <b>{opp.effort}</b></span>
          <span>Saves you <b>~{hours >= 1 ? `${hours.toFixed(1)}h` : `${Math.round(hours * 60)} min`}</b></span>
        </div>
      </section>

      <section className="metrics">
        {opp.metrics.map((m) => (
          <div key={m.label} className="metric"><small>{m.label}</small><b>{m.value}</b></div>
        ))}
      </section>

      {related.length > 0 && (
        <section className="related">
          <h4><Icon name="link" size={15} /> Connected signals</h4>
          {related.map((r) => (
            <button key={r.id} type="button" className="related-link" onClick={() => setSelectedId(r.id)}>
              <CategoryChip category={r.category} /> <span>{r.title}</span>
            </button>
          ))}
        </section>
      )}

      <section className="evidence">
        <h4>The evidence ({opp.evidence.length})</h4>
        <ul>
          {evidence.map((e, i) => (
            <li key={i}>
              <SourceChip source={e.source} compact />
              <div>
                <p>{e.text}</p>
                <small>{e.who} · {fmtDate(e.date)}</small>
              </div>
            </li>
          ))}
        </ul>
        {opp.evidence.length > 4 && (
          <button type="button" className="btn-link" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show less' : `Show all ${opp.evidence.length}`}
          </button>
        )}
      </section>

      <DraftStudio drafts={drafts} brand={brand} />

      <section className="prompt-box">
        <button type="button" className="btn-link" onClick={() => setShowPrompt(!showPrompt)}>
          {showPrompt ? 'Hide' : 'Show'} the agent brief behind these drafts
        </button>
        {showPrompt && (
          <>
            <p className="footnote">In production, this brief goes to the language model together with your brand profile. The drafts above are the offline templates the prototype uses in its place.</p>
            <pre>{buildPrompt(opp, brand, business)}</pre>
            <CopyButton text={buildPrompt(opp, brand, business)} label="Copy brief" />
          </>
        )}
      </section>

      <footer className="action-bar">
        {status !== 'approved'
          ? <button type="button" className="btn-primary" onClick={() => setStatus(opp.id, 'approved')}><Icon name="check" size={16} /> Approve & add to plan</button>
          : <button type="button" className="btn-secondary" onClick={() => setStatus(opp.id, null)}>Move back to New</button>}
        {status !== 'snoozed' && <button type="button" className="btn-secondary" onClick={() => setStatus(opp.id, 'snoozed')}><Icon name="clock" size={16} /> Snooze a week</button>}
        {status !== 'dismissed' && <button type="button" className="btn-ghost" onClick={() => setStatus(opp.id, 'dismissed')}><Icon name="x" size={16} /> Not for us</button>}
      </footer>
    </article>
  );
}
