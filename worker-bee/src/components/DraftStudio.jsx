import React, { useState } from 'react';
import { brandCheck } from '../engine/drafts.js';
import { CopyButton, Icon } from './ui.jsx';

export default function DraftStudio({ drafts, brand, oppId, editMode, setEditMode, edits, setEdits }) {
  const [i, setI] = useState(0);
  if (!drafts.length) return null;
  const n = Math.min(i, drafts.length - 1);
  const draft = drafts[n];
  const keyOf = (x) => `${oppId}|${draft.channel}|${n}|${x.label}`;
  const textOf = (x) => edits[keyOf(x)] ?? x.text;
  const all = draft.fields.map((x) => `${x.label}\n${textOf(x)}`).join('\n\n');
  const edited = draft.fields.some((x) => edits[keyOf(x)] != null);

  return (
    <section className="studio">
      <div className="studio-head">
        <h4>Drafts ready</h4>
        <small>{drafts.length} format{drafts.length > 1 ? 's' : ''}, sized for each channel</small>
        <span className="spacer" />
        <button type="button" className={`btn-sm ${editMode ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setEditMode(!editMode)}>
          <Icon name="edit" size={14} /> {editMode ? 'Done' : 'Edit'}
        </button>
      </div>
      <div className="studio-tabs" role="tablist">
        {drafts.map((x, k) => (
          <button key={`${x.channel}-${k}`} type="button" role="tab" aria-selected={k === n} className={k === n ? 'on' : ''} onClick={() => setI(k)}>{x.label}</button>
        ))}
      </div>
      <div className="spec"><Icon name="check" size={14} /><span>{draft.spec}</span></div>
      <div className="fields">
        {draft.fields.map((x) => {
          const text = textOf(x);
          const flagged = brandCheck(text, brand.avoid);
          const over = x.limit && text.length > x.limit;
          return (
            <div key={x.label} className="field">
              <div className="field-head">
                <b>{x.label}</b>
                {x.limit ? <small className={over ? 'over' : ''}>{text.length.toLocaleString('en-IE')} / {x.limit.toLocaleString('en-IE')}</small> : null}
                {edits[keyOf(x)] != null && <small className="edited">edited</small>}
                <span className="spacer" />
                <CopyButton text={text} />
              </div>
              {editMode
                ? <textarea className={x.mono ? 'mono' : ''} value={text} rows={Math.min(16, text.split('\n').length + 1)} onChange={(e) => setEdits({ ...edits, [keyOf(x)]: e.target.value })} />
                : <pre className={x.mono ? 'mono' : ''}>{text}</pre>}
              {flagged.length > 0 && <p className="warn">Brand check: uses “{flagged.join('”, “')}”, which is on your never-say list.</p>}
            </div>
          );
        })}
      </div>
      <div className="studio-foot">
        <CopyButton text={all} label="Copy all" />
        {edited && (
          <button type="button" className="btn-ghost btn-sm" onClick={() => {
            const next = { ...edits };
            draft.fields.forEach((x) => delete next[keyOf(x)]);
            setEdits(next);
          }}>Reset to original draft</button>
        )}
      </div>
    </section>
  );
}
