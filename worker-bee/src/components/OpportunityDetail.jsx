import React, { useMemo, useState } from 'react';
import { buildDrafts, buildPrompt } from '../engine/drafts.js';
import { OUTPUTS } from '../engine/outputs.js';
import { SIGNAL_BY_KEY } from '../engine/signals.js';
import { fmtDate } from '../engine/text.js';
import { CategoryChip, CopyButton, Icon, Ice, SourceChip, STATUS_LABEL } from './ui.jsx';
import DraftStudio from './DraftStudio.jsx';

const sign = (x) => (x > 0 ? `+${x.toFixed(1)}` : x.toFixed(1));

export default function OpportunityDetail(props) {
  const { opp, opps, statuses, setStatus, brand, business, onClose, setSelectedId, editMode, setEditMode, edits, setEdits } = props;
  const [showAll, setShowAll] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const drafts = useMemo(() => buildDrafts(opp, brand, business), [opp, brand, business]);
  const related = opp.related.map((id) => opps.find((o) => o.id === id)).filter(Boolean);
  const status = statuses[opp.id]?.status;
  const out = OUTPUTS[opp.output];
  const c = opp.conf;
  const evidence = showAll ? opp.evidence : opp.evidence.slice(0, 4);

  return (
    <article className="detail">
      <div className="detail-top">
        <button type="button" className="btn-ghost back" onClick={onClose}><Icon name="back" size={16} /> Review queue</button>
        <span className="spacer" />
        {status && <span className="status-pill">{STATUS_LABEL[status]}</span>}
      </div>

      <header className="detail-head">
        <div className="detail-meta">
          <CategoryChip category={opp.category} />
          {opp.sources.map((s) => <SourceChip key={s} source={s} />)}
          <span className="sig-list">{opp.signals.map((k) => `#${SIGNAL_BY_KEY[k].n || 'cal'} ${SIGNAL_BY_KEY[k].name}`).join(' · ')}</span>
        </div>
        <div className="detail-title">
          <h2>{opp.title}</h2>
          <Ice o={opp} big />
        </div>
      </header>

      <section className="why">
        <dl className="card-dl">
          <dt>Why now</dt><dd>{opp.whyNow}</dd>
          <dt>Do this</dt><dd>{opp.doThis}</dd>
        </dl>
      </section>

      <section className="ice-grid">
        <div className="ice-cell"><small>Impact</small><b>{opp.impact}/5</b><span>Revenue or traffic at stake</span></div>
        <div className="ice-cell">
          <small>Confidence</small><b>{opp.confidence}/5</b>
          <span>Data volume {c.volume} · track record {sign(c.track)} ({c.record.win}W {c.record.neutral}N {c.record.miss}M){c.dismiss ? ` · dismissals −${c.dismiss}` : ''}</span>
        </div>
        <div className="ice-cell"><small>Ease</small><b>{opp.ease}/5</b><span>{out.label}</span></div>
        <div className="ice-cell total"><small>ICE score</small><b>{opp.ice}</b><span>of 125</span></div>
      </section>

      <section className="loop">
        <div>
          <h4><Icon name="check" size={14} /> On approval</h4>
          <p>{out.handoff}.</p>
        </div>
        <div>
          <h4><Icon name="chart" size={14} /> We’ll measure</h4>
          <p>{out.measure.metric} · {out.measure.source} · {out.measure.windows.join(' / ')} days.<br /><small>Win if: {out.measure.win}.</small></p>
        </div>
      </section>

      <section className="metrics">
        {opp.metrics.map((m) => <div key={m.label} className="metric"><small>{m.label}</small><b>{m.value}</b></div>)}
      </section>

      {related.length > 0 && (
        <section className="related">
          <h4><Icon name="link" size={15} /> Connected opportunities</h4>
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
              <div><p>{e.text}</p><small>{e.who} · {fmtDate(e.date)}</small></div>
            </li>
          ))}
        </ul>
        {opp.evidence.length > 4 && <button type="button" className="btn-link" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show less' : `Show all ${opp.evidence.length}`}</button>}
      </section>

      <DraftStudio drafts={drafts} brand={brand} oppId={opp.id} editMode={editMode} setEditMode={setEditMode} edits={edits} setEdits={setEdits} />

      <section className="prompt-box">
        <button type="button" className="btn-link" onClick={() => setShowPrompt(!showPrompt)}>{showPrompt ? 'Hide' : 'Show'} the Claude API brief</button>
        {showPrompt && (
          <>
            <p className="footnote">What the pilot sends to the model. Customer names and email addresses are replaced before anything leaves the database.</p>
            <pre>{buildPrompt(opp, brand, business)}</pre>
            <CopyButton text={buildPrompt(opp, brand, business)} label="Copy brief" />
          </>
        )}
      </section>

      <footer className="action-bar">
        {status === 'approved'
          ? <button type="button" className="btn-secondary" onClick={() => setStatus(opp.id, null)}>Undo approval</button>
          : <button type="button" className="btn-primary" onClick={() => setStatus(opp.id, 'approved')}><Icon name="check" size={16} /> Approve</button>}
        {status !== 'approved' && <button type="button" className="btn-secondary" onClick={() => setEditMode(!editMode)}><Icon name="edit" size={16} /> {editMode ? 'Done editing' : 'Edit'}</button>}
        {status !== 'snoozed' && <button type="button" className="btn-ghost" onClick={() => setStatus(opp.id, 'snoozed')}><Icon name="clock" size={16} /> Not now</button>}
        {status !== 'notrelevant' && <button type="button" className="btn-ghost" onClick={() => setStatus(opp.id, 'notrelevant')}><Icon name="x" size={16} /> Not relevant</button>}
        {(status === 'snoozed' || status === 'notrelevant') && <button type="button" className="btn-ghost" onClick={() => setStatus(opp.id, null)}>Restore</button>}
      </footer>
    </article>
  );
}
