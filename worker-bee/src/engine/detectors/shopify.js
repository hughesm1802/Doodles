import { daysAgo, euro, pct, norm, bucket } from '../text.js';
import { displayCustomer } from '../../data/orders.js';

const has = (o, id) => o.lines.some((l) => l.productId === id);
const units = (orders, id) => orders.reduce((s, o) => s + o.lines.filter((l) => l.productId === id).reduce((a, l) => a + l.qty, 0), 0);
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };

/**
 * Shopify Admin API data: orders, products, inventory, customers.
 * Signals 3 (pair), 6 (fast mover), 7 (overstock), 8 (milestone), 10 (lapsed, Phase 2).
 */
export function detectShopify(orders, store, cfg) {
  const opps = [];
  const P = Object.fromEntries(store.products.map((p) => [p.id, p]));
  const retail = orders.filter((o) => o.channel === 'online');
  const last28 = retail.filter((o) => daysAgo(o.date) <= 28);
  const prev28 = retail.filter((o) => daysAgo(o.date) > 28 && daysAgo(o.date) <= 56);
  const aov = retail.reduce((s, o) => s + o.total, 0) / retail.length;

  // ── Signal 6: fast movers (computed first; overstock pairs with them) ──
  const fast = [];
  const fm = cfg['fast-mover'];
  for (const p of store.products) {
    const now = units(last28, p.id);
    const before = units(prev28, p.id);
    if (!before || now < fm.params.minUnits) continue;
    const growth = (now / before - 1) * 100;
    if (growth < fm.params.minGrowth) continue;
    const revenue = last28.filter((o) => has(o, p.id)).reduce((s, o) => s + o.total, 0);
    fast.push({ p, now, before, growth, revenue });
  }
  fast.sort((a, b) => b.growth - a.growth);
  if (fm.enabled) {
    for (const f of fast) {
      const topic = store.topics.find((t) => t.keywords.some((k) => norm(f.p.name).includes(norm(k))));
      opps.push({
        id: `fast-${f.p.id}`,
        signal: 'fast-mover',
        kind: 'fast-mover',
        category: 'Promotion',
        mergeKey: `product:${f.p.id}`,
        topic: topic?.id || `product:${f.p.id}`,
        sources: ['orders'],
        output: 'email',
        title: `${f.p.name} is moving fast: up ${Math.round(f.growth)}% in 4 weeks`,
        whyNow: `${f.now} units sold in the last 28 days vs ${f.before} in the 28 before (+${Math.round(f.growth)}%), without being promoted.`,
        doThis: 'Feature it in this week’s email and on social while the momentum lasts.',
        evidence: [
          { source: 'orders', date: '2026-11-04', who: 'Last 28 days', text: `${f.now} units · ${last28.filter((o) => has(o, f.p.id)).length} orders` },
          { source: 'orders', date: '2026-10-07', who: 'Previous 28 days', text: `${f.before} units · ${prev28.filter((o) => has(o, f.p.id)).length} orders` },
        ],
        metrics: [{ label: 'Units (28d)', value: f.now }, { label: 'Prior 28d', value: f.before }, { label: 'Growth', value: `+${Math.round(f.growth)}%` }],
        impact: bucket(f.revenue, [300, 700, 1500, 3000]),
        volume: bucket(f.now, [0, 14, 29, 59]),
        data: { product: f.p, ...f },
      });
    }
  }

  // ── Signal 3: product pairs (lift) ──
  const pc = cfg.pair;
  if (pc.enabled) {
    const win = retail.filter((o) => daysAgo(o.date) <= pc.params.windowDays);
    const N = win.length;
    const single = {};
    const pair = {};
    for (const o of win) {
      const ids = [...new Set(o.lines.map((l) => l.productId))].sort();
      ids.forEach((a) => { single[a] = (single[a] || 0) + 1; });
      for (let i = 0; i < ids.length; i += 1) for (let j = i + 1; j < ids.length; j += 1) {
        const k = `${ids[i]}|${ids[j]}`;
        pair[k] = (pair[k] || 0) + 1;
      }
    }
    const done = new Set(store.existingBundles.map((x) => [...x].sort().join('|')));
    const rules = [];
    for (const [k, both] of Object.entries(pair)) {
      if (done.has(k) || both < pc.params.minCoOrders) continue;
      const [a, b] = k.split('|');
      const lift = (both * N) / (single[a] * single[b]);
      if (lift < pc.params.minLift) continue;
      const [anchor, addon] = P[a].price >= P[b].price ? [a, b] : [b, a];
      rules.push({ anchor, addon, both, lift, conf: both / single[anchor] });
    }
    rules.sort((x, y) => y.lift * y.both - x.lift * x.both);
    for (const r of rules.slice(0, 3)) {
      const A = P[r.anchor];
      const B = P[r.addon];
      const full = A.price + B.price;
      const bundlePrice = Math.round(full * 0.9) - 0.05;
      const pairRevenue = r.both * full;
      opps.push({
        id: `pair-${r.anchor}-${r.addon}`,
        signal: 'pair',
        kind: 'bundle',
        category: 'Promotion',
        mergeKey: `bundle:${r.anchor}-${r.addon}`,
        topic: `product:${r.anchor}`,
        sources: ['orders'],
        output: 'bundle',
        title: `Bundle the ${A.name} with ${B.name}`,
        whyNow: `${r.both} orders contained both in the last ${pc.params.windowDays} days (lift ${r.lift.toFixed(1)}). ${pct(r.conf)} of ${A.name} buyers add it already.`,
        doThis: `Create a bundle at 10% off (${euro(bundlePrice)}, was ${euro(full)}) and feature it in Friday’s email.`,
        evidence: win.filter((o) => has(o, r.anchor) && has(o, r.addon)).slice(-4).map((o) => ({
          source: 'orders', date: o.date, who: `Order ${o.id}`, text: o.lines.map((l) => `${l.qty}× ${P[l.productId].name}`).join(' + '),
        })),
        metrics: [
          { label: `Co-orders (${pc.params.windowDays}d)`, value: r.both },
          { label: 'Lift', value: r.lift.toFixed(1) },
          { label: 'Attach rate', value: pct(r.conf) },
          { label: 'Bundle price', value: euro(bundlePrice) },
        ],
        impact: bucket(pairRevenue, [500, 1000, 2000, 3000]),
        volume: bucket(r.both, [0, 19, 39, 79]),
        data: { A, B, conf: r.conf, lift: r.lift, both: r.both, full, bundlePrice },
      });
    }
  }

  // ── Signal 7: overstock ──
  const oc = cfg.overstock;
  if (oc.enabled) {
    const kitsBySales = store.products.filter((p) => p.cat === 'kit').sort((a, b) => units(last28, b.id) - units(last28, a.id));
    for (const p of store.products) {
      if (p.stock == null) continue;
      const rate = units(last28, p.id) / 28;
      const cover = rate ? p.stock / rate : Infinity;
      if (cover <= oc.params.maxDaysCover) continue;
      const partner = fast.find((f) => f.p.cat === 'kit')?.p || kitsBySales[0];
      const value = p.stock * p.price;
      opps.push({
        id: `overstock-${p.id}`,
        signal: 'overstock',
        kind: 'overstock',
        category: 'Promotion',
        mergeKey: `overstock:${p.id}`,
        topic: `product:${p.id}`,
        sources: ['orders'],
        output: 'bundle',
        title: `${p.name}: ${Number.isFinite(cover) ? Math.round(cover) : '∞'} days of stock on the shelf`,
        whyNow: `${p.stock} units in stock (${euro(value)} at retail) selling ${(rate * 7).toFixed(1)} a week. That's ${Math.round(cover)} days of cover against a ${oc.params.maxDaysCover}-day limit.`,
        doThis: `Bundle it with ${partner.name}${fast.some((f) => f.p.id === partner.id) ? ', a current fast mover,' : ', your best seller,'} as a “starter” set rather than discounting it on its own.`,
        evidence: [{ source: 'orders', date: '2026-11-04', who: 'Inventory', text: `${p.stock} on hand · ${units(last28, p.id)} sold in 28 days · ${Math.round(cover)} days of cover` }],
        metrics: [{ label: 'Stock', value: p.stock }, { label: 'Days of cover', value: Math.round(cover) }, { label: 'Stock value', value: euro(value) }],
        impact: bucket(value, [500, 1500, 3000, 6000]),
        volume: 4,
        data: { product: p, partner, cover, rate, value },
      });
    }
  }

  // ── Signal 8: milestones ──
  const mc = cfg.milestone;
  if (mc.enabled) {
    const W = mc.params.windowDays;
    // Customer order-count milestones
    const count = {};
    const hits = [];
    for (const o of retail) {
      count[o.customer] = (count[o.customer] || 0) + 1;
      if ([10, 25, 50].includes(count[o.customer]) && daysAgo(o.date) <= W) hits.push({ customer: displayCustomer(o.customer), n: count[o.customer], order: o });
    }
    if (hits.length) {
      opps.push({
        id: 'milestone-customers',
        signal: 'milestone',
        kind: 'thank-you',
        category: 'Thank-you',
        mergeKey: 'milestone:customers',
        topic: 'loyalty',
        sources: ['orders'],
        output: 'note',
        title: hits.length === 1 ? `${hits[0].customer} just placed order no. ${hits[0].n}` : `${hits.length} customers reached an order milestone`,
        whyNow: 'A regular who feels noticed tells their friends. A handwritten card costs €1.',
        doThis: 'Handwrite a thank-you card for the next box and add a small extra, on the house.',
        evidence: hits.map((m) => ({ source: 'orders', date: m.order.date, who: m.customer, text: `Order no. ${m.n}: ${m.order.lines.map((l) => P[l.productId].name).join(' + ')}` })),
        metrics: [{ label: 'Customers', value: hits.length }],
        impact: 2,
        volume: 5,
        data: { milestones: hits },
      });
    }

    // Record day + unusually large orders
    const byDay = {};
    for (const o of orders) if (daysAgo(o.date) <= 90) byDay[o.date] = (byDay[o.date] || 0) + o.total;
    const [recordDay, recordRev] = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0];
    const recordIsRecent = daysAgo(recordDay) <= W;
    let recordUsed = false;
    for (const o of orders) {
      if (o.total < mc.params.largeOrderMultiple * aov || daysAgo(o.date) > W) continue;
      const qty = o.lines.reduce((s, l) => s + l.qty, 0);
      const isRecord = recordIsRecent && recordDay === o.date;
      recordUsed = recordUsed || isRecord;
      opps.push({
        id: `milestone-order-${o.id.replace('#', '')}`,
        signal: 'milestone',
        kind: 'pr-deal',
        category: 'PR',
        mergeKey: `deal:${norm(o.customer)}`,
        topic: 'corporate',
        sources: ['orders'],
        output: 'pr',
        title: `${o.customer}: ${qty} kits in one order${isRecord ? ', and a record day' : ''}`,
        whyNow: `${euro(o.total)} in one order, ${Math.round(o.total / aov)}× your average order value${isRecord ? `, making ${new Date(o.date).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })} your best day in 90 days (${euro(recordRev)})` : ''}.`,
        doThis: 'Tell the story: a short PR pitch to local business press, a LinkedIn post and a social post. Get the client’s OK first.',
        evidence: [{ source: 'orders', date: o.date, who: `Order ${o.id}`, text: `${qty}× ${P[o.lines[0].productId].name} · ${euro(o.total)}` }],
        metrics: [{ label: 'Order value', value: euro(o.total) }, { label: '× AOV', value: `${Math.round(o.total / aov)}×` }],
        impact: 5,
        volume: 5,
        data: { org: o.customer, qty, value: o.total, consent: false },
      });
    }
    if (recordIsRecent && !recordUsed) {
      opps.push({
        id: 'milestone-record-day', signal: 'milestone', kind: 'record-day', category: 'PR', mergeKey: 'milestone:record', topic: 'record',
        sources: ['orders'], output: 'social', title: `Record day: ${euro(recordRev)} on ${recordDay}`,
        whyNow: 'Your best sales day in 90 days.', doThis: 'Thank your customers publicly. A record is a reason to celebrate with them.',
        evidence: [{ source: 'orders', date: recordDay, who: 'Daily revenue', text: euro(recordRev) }], metrics: [], impact: 3, volume: 5, data: { recordDay, recordRev },
      });
    }
  }

  // ── Signal 10: lapsed customers (Phase 2) ──
  const lc = cfg.lapsed;
  if (lc.enabled) {
    const byCust = {};
    retail.forEach((o) => { (byCust[o.customer] = byCust[o.customer] || []).push(o.date); });
    const lapsed = [];
    for (const [c, dates] of Object.entries(byCust)) {
      if (dates.length < lc.params.minOrders) continue;
      const gaps = dates.slice(1).map((d, i) => (new Date(d) - new Date(dates[i])) / 864e5);
      const gap = median(gaps);
      const since = daysAgo(dates[dates.length - 1]);
      if (gap > 0 && since > lc.params.gapMultiple * gap && since >= 21) lapsed.push({ customer: displayCustomer(c), orders: dates.length, gap, since });
    }
    if (lapsed.length) {
      lapsed.sort((a, b) => b.orders - a.orders);
      opps.push({
        id: 'lapsed', signal: 'lapsed', kind: 'winback', category: 'Promotion', mergeKey: 'lapsed', topic: 'loyalty',
        sources: ['orders'], output: 'email',
        title: `${lapsed.length} regulars have gone quiet`,
        whyNow: `${lapsed.length} customers with ${lc.params.minOrders}+ orders haven’t ordered in over ${lc.params.gapMultiple}× their usual gap.`,
        doThis: 'Send a personal win-back email (Klaviyo segment) with a reason to come back, not just a discount.',
        evidence: lapsed.slice(0, 6).map((l) => ({ source: 'orders', date: '2026-11-04', who: l.customer, text: `${l.orders} orders · usually every ${Math.round(l.gap)} days · last order ${l.since} days ago` })),
        metrics: [{ label: 'Lapsed regulars', value: lapsed.length }],
        impact: bucket(lapsed.length * aov, [200, 500, 1000, 2000]),
        volume: bucket(lapsed.length, [0, 3, 8, 15]),
        data: { lapsed, aov },
      });
    }
  }

  return opps;
}
