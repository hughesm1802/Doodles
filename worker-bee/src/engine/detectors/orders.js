import { daysAgo, euro, pct, norm } from '../text.js';
import { displayCustomer } from '../../data/orders.js';

/**
 * Orders → bundles (market-basket analysis), rising products,
 * big orders (PR) and loyalty milestones (moments that matter).
 */
export function detectOrders(orders, business) {
  const opps = [];
  const products = Object.fromEntries(business.products.map((p) => [p.id, p]));
  const retail = orders.filter((o) => o.channel === 'online');
  const N = retail.length;

  // ── 1. Market basket: which pairs are bought together more than chance? ──
  const single = {};
  const pair = {};
  for (const o of retail) {
    const ids = [...new Set(o.lines.map((l) => l.productId))].sort();
    ids.forEach((a) => { single[a] = (single[a] || 0) + 1; });
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        const k = `${ids[i]}|${ids[j]}`;
        pair[k] = (pair[k] || 0) + 1;
      }
    }
  }
  const already = new Set(business.existingBundles.map((p) => [...p].sort().join('|')));
  const rules = [];
  for (const [k, both] of Object.entries(pair)) {
    if (already.has(k) || both < 12) continue;
    const [a, b] = k.split('|');
    const lift = (both * N) / (single[a] * single[b]);
    if (lift < 2) continue;
    // Direction: anchor on the main (higher-priced) product: "people who buy X also add Y"
    const [anchor, addon] = products[a].price >= products[b].price ? [a, b] : [b, a];
    const conf = both / single[anchor];
    if (conf < 0.4) continue;
    rules.push({ anchor, addon, both, conf, lift });
  }
  rules.sort((x, y) => y.lift * y.both - x.lift * x.both);
  for (const r of rules.slice(0, 3)) {
    const A = products[r.anchor];
    const B = products[r.addon];
    const full = A.price + B.price;
    const bundlePrice = Math.round(full * 0.9) - 0.05; // ~10% off, charm-priced
    const examples = retail.filter((o) => o.lines.some((l) => l.productId === r.anchor) && o.lines.some((l) => l.productId === r.addon)).slice(-4);
    opps.push({
      id: `bundle-${r.anchor}-${r.addon}`,
      kind: 'bundle',
      category: 'Promotion',
      topic: `bundle:${r.anchor}`,
      sources: ['orders'],
      title: `Bundle it: ${A.name} + ${B.name}`,
      insight: `${pct(r.conf)} of ${A.name} buyers also add ${B.name} · ${r.lift.toFixed(1)}× more than chance`,
      why: `Customers are already building this combo themselves (${r.both} orders). A named bundle at a small saving makes it the default choice, lifts average order value and gives you something new to post about.`,
      evidence: examples.map((o) => ({
        source: 'orders', date: o.date, who: `Order ${o.id}`,
        text: o.lines.map((l) => `${l.qty}× ${products[l.productId].name}`).join(' + '),
      })),
      metrics: [
        { label: 'Orders with both', value: r.both },
        { label: 'Attach rate', value: pct(r.conf) },
        { label: 'Lift', value: `${r.lift.toFixed(1)}×` },
        { label: 'Suggested price', value: `${euro(bundlePrice)} (was ${euro(full)})` },
      ],
      impact: 3 + (r.lift > 3 ? 1 : 0),
      confidence: Math.min(1, 0.4 + r.both / 100),
      urgency: 0.5,
      effort: 'Low',
      data: { A, B, conf: r.conf, lift: r.lift, both: r.both, full, bundlePrice },
    });
  }

  // ── 2. Rising products: share of orders, last 4 weeks vs the 8 before ──
  const recent = retail.filter((o) => daysAgo(o.date) <= 28);
  const prior = retail.filter((o) => daysAgo(o.date) > 28 && daysAgo(o.date) <= 84);
  for (const p of business.products) {
    const r = recent.filter((o) => o.lines.some((l) => l.productId === p.id)).length;
    const q = prior.filter((o) => o.lines.some((l) => l.productId === p.id)).length;
    if (r < 15 || !q) continue;
    const rShare = r / recent.length;
    const qShare = q / prior.length;
    const growth = rShare / qShare - 1;
    if (growth < 0.5) continue;
    const topicId = business.topics.find((t) => t.keywords.some((k) => norm(p.name).includes(norm(k))))?.id;
    opps.push({
      id: `rising-${p.id}`,
      kind: 'rising-product',
      category: 'Promotion',
      topic: topicId || `product:${p.id}`,
      sources: ['orders'],
      title: `${p.name} is quietly taking off`,
      insight: `In ${pct(rShare)} of orders over the last 4 weeks, up from ${pct(qShare)} (+${pct(growth)})`,
      why: `Demand is growing without you promoting it. Give it the spotlight before a competitor does: feature it, create content around it, and think about whether it deserves its own product.`,
      evidence: [
        { source: 'orders', date: '2026-11-04', who: 'Last 4 weeks', text: `${r} of ${recent.length} orders included ${p.name}` },
        { source: 'orders', date: '2026-10-07', who: 'Previous 8 weeks', text: `${q} of ${prior.length} orders included ${p.name}` },
      ],
      metrics: [
        { label: 'Share now', value: pct(rShare) },
        { label: 'Share before', value: pct(qShare) },
        { label: 'Growth', value: `+${pct(growth)}` },
      ],
      impact: 4,
      confidence: Math.min(1, 0.4 + r / 60),
      urgency: 0.7,
      effort: 'Low',
      data: { product: p, rShare, qShare, growth, r, q },
    });
  }

  // ── 3. Big orders in the last 3 weeks → PR ──
  for (const o of orders) {
    if (o.total < 1000 || daysAgo(o.date) > 21) continue;
    const qty = o.lines.reduce((s, l) => s + l.qty, 0);
    opps.push({
      id: `bigorder-${o.id}`,
      kind: 'pr-deal',
      category: 'PR',
      topic: `deal:${norm(o.customer)}`,
      sources: ['orders'],
      title: `Record order: ${o.customer}`,
      insight: `${qty} units · ${euro(o.total)} · largest order in 12 weeks`,
      insightShort: 'largest order in 12 weeks',
      why: 'Big orders are proof. Prospective corporate clients want to know that other companies trust you.',
      evidence: [{ source: 'orders', date: o.date, who: `Order ${o.id}`, text: `${qty}× ${products[o.lines[0].productId].name}, ${euro(o.total)}` }],
      metrics: [{ label: 'Order value', value: euro(o.total) }],
      impact: 5,
      confidence: 0.6,
      urgency: Math.max(0, 1 - daysAgo(o.date) / 21),
      effort: 'Medium',
      data: { org: o.customer, qty, value: o.total },
    });
  }

  // ── 4. Loyalty milestones reached in the last 7 days ──
  const count = {};
  const milestones = [];
  for (const o of retail) {
    count[o.customer] = (count[o.customer] || 0) + 1;
    if ([10, 25, 50].includes(count[o.customer]) && daysAgo(o.date) <= 7) {
      milestones.push({ customer: displayCustomer(o.customer), n: count[o.customer], order: o });
    }
  }
  if (milestones.length) {
    opps.push({
      id: 'moment-loyal',
      kind: 'moment-loyal',
      category: 'Moments',
      topic: 'loyalty',
      sources: ['orders'],
      title: milestones.length === 1
        ? `${milestones[0].customer} just placed order number ${milestones[0].n}`
        : `${milestones.length} regulars hit a loyalty milestone this week`,
      insight: 'A handwritten note costs €1 and will be remembered for years',
      why: 'This is real marketing: a regular who feels noticed tells ten friends. No algorithm required.',
      evidence: milestones.map((m) => ({
        source: 'orders', date: m.order.date, who: m.customer,
        text: `Order no. ${m.n}: ${m.order.lines.map((l) => products[l.productId].name).join(' + ')}`,
      })),
      metrics: [{ label: 'Customers', value: milestones.length }],
      impact: 3,
      confidence: 1,
      urgency: 0.9,
      effort: 'Low',
      data: { milestones },
    });
  }

  return opps;
}
