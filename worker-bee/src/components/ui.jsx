import React, { useState } from 'react';
import { copyText } from '../lib/store.js';
import { SOURCE_LABELS } from '../engine/index.js';

const paths = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  spark: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4',
  palette: 'M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8zM7.5 11.5h.01M10 7.5h.01M15 8h.01',
  email: 'M3 6h18v12H3zM3 7l9 6 9-6',
  orders: 'M4 5h2l2 10h10l2-7H7M9 20h.01M17 20h.01',
  reviews: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  news: 'M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5M8 16h3',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l5 5',
  check: 'M5 12l5 5 9-10',
  copy: 'M9 9h11v11H9zM5 15V4h11',
  clock: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3 2',
  x: 'M6 6l12 12M18 6L6 18',
  back: 'M15 5l-7 7 7 7',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  alert: 'M12 4l9 16H3zM12 10v4M12 17h.01',
};

export function Icon({ name, size = 18, className = '' }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export function BeeMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="22" cy="20" rx="12" ry="8" fill="var(--wing)" transform="rotate(-30 22 20)" />
      <ellipse cx="42" cy="20" rx="12" ry="8" fill="var(--wing)" transform="rotate(30 42 20)" />
      <ellipse cx="32" cy="38" rx="16" ry="19" fill="var(--honey)" />
      <path d="M17 33h30M16 41h32M19 49h26" stroke="var(--bee-stripe)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="32" cy="17" r="8" fill="var(--bee-stripe)" />
    </svg>
  );
}

export function SourceChip({ source, compact = false }) {
  return (
    <span className={`source-chip src-${source}`} title={SOURCE_LABELS[source]}>
      <Icon name={source} size={13} />
      {!compact && SOURCE_LABELS[source]}
    </span>
  );
}

export function CategoryChip({ category }) {
  return <span className={`cat-chip cat-${category.toLowerCase()}`}>{category}</span>;
}

export function Score({ value, size = 44 }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="score" style={{ width: size, height: size }} title={`Opportunity score ${value}/100`}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} className="score-track" />
        <circle cx={size / 2} cy={size / 2} r={r} className="score-fill" strokeDasharray={`${(c * value) / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <span>{value}</span>
    </div>
  );
}

export function CopyButton({ text, label = 'Copy' }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost btn-sm"
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        }
      }}
    >
      <Icon name={done ? 'check' : 'copy'} size={14} /> {done ? 'Copied' : label}
    </button>
  );
}

export const STATUS_LABEL = { approved: 'Approved', snoozed: 'Snoozed', dismissed: 'Dismissed' };
