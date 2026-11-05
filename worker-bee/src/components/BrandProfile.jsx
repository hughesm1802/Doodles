import React from 'react';
import { CHANNELS, PUBLIC_CHANNELS } from '../engine/drafts.js';

const TONES = [
  { id: 'warm', label: 'Warm & witty', sample: '“Right so, you lot figured this one out before we did…”' },
  { id: 'straight', label: 'Straight-talking', sample: '“Quick update: the combo you order most is now a bundle.”' },
  { id: 'premium', label: 'Refined', sample: '“From our kitchen: a pairing our guests already love.”' },
];
const list = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);

export default function BrandProfile({ brand, setBrand, business }) {
  const set = (k, v) => setBrand({ ...brand, [k]: v });

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Brand voice</p>
        <h1>Sound like you, not like an agency</h1>
        <p className="lede">Set from the onboarding questionnaire and the store’s existing site copy. In the pilot, your edits to drafts become training examples for this store’s voice.</p>
      </header>

      <div className="brand-grid">
        <section className="panel">
          <h2>Tone of voice</h2>
          <div className="tones">
            {TONES.map((t) => (
              <label key={t.id} className={`tone ${brand.tone === t.id ? 'on' : ''}`}>
                <input type="radio" name="tone" checked={brand.tone === t.id} onChange={() => set('tone', t.id)} />
                <b>{t.label}</b>
                <small>{t.sample}</small>
              </label>
            ))}
          </div>
          <label className="toggle">
            <input type="checkbox" checked={brand.emoji} onChange={(e) => set('emoji', e.target.checked)} />
            <span>Use emoji (sparingly)</span>
          </label>
          <label className="field-input">
            <span>Sign-off</span>
            <input value={brand.signOff} onChange={(e) => set('signOff', e.target.value)} />
          </label>
          <label className="field-input">
            <span>Hashtags (comma separated)</span>
            <input value={brand.hashtags.join(', ')} onChange={(e) => set('hashtags', list(e.target.value))} />
          </label>
          <label className="field-input">
            <span>Never say (comma separated)</span>
            <input value={brand.avoid.join(', ')} onChange={(e) => set('avoid', list(e.target.value))} />
            <small>Every draft is checked against this list.</small>
          </label>
        </section>

        <section className="panel">
          <h2>Channels you use</h2>
          <p className="footnote">I only draft for channels you're actually on. Better to do three well than seven badly.</p>
          <div className="channel-list">
            {PUBLIC_CHANNELS.map((c) => (
              <label key={c} className="toggle">
                <input type="checkbox" checked={brand.channels[c] !== false} onChange={(e) => set('channels', { ...brand.channels, [c]: e.target.checked })} />
                <span><b>{CHANNELS[c].label}</b><small>{CHANNELS[c].spec}</small></span>
              </label>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>What I know about {business.name}</h2>
          <dl className="facts">
            <dt>What you do</dt><dd>{business.type}</dd>
            <dt>Where</dt><dd>{business.location}</dd>
            <dt>Who buys</dt><dd>{business.audience}</dd>
            <dt>Platform</dt><dd>{business.platform} · {business.staff} staff · no in-house marketer</dd>
            <dt>Topics I watch</dt><dd>{business.topics.map((t) => t.label).join(' · ')}</dd>
          </dl>
          <h3>Your views (from the questionnaire)</h3>
          <p className="footnote">Opinion posts start from what you actually think, so they never put words in your mouth.</p>
          <ul className="stances">
            {Object.entries(business.stances).filter(([k]) => k !== 'default').map(([k, v]) => (
              <li key={k}><b>{business.topics.find((t) => t.id === k)?.label || k}</b><span>“{v}”</span></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
