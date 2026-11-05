import { daysAgo, fmtDate } from '../text.js';

/** Irish retail calendar: seasonal prompts inside each event's lead time. */
export function detectCalendar(events, store, cfg) {
  if (!cfg.calendar.enabled) return [];
  return events.flatMap((ev) => {
    const date = ev.date.startsWith('store:') ? store[ev.date.slice(6)] : ev.date;
    const daysTo = -daysAgo(date);
    if (daysTo < 0 || daysTo > ev.leadDays) return [];
    return [{
      id: `season-${ev.id}`,
      signal: 'calendar',
      kind: 'seasonal',
      category: 'Seasonal',
      mergeKey: `season:${ev.id}`,
      topic: ev.id === 'xmas-cutoff' || ev.id === 'christmas' ? 'corporate' : `season:${ev.id}`,
      sources: ['calendar'],
      output: 'email',
      title: `${ev.name}: ${daysTo} days to go (${fmtDate(date)})`,
      whyNow: `${ev.name} is ${daysTo} days away. ${ev.angle}`,
      doThis: ev.id === 'xmas-cutoff'
        ? 'Add a cut-off banner to the store now and put the date in every email until then.'
        : 'Plan the offer this week, then email and post it from launch day.',
      evidence: [{ source: 'calendar', date, who: 'Irish retail calendar', text: `${ev.name} · ${fmtDate(date)}` }],
      metrics: [{ label: 'Days to go', value: daysTo }],
      impact: ev.impact,
      volume: 5,
      data: { event: ev, date, daysTo },
    }];
  });
}
