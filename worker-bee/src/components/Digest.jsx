import React from 'react';
import { buildDrafts, CHANNELS } from '../engine/drafts.js';
import { OUTPUTS } from '../engine/outputs.js';
import { PRIVATE_OUTPUTS } from '../engine/index.js';
import { CategoryChip, Icon, Ice, SourceChip, STATUS_LABEL } from './ui.jsx';

export const DIGEST_SIZE = 5;

export function digestOf(opps, statuses) {
  const live = opps.filter((o) => !['snoozed', 'notrelevant'].includes(statuses[o.id]?.status));
  return {
    top: live.filter((o) => !PRIVATE_OUTPUTS.has(o.output)).slice(0, DIGEST_SIZE),
    privateNotes: live.filter((o) => PRIVATE_OUTPUTS.has(o.output)),
    held: Math.max(0, live.filter((o) => !PRIVATE_OUTPUTS.has(o.output)).length - DIGEST_SIZE),
  };
}

const windows = (w) => w.map((x) => `${x}`).join(', ') + ' days';

function DigestCard({ o, i, statuses, setStatus, brand, business, open }) {
  const drafts = buildDrafts(o, brand, business);
  const m = OUTPUTS[o.output].measure;
  const st = statuses[o.id]?.status;
  return (
    <article className={`digest-card ${st === 'approved' ? 'is-approved' : ''}`}>
      <header>
        <span className="rank">{i + 1}</span>
        <CategoryChip category={o.category} />
        {o.sources.map((s) => <SourceChip key={s} source={s} compact />)}
        <span className="spacer" />
        <Ice o={o} />
      </header>
      <h3><button type="button" className="title-link" onClick={() => open(o.id)}>{o.title}</button></h3>
      <dl className="card-dl">
        <dt>Why now</dt><dd>{o.whyNow}</dd>
        <dt>Do this</dt><dd>{o.doThis}</dd>
        <dt>Draft ready</dt><dd>{[...new Set(drafts.map((x) => CHANNELS[x.channel].label))].join(', ')}</dd>
        <dt>We’ll measure</dt><dd>{m.metric} ({m.source}) over {windows(m.windows)}</dd>
      </dl>
      <footer className="card-actions">
        {st === 'approved' ? (
          <>
            <span className="approved-note"><Icon name="check" size={15} /> Approved: {OUTPUTS[o.output].handoff.toLowerCase()}</span>
            <button type="button" className="btn-ghost btn-sm" onClick={() => setStatus(o.id, null)}>Undo</button>
          </>
        ) : (
          <>
            <button type="button" className="btn-primary" onClick={() => setStatus(o.id, 'approved')}><Icon name="check" size={15} /> Approve</button>
            <button type="button" className="btn-secondary" onClick={() => open(o.id, true)}><Icon name="edit" size={15} /> Edit</button>
            <button type="button" className="btn-ghost" onClick={() => setStatus(o.id, 'snoozed')}>Not now</button>
            <button type="button" className="btn-ghost" onClick={() => setStatus(o.id, 'notrelevant')}>Not relevant</button>
          </>
        )}
      </footer>
    </article>
  );
}

export default function Digest(props) {
  const { opps, statuses, business, data, open, go } = props;
  const { top, privateNotes, held } = digestOf(opps, statuses);

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Monday digest · preview · sends Mon 9 Nov, 8:00 by email and in the app</p>
        <h1>Morning, {business.owner}. Five things worth doing this week.</h1>
        <p className="lede">
          Last night I synced <b>{data.orders.length} orders</b>, <b>{data.emails.length} forwarded questions</b>, <b>{data.reviews.length} product reviews</b> and <b>{data.searchQueries.length} search queries</b>,
          and found {opps.length} opportunities. These are the top {DIGEST_SIZE} by Impact × Confidence × Ease. Nothing goes live until you approve it.
        </p>
      </header>

      <div className="digest-list">
        {top.map((o, i) => <DigestCard key={o.id} o={o} i={i} {...props} />)}
      </div>

      {held > 0 && (
        <p className="held">
          {held} more opportunities held back on purpose. A long list recreates the overwhelm. <button type="button" className="btn-link" onClick={() => go('feed')}>See them in the review queue →</button>
        </p>
      )}

      {privateNotes.length > 0 && (
        <section className="panel panel-private">
          <div className="panel-head">
            <Icon name="lock" />
            <div>
              <h2>For your eyes only</h2>
              <p>Not marketing. Customer thank-yous and problems customers keep raising. These sit outside the top {DIGEST_SIZE}.</p>
            </div>
          </div>
          {privateNotes.map((o) => (
            <button key={o.id} type="button" className="row-link" onClick={() => open(o.id)}>
              <span><CategoryChip category={o.category} /> {o.title}</span>
              <small>{o.doThis}{statuses[o.id] ? ` · ${STATUS_LABEL[statuses[o.id].status]}` : ''}</small>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
