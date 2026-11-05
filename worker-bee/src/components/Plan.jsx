import React, { useMemo } from 'react';
import { buildDrafts, CHANNELS } from '../engine/drafts.js';
import { CategoryChip, Icon } from './ui.jsx';

// Best days per channel (0 = Monday). In production these come from the
// business's own engagement data; these are sensible local-business defaults.
const CADENCE = {
  gbp: [0, 4], blog: [1], instagram: [1, 3, 5], reel: [2, 4], linkedin: [2], email: [3], press: [0, 1, 2, 3],
};
const START = new Date('2026-11-09T12:00:00Z'); // next Monday
const DAYS = 14;

export default function Plan({ opps, statuses, brand, business, open, go }) {
  const approved = opps.filter((o) => statuses[o.id] === 'approved');

  const { days, todos } = useMemo(() => {
    const grid = Array.from({ length: DAYS }, (_, i) => {
      const date = new Date(START);
      date.setUTCDate(date.getUTCDate() + i);
      return { date, items: [] };
    });
    const taken = new Set();
    const tasks = [];
    for (const o of approved) {
      for (const dr of buildDrafts(o, brand, business)) {
        const days = CADENCE[dr.channel];
        if (!days) { tasks.push({ o, dr }); continue; }
        const slot = grid.findIndex((g, i) => days.includes(i % 7) && !taken.has(`${dr.channel}-${i}`));
        if (slot === -1) { tasks.push({ o, dr, overflow: true }); continue; }
        taken.add(`${dr.channel}-${slot}`);
        grid[slot].items.push({ o, dr });
      }
    }
    return { days: grid, todos: tasks };
  }, [approved, brand, business]);

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Next two weeks</p>
        <h1>Your marketing plan</h1>
        <p className="lede">Approved opportunities, spread across the best days for each channel. Nothing goes out without your OK.</p>
      </header>

      {!approved.length ? (
        <div className="panel empty-plan">
          <p>Nothing approved yet. Approve a few opportunities and I'll slot every draft into the right channel on the right day.</p>
          <button type="button" className="btn-primary" onClick={() => go('feed')}>Review opportunities</button>
        </div>
      ) : (
        <>
          <div className="calendar">
            {days.map(({ date, items }) => (
              <div key={date.toISOString()} className={`day ${items.length ? '' : 'quiet'}`}>
                <div className="day-head">
                  <b>{date.toLocaleDateString('en-IE', { weekday: 'short', timeZone: 'UTC' })}</b>
                  <small>{date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', timeZone: 'UTC' })}</small>
                </div>
                {items.map(({ o, dr }, i) => (
                  <button key={i} type="button" className={`slot ch-${dr.channel}`} onClick={() => open(o.id)}>
                    <small>{CHANNELS[dr.channel].label}</small>
                    <span>{o.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          <section className="panel">
            <h2>Off-calendar to-dos</h2>
            <p className="footnote">Things that aren't posts: shop changes, replies, notes and fixes. Often the most valuable work on the list.</p>
            <ul className="todo">
              {todos.map(({ o, dr, overflow }, i) => (
                <li key={i}>
                  <Icon name="check" size={15} />
                  <button type="button" className="btn-link" onClick={() => open(o.id)}>{dr.label}</button>
                  <span className="muted">· {o.title}</span>
                  {overflow && <span className="muted"> (no free slot in the next 2 weeks)</span>}
                  <CategoryChip category={o.category} />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
