// Built-in Irish retail calendar: seasonal prompts on top of the 10 signals.
// leadDays per event = how early the prompt should appear.
export const retailCalendar = [
  { id: 'black-friday', name: 'Black Friday & Cyber Monday', date: '2026-11-27', leadDays: 35, impact: 5,
    angle: 'Decide your offer now. A bundle beats a blanket discount for margin.' },
  { id: 'xmas-cutoff', name: 'Last order date for Christmas delivery', date: 'store:christmasCutoff', leadDays: 45, impact: 5,
    angle: 'Announce your cut-off early and repeat it: “order by” deadlines drive the biggest week of the year.' },
  { id: 'christmas', name: 'Christmas', date: '2026-12-25', leadDays: 42, impact: 4, angle: 'Gift guides and gift cards for late shoppers.' },
  { id: 'valentines', name: 'Valentine’s Day', date: '2027-02-14', leadDays: 28, impact: 3, angle: 'Date night in.' },
  { id: 'mothers-day', name: 'Mother’s Day (Ireland)', date: '2027-03-07', leadDays: 28, impact: 4, angle: 'Irish Mother’s Day is in March, not May. Don’t follow UK or US timing.' },
  { id: 'st-patricks', name: 'St Patrick’s Day', date: '2027-03-17', leadDays: 21, impact: 3, angle: 'Long-weekend pizza night.' },
  { id: 'back-to-school', name: 'Back to school', date: '2027-08-26', leadDays: 21, impact: 2, angle: 'Easy Friday dinners for busy families.' },
];
