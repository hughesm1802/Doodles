// Sample Shopify orders, generated deterministically (seeded) so the demo
// is reproducible. The patterns below are what the detectors should find
// without being told; the detectors never read this file's rules.
import { business } from './business.js';

function mulberry32(seed) {
  return function rng() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ['Aoife', 'Ciarán', 'Niamh', 'Seán', 'Róisín', 'Darragh', 'Saoirse', 'Cian', 'Orla', 'Eoin', 'Clodagh', 'Fionn',
  'Éabha', 'Oisín', 'Laoise', 'Rory', 'Meabh', 'Conall', 'Sorcha', 'Tadhg', 'Aisling', 'Donal', 'Gráinne', 'Liam', 'Emma',
  'Jack', 'Sophie', 'Adam', 'Ella', 'Luke'];
const LAST = ['M', 'O', 'B', 'K', 'D', 'F', 'R', 'S', 'T', 'H', 'C', 'W', 'L', 'P', 'G', 'N'];

const price = Object.fromEntries(business.products.map((p) => [p.id, p.price]));

function iso(d) {
  return d.toISOString().slice(0, 10);
}

function pickWeighted(rng, pairs) {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = rng() * total;
  for (const [v, w] of pairs) {
    r -= w;
    if (r <= 0) return v;
  }
  return pairs[pairs.length - 1][0];
}

function buildBasket(rng, week) {
  const items = {};
  const add = (id, q = 1) => { items[id] = (items[id] || 0) + q; };
  const kits = rng() < 0.75 ? 1 : 2;
  for (let i = 0; i < kits; i += 1) {
    add(pickWeighted(rng, [['margherita', 32], ['pepperoni', 25], ['nduja', 20], ['vegan', 13], ['kids', 10]]));
  }
  if (items.nduja) { if (rng() < 0.62) add('hot-honey'); } else if (rng() < 0.07) add('hot-honey');
  if (items.kids) { if (rng() < 0.7) add('cookie'); } else if (rng() < 0.12) add('cookie');
  if (rng() < 0.02 + 0.009 * week) add('gf-base', kits); // demand rising week on week
  if (rng() < 0.25) add('garlic-dip');
  if (rng() < 0.1) add('beans');
  if (rng() < 0.05) { add('stone'); if (rng() < 0.65) add('peel'); } else if (rng() < 0.015) add('peel');
  return items;
}

function toOrder(id, date, customer, items, channel = 'online') {
  const lines = Object.entries(items).map(([productId, qty]) => ({ productId, qty }));
  const total = lines.reduce((s, l) => s + price[l.productId] * l.qty, 0);
  return { id, date, customer, channel, lines, total: Math.round(total * 100) / 100 };
}

function generate() {
  const rng = mulberry32(20261105);
  const customers = [];
  for (let i = 0; i < 260; i += 1) {
    customers.push(`${FIRST[Math.floor(rng() * FIRST.length)]} ${LAST[Math.floor(rng() * LAST.length)]}.#${i}`);
  }
  const regulars = customers.slice(0, 30);
  const orders = [];
  let n = 1001;
  const start = new Date('2026-08-10T12:00:00Z');
  const end = new Date('2026-11-04T12:00:00Z');
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay();
    const week = Math.floor((d - start) / (7 * 864e5));
    const count = Math.round(4 + (dow === 5 ? 6 : dow === 6 ? 5 : dow === 0 ? 3 : 0) + rng() * 3);
    for (let i = 0; i < count; i += 1) {
      const pool = rng() < 0.3 ? regulars : customers;
      const customer = pool[Math.floor(rng() * pool.length)];
      orders.push(toOrder(`#${n++}`, iso(d), customer, buildBasket(rng, week)));
    }
  }

  // A loyal regular reaching her 10th order this week
  const loyalDates = ['2026-08-14', '2026-08-28', '2026-09-11', '2026-09-19', '2026-09-26', '2026-10-03',
    '2026-10-10', '2026-10-17', '2026-10-24', '2026-11-02'];
  loyalDates.forEach((date, i) => {
    orders.push(toOrder(`#L${i + 1}`, date, 'Gráinne O.#loyal', i % 2 ? { nduja: 1, 'hot-honey': 1 } : { margherita: 1, cookie: 1 }));
  });

  // Small corporate orders + one big one
  orders.push(toOrder('#C1', '2026-09-25', 'Brightwater Dental', { 'team-box': 14 }, 'corporate'));
  orders.push(toOrder('#C2', '2026-10-30', 'Harbourline Tech', { 'team-box': 120 }, 'corporate'));

  return orders.sort((a, b) => a.date.localeCompare(b.date));
}

export const orders = generate();

export const displayCustomer = (c) => c.split('#')[0];
