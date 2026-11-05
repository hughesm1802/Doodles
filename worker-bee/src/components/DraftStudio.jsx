import React, { useState } from 'react';
import { brandCheck } from '../engine/drafts.js';
import { CopyButton, Icon } from './ui.jsx';

export default function DraftStudio({ drafts, brand }) {
  const [i, setI] = useState(0);
  if (!drafts.length) return null;
  const draft = drafts[Math.min(i, drafts.length - 1)];
  const all = draft.fields.map((x) => `${x.label}\n${x.text}`).join('\n\n');

  return (
    <section className="studio">
      <div className="studio-head">
        <h4>Ready-made drafts</h4>
        <small>{drafts.length} format{drafts.length > 1 ? 's' : ''}, sized and specced for each channel</small>
      </div>
      <div className="studio-tabs" role="tablist">
        {drafts.map((x, n) => (
          <button key={`${x.channel}-${n}`} type="button" role="tab" aria-selected={n === i} className={n === i ? 'on' : ''} onClick={() => setI(n)}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="spec">
        <Icon name="check" size={14} />
        <span>{draft.spec}</span>
      </div>
      <div className="fields">
        {draft.fields.map((x) => {
          const flagged = brandCheck(x.text, brand.avoid);
          const over = x.limit && x.text.length > x.limit;
          return (
            <div key={x.label} className="field">
              <div className="field-head">
                <b>{x.label}</b>
                {x.limit ? <small className={over ? 'over' : ''}>{x.text.length.toLocaleString('en-IE')} / {x.limit.toLocaleString('en-IE')}</small> : null}
                <span className="spacer" />
                <CopyButton text={x.text} />
              </div>
              <pre className={x.mono ? 'mono' : ''}>{x.text}</pre>
              {flagged.length > 0 && <p className="warn">Brand check: uses “{flagged.join('”, “')}”, which is on your avoid list.</p>}
            </div>
          );
        })}
      </div>
      <div className="studio-foot">
        <CopyButton text={all} label="Copy all" />
      </div>
    </section>
  );
}
