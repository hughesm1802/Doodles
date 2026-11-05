// ─────────────────────────────────────────────────────────────
// Drafts. The prototype fills deterministic templates from the evidence
// and brand profile so it runs offline. In the pilot, buildPrompt()
// is sent to the Claude API (with personal data stripped) and these
// templates act as the structure. Every draft is suggest-only.
// ─────────────────────────────────────────────────────────────
import { euro, pct, fmtDate } from './text.js';

export const CHANNELS = {
  blog: { label: 'Blog article', spec: 'Shopify article, unpublished · meta title ≤ 60 · meta description ≤ 155 · FAQPage schema', minutes: 90 },
  product: { label: 'Product page copy', spec: 'Short answer block under Add to cart · plain language', minutes: 15 },
  email: { label: 'Email block', spec: 'Subject ≤ 50 · preview ≤ 90 · one CTA (Klaviyo draft in Phase 2)', minutes: 30 },
  instagram: { label: 'Instagram', spec: 'Copy + image spec · 4:5 portrait 1080×1350 · caption ≤ 2,200 · 3–5 hashtags', minutes: 20 },
  reel: { label: 'Reel · TikTok', spec: '9:16 vertical 1080×1920 · 15–45s · text clear of top 250px & bottom 400px', minutes: 45 },
  ads: { label: 'Ad angle', spec: 'Google RSA: headlines ≤ 30, descriptions ≤ 90 · Meta primary text ≤ 125 visible', minutes: 30 },
  linkedin: { label: 'LinkedIn', spec: '≤ 3,000 chars · hook in the first 210 · 1:1 1080×1080 image', minutes: 25 },
  press: { label: 'PR pitch', spec: 'Headline · 3 short paragraphs · quote · boilerplate', minutes: 60 },
  shopify: { label: 'Bundle setup notes', spec: 'Step by step for Shopify admin', minutes: 15 },
  web: { label: 'Page changes', spec: 'Title tag ≤ 60 · meta ≤ 155 · on-page changes', minutes: 30 },
  banner: { label: 'Store banner', spec: 'Announcement bar ≤ 70 chars', minutes: 5 },
  reply: { label: 'Saved inbox reply', spec: 'For the next customer who asks', minutes: 10 },
  note: { label: 'Thank-you card', spec: 'Handwritten · private, never posted', minutes: 5 },
  ops: { label: 'Private ops note', spec: 'For the owner only · never marketing copy', minutes: 15 },
  checklist: { label: 'Checklist', spec: 'Steps for you or the team', minutes: 5 },
};

export const PUBLIC_CHANNELS = ['blog', 'email', 'instagram', 'reel', 'ads', 'linkedin', 'press'];

const TONES = {
  warm: { open: 'Right so,', cta: 'Grab yours', thanks: 'Thanks a million', adj: 'gorgeous' },
  straight: { open: 'Quick update:', cta: 'Order now', thanks: 'Thank you', adj: 'great' },
  premium: { open: 'From our kitchen:', cta: 'Discover it', thanks: 'Thank you sincerely', adj: 'exceptional' },
};

function voice(brand) {
  const t = TONES[brand.tone] || TONES.warm;
  return { ...t, e: (s) => (brand.emoji ? ` ${s}` : ''), tags: (...x) => [...brand.hashtags.slice(0, 4), ...x].join(' '), sign: brand.signOff };
}

const d = (channel, fields) => ({ channel, ...CHANNELS[channel], fields });
const f = (label, text, limit, mono = false) => ({ label, text, limit, mono });
const trim = (s, n) => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const q = (s) => `“${s.replace(/^["“]|["”]$/g, '')}”`;
const short = (name) => name.replace(/ \(.*\)/, '').replace(/ \d+\w*$/, '');

// ── Builders per opportunity kind ─────────────────────────────

function content(o, brand, store) {
  const v = voice(brand);
  const t = o.data.topic;
  const faqs = t.faqs.length ? t.faqs : [{ q: `${t.label}: what you need to know`, a: '[Answer from the owner]' }];
  const qs = (o.data.questions || []).slice(0, 4);
  const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })) };
  const searches = (o.data.queries || []).map((r) => `• “${r.query}”: ${r.impressions.toLocaleString('en-IE')} impressions, position ${r.position}`).join('\n');
  return [
    d('blog', [
      f('H1', t.headline),
      f('URL', `/blogs/guides/${slug(t.headline)}`),
      f('Meta title', trim(`${t.headline.split(':')[0].split('?')[0]}${t.headline.includes('?') ? '?' : ''} | ${store.name}`, 60), 60),
      f('Meta description', trim(`${faqs[0].q} ${faqs[0].a}`, 155), 155),
      ...(searches ? [f('Target searches (GSC, 28 days)', searches)] : []),
      f('Outline', [
        'Intro: “We get asked this every week, so here’s everything in one place.”',
        ...faqs.map((x) => `H2: ${x.q}`),
        ...qs.map((x) => `H3, in the customer’s words: ${x}`),
        'CTA: link to the relevant product',
      ].join('\n')),
      f('FAQPage schema (JSON-LD)', JSON.stringify(schema, null, 2), null, true),
    ]),
    d('product', [f('Answer block', faqs.map((x) => `${x.q}\n${x.a}`).join('\n\n'))]),
    d('instagram', [
      f('Carousel', [`Slide 1: ${t.label}: your top questions${v.e('🍕')}`, ...faqs.map((x, i) => `Slide ${i + 2}: ${x.q}\n→ ${x.a}`), `Slide ${faqs.length + 2}: Save this for pizza night`].join('\n\n')),
      f('Caption', `${v.open} the questions we get asked most about ${t.label.toLowerCase()}, all in one place. Save it for your next pizza night${v.e('📌')}\n\n${v.sign}\n\n${v.tags()}`, 2200),
      f('Image spec', '4:5 portrait, 1080×1350. Brand-colour background, question in large type, small product shot bottom right.'),
    ]),
    d('reel', [
      f('Hook (0–3s)', `${faqs[0].q} We get this question every single week.`),
      f('Shot list', `1. Hands holding the kit to camera (2s)\n2. ${trim(faqs[0].a, 110)} (8s)\n3. ${faqs[1] ? trim(faqs[1].a, 90) : 'Finished pizza out of the oven'} (8s)\n4. End card with logo (3s)`),
      f('Caption', `${faqs[0].q} You asked, we answered. Full guide: link in bio. ${v.tags()}`, 2200),
    ]),
    d('reply', [f('Reply', `Hi [Name],\n\n${v.thanks} for getting in touch! ${faqs[0].a}\n\nThere’s more detail in our guide: [article link]\n\n${v.sign}`)]),
  ];
}

function seoPage(o, brand, store) {
  return [d('web', o.data.queries.map((r) => f(`“${r.query}” · position ${r.position} · ${r.impressions} impr.`,
    `Title tag: ${trim(`${r.query.replace(/\b\w/g, (c) => c.toUpperCase())} | ${store.name}`, 60)}\nMeta: ${trim(`Looking for ${r.query}? Made in ${store.location.split(',')[0]}, delivered across Ireland. See what's in the kit.`, 155)}\nOn page: add an H2 using the exact phrase, a 3-question FAQ block, and links from 2 related blog posts.`)))];
}

function bundle(o, brand, store) {
  const v = voice(brand);
  const { A, B, conf, bundlePrice, full } = o.data;
  const name = `${short(A.name).replace(/ Kit$/, '')} + ${short(B.name)} Bundle`;
  return [
    d('shopify', [
      f('Steps', `1. Products → Add product: “${name}”\n2. Price ${euro(bundlePrice)}, compare-at ${euro(full)}\n3. Inventory: track the components (use a bundles app or Shopify Bundles)\n4. Add to collections: Bundles, Gift ideas\n5. On the ${A.name} page add a “Make it a bundle” block\n6. Tag: bundle, worker-bee (so we can measure it)`),
    ]),
    d('product', [f('Product description', `The combo our customers already love: ${pct(conf)} of people who order the ${A.name} add ${B.name}. Now together, for ${euro(full - bundlePrice)} less.`)]),
    d('email', [
      f('Subject', trim('You’ve been ordering this combo all along', 50), 50),
      f('Preview text', trim(`So we made it a bundle, and you save ${euro(full - bundlePrice)}.`, 90), 90),
      f('Block', `Most people who order the ${A.name} also add ${B.name}. So we made it official: the ${name}, ${euro(bundlePrice)} (usually ${euro(full)}).\n\n[${v.cta}]`),
    ]),
    d('instagram', [
      f('Caption', `You figured this one out before we did${v.e('😄')} Most of you ordering the ${A.name} add ${B.name}, so it’s now a bundle: ${euro(bundlePrice)}. Link in bio.\n\n${v.tags('#Bundle')}`, 2200),
      f('Image spec', 'Overhead flat-lay of both products on a wooden board, 4:5, bundle price sticker top left.'),
    ]),
  ];
}

function fastMover(o, brand) {
  const v = voice(brand);
  const p = o.data.product;
  const gf = o.topic === 'glutenfree';
  return [
    d('email', [
      f('Subject', trim(gf ? 'Gluten-free? Every kit, no compromise' : `Everyone’s ordering the ${short(p.name)}`, 50), 50),
      f('Preview text', trim(gf ? 'Add a certified GF base to any kit.' : `Up ${Math.round(o.data.growth)}% this month. Here’s why.`, 90), 90),
      f('Block', gf
        ? 'More of you than ever are choosing our gluten-free base. It’s certified gluten-free, packed separately, and works with every kit.\n\n[Add it to your kit]'
        : `The ${p.name} is having a moment: ${o.data.now} sold in the last four weeks. [${v.cta}]`),
    ]),
    d('instagram', [
      f('Caption', gf
        ? `Gluten-free doesn’t mean second best${v.e('🙌')} Add our certified GF base to any kit at checkout.\n\n${v.tags('#GlutenFreeIreland', '#CoeliacIreland')}`
        : `Our fastest mover this month: the ${p.name}${v.e('👀')} ${v.cta}, link in bio.\n\n${v.tags()}`, 2200),
      f('Image spec', gf ? 'Side-by-side: regular vs gluten-free pizza, 4:5. Overlay: “Can you tell which is which?”' : `Hero shot of the ${p.name}, 4:5, natural light.`),
    ]),
    d('reel', [
      f('Hook (0–3s)', gf ? 'Can you tell which one is gluten-free?' : `Why everyone’s ordering the ${short(p.name)}…`),
      f('Shot list', '1. Product close-up (3s)\n2. Making it (8s)\n3. Result / taste reaction (4s)\n4. End card'),
      f('Caption', `${short(p.name)}. ${v.cta}. ${v.tags()}`, 2200),
    ]),
  ];
}

function overstock(o, brand) {
  const v = voice(brand);
  const { product: p, partner } = o.data;
  const full = p.price + partner.price;
  const price = Math.round(full * 0.88) - 0.05;
  const name = `${short(partner.name).replace(/ Kit$/, '')} Starter Set`;
  return [
    d('shopify', [f('Steps', `1. New bundle product: “${name}” (${partner.name} + ${p.name})\n2. Price ${euro(price)}, compare-at ${euro(full)}\n3. Feature in the Gift ideas collection\n4. Tag: bundle, overstock, worker-bee\n5. Review stock cover again in 28 days`)]),
    d('email', [
      f('Subject', trim(`New: the ${name}`, 50), 50),
      f('Preview text', trim(`Everything you need for proper pizza at home, ${euro(full - price)} off.`, 90), 90),
      f('Block', `Our ${partner.name} plus a ${p.name} for launching pizzas like a pro. ${euro(price)}, save ${euro(full - price)}.\n\n[${v.cta}]`),
    ]),
    d('instagram', [
      f('Caption', `The ${name} has landed${v.e('🍕')} ${partner.name} + ${p.name}, ${euro(price)}. A great gift for the pizza person in your life.\n\n${v.tags('#GiftIdeas')}`, 2200),
      f('Image spec', `${p.name} with a finished pizza on it, 4:5, warm light.`),
    ]),
  ];
}

function prDeal(o, brand, store) {
  const v = voice(brand);
  const { org, qty, consent } = o.data;
  return [
    d('press', [
      f('Permission check', consent ? `✓ ${org} said you can share it (see their email). Send them this draft before it goes out.` : `⚠ Ask ${org} for permission before naming them anywhere.`),
      f('Headline', `Cork online store ${store.name} ships ${qty} pizza kits for one company all-hands`),
      f('Release', `${store.location.split(',')[0]}, ${fmtDate('2026-11-05')} 2026. ${store.name}, an independent online pizza-kit business, has shipped its largest single order: ${qty} Team Pizza Night Boxes for ${org}, with the whole company making pizza together on one video call.\n\n“${store.stances.corporate}” said ${store.owner}, founder.\n\n${org} has already asked about repeating it at Christmas.\n\nAbout ${store.name}: ${store.type}.`),
      f('Pitch email', `Subject: ${qty} people, one video call: a Cork small-business story\n\nHi [Journalist],\n\nWe just shipped our biggest order yet: ${qty} pizza kits for ${org}'s all-hands. It's a small example of how companies are rethinking Christmas parties. Photos, numbers and a quote are available.\n\n${store.owner}, ${store.name}`),
    ]),
    d('linkedin', [f('Post', `Last Friday, ${qty} people at ${org} made pizza together on one video call.\n\nOur biggest order ever, and the most fun we’ve had packing boxes.\n\nWhat we’re learning: teams want something everyone can join, wherever they work.\n\nThank you ${org} for trusting a small Cork business.\n\n${v.tags('#TeamBuilding')}`, 3000)]),
    d('instagram', [
      f('Caption', `${qty} people. One video call. A LOT of pizza${v.e('🍕')} Huge thanks to ${org}! Planning a team Christmas? DM us.\n\n${v.tags('#TeamPizzaNight')}`, 2200),
      f('Image spec', `Slide 1: ${org}'s photo (with permission). Slide 2: ${qty} boxes stacked on packing day. 4:5.`),
    ]),
  ];
}

function recordDay(o, brand) {
  const v = voice(brand);
  return [d('instagram', [f('Caption', `Yesterday was our biggest day ever${v.e('🎉')} ${v.thanks} to every one of you who ordered. We couldn’t do this without you.\n\n${v.sign}`, 2200), f('Image spec', 'Team packing photo, 4:5, candid.')])];
}

function thankYou(o, brand, store) {
  return [
    d('note', o.data.milestones.map((m) => f(`${m.customer} · order no. ${m.n}`, `Dear ${m.customer.split(' ')[0]},\n\nThat's order number ${m.n}! It genuinely makes our week to see your name come in. There's a little something extra in this box, on us.\n\nThank you,\n${store.owner} & the team`))),
    d('checklist', [f('To do', '☐ Handwrite the card and pack it with the next order\n☐ Add a free Cookie Dough Tub\n☐ Tag the customer “VIP” in Shopify')]),
  ];
}

const FIXES = {
  delivery: ['Check late deliveries by dispatch day: are they all Thursday dispatches for Friday?', 'Move the Friday-delivery cut-off to Wednesday 2pm', 'Turn on courier SMS tracking', 'Agree a policy for late kits (e.g. refund delivery automatically)'],
  packaging: ['Price compostable tubs for sauces and toppings', 'Consider a tub take-back scheme', 'Add a “what’s recyclable” line to the instruction card', 'Once changed, it becomes a positive story. Until then, no marketing copy'],
};

function reviewOps(o) {
  const { aspect, label, mentions } = o.data;
  return [d('ops', [
    f('What customers are saying', mentions.map((m) => `• ${q(m.quote)} (${fmtDate(m.review.date)}, ${m.review.rating}★)`).join('\n')),
    f('Fix checklist', (FIXES[aspect] || ['Find the root cause with the team', 'Agree one change this week']).map((x) => `☐ ${x}`).join('\n')),
    f('What I’ll watch', `New reviews mentioning ${label.toLowerCase()} over the next 60 days. I’ll tell you when it drops below the trigger level.`),
  ])];
}

const HEADLINE = { dough: 'The Crust Everyone Talks About', instructions: 'So Easy The Kids Can Do It' };

function reviewProof(o, brand) {
  const v = voice(brand);
  const { label, mentions } = o.data;
  const top = mentions.slice(-4);
  return [
    d('instagram', [
      f('Carousel', [`Slide 1: Don't take our word for it${v.e('⭐')}`, ...top.map((m, i) => `Slide ${i + 2}: ${q(m.quote)}`)].join('\n\n')),
      f('Caption', `Our customers say it better than we could. ${v.thanks} to everyone who left a review${v.e('🙏')}\n\n${v.tags()}`, 2200),
      f('Image spec', 'One review per slide, large type, 5 stars above, 4:5.'),
    ]),
    d('ads', [
      f('Angle', `Lead with ${label.toLowerCase()}. It’s what customers mention unprompted.`),
      f('Google headlines', [HEADLINE[o.data.aspect] || 'Loved By Our Customers', 'Pizzeria Pizza At Home', '5★ Pizza Kits, Delivered', 'Order By Wed For Friday'].map((h) => trim(h, 30)).join('\n')),
      f('Google descriptions', trim(`“${top[top.length - 1].quote.split('.')[0]}.” Real reviews from real pizza nights. Kits delivered nationwide.`, 90), 90),
      f('Meta primary text', trim(`${q(top[0].quote)} Pizza night, sorted.`, 125), 125),
    ]),
  ];
}

function opinion(o, brand) {
  const v = voice(brand);
  const { article, stance } = o.data;
  return [
    d('linkedin', [f('Post', `${article.title}.\n\n${stance}\n\nFrom inside a small Irish online food business:\n→ [one specific example]\n→ [what we’re doing about it]\n\nWhat do you think?\n\n${v.tags()}`, 3000)]),
    d('email', [f('Newsletter angle', `Open this week’s email with your take: “${stance}” Then link to the product most connected to the story.`)]),
  ];
}

function winback(o, brand, store) {
  const v = voice(brand);
  return [d('email', [
    f('Segment', `Customers with 3+ orders, no order in more than 2× their usual gap (${o.data.lapsed.length} people). Klaviyo segment in Phase 2.`),
    f('Subject', trim('We’ve missed you at pizza night', 50), 50),
    f('Preview text', trim('Here’s what’s new since your last kit.', 90), 90),
    f('Body', `Hi [First name],\n\nIt’s been a while since your last kit, and we’ve been busy: [new kit or bundle]. Your next order ships free with code [CODE].\n\n[${v.cta}]\n\n${v.sign}`),
  ])];
}

function seasonal(o, brand, store) {
  const v = voice(brand);
  const { event, date } = o.data;
  if (event.id === 'xmas-cutoff') {
    return [
      d('banner', [f('Announcement bar', trim(`Order by ${fmtDate(date)} for Christmas delivery${v.e('🎄')}`, 70), 70)]),
      d('email', [
        f('Subject', trim(`Christmas delivery: order by ${fmtDate(date)}`, 50), 50),
        f('Preview text', trim('Kits, gift boxes and team nights, delivered in time.', 90), 90),
        f('Block', `Our last day for Christmas delivery is ${fmtDate(date)}. Team Pizza Night Boxes ship to each person’s home on one invoice.\n\n[Shop Christmas]`),
      ]),
      d('instagram', [f('Caption', `Mark the date: ${fmtDate(date)} is the last day to order for Christmas delivery${v.e('🎁')}\n\n${v.tags('#ChristmasIreland')}`, 2200), f('Image spec', 'Kit wrapped in brown paper and twine, date in large type, 4:5.')]),
    ];
  }
  return [
    d('email', [
      f('Subject', trim(`${event.name}: [your offer]`, 50), 50),
      f('Preview text', trim('[One-line offer summary]', 90), 90),
      f('Block', `${event.angle}\n\nSuggested offer: lead with a bundle rather than a sitewide discount. [Pick from your active bundle opportunities]\n\n[${v.cta}]`),
    ]),
    d('instagram', [f('Caption', `${event.name} is coming${v.e('👀')} [Teaser]. ${v.tags()}`, 2200), f('Image spec', 'Teaser graphic, 4:5, date prominent.')]),
    d('checklist', [f('Launch checklist', `☐ Decide the offer by ${fmtDate(new Date(new Date(date) - 10 * 864e5))}\n☐ Check stock on the featured products\n☐ Schedule the email for launch morning`)]),
  ];
}

const BUILDERS = {
  content, 'seo-page': seoPage, bundle, 'fast-mover': fastMover, overstock, 'pr-deal': prDeal, 'record-day': recordDay,
  'thank-you': thankYou, 'review-ops': reviewOps, 'review-proof': reviewProof, opinion, winback, seasonal,
};

export function buildDrafts(opp, brand, store) {
  const all = (BUILDERS[opp.kind] || (() => []))(opp, brand, store);
  return all.filter((x) => !PUBLIC_CHANNELS.includes(x.channel) || brand.channels[x.channel] !== false);
}

export const draftMinutes = (drafts) => drafts.reduce((s, x) => s + (x.minutes || 0), 0);

export function brandCheck(text, avoid) {
  const t = text.toLowerCase();
  return avoid.filter((w) => w && t.includes(w.toLowerCase()));
}

// ── Prompt for the Claude API, with personal data stripped ──

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/g;

/** Replace people's names with stable placeholders; keep company names (B2B clients). */
export function pseudonymise(evidence) {
  const names = new Map();
  const alias = (name) => {
    if (!names.has(name)) names.set(name, `Customer ${String.fromCharCode(65 + names.size)}`);
    return names.get(name);
  };
  return evidence.map((e) => {
    let who = e.who;
    if (['inbox', 'reviews'].includes(e.source) || (e.source === 'orders' && !/^Order|^Last|^Previous|^Inventory|^Daily/.test(e.who))) {
      const [person, ...rest] = e.who.split(/(?=,| ·)/);
      who = alias(person.trim()) + rest.join('');
    }
    let text = e.text.replace(EMAIL_RE, '[email]');
    names.forEach((a, n) => { text = text.split(n).join(a); });
    return { ...e, who, text };
  });
}

export function buildPrompt(opp, brand, store) {
  const ev = pseudonymise(opp.evidence.slice(0, 8)).map((e) => `- [${e.source} · ${e.date} · ${e.who}] ${e.text.replace(EMAIL_RE, '[email]')}`).join('\n');
  return `<role>
You draft marketing for ${store.name}, ${store.type.toLowerCase()} (${store.location}).
Audience: ${store.audience}.
You suggest; the owner approves. Nothing you write is published automatically.
</role>

<brand_voice>
Tone: ${brand.tone}. Emoji: ${brand.emoji ? 'sparingly' : 'none'}. Sign-off: "${brand.signOff}".
Never say: ${brand.avoid.join('; ')}. Irish English spelling.
</brand_voice>

<opportunity signal="${opp.signals.join('+')}" ice="${opp.ice}" output="${opp.output}">
${opp.title}
Why now: ${opp.whyNow}
Do this: ${opp.doThis}
</opportunity>

<evidence note="customer names and emails removed">
${ev}
</evidence>

<task>
Draft: ${[...new Set(buildDrafts(opp, brand, store).map((x) => CHANNELS[x.channel].label))].join(', ')}.
Respect each format's limits. Use customers' own words where possible.
Never invent facts, prices or quotes; leave anything the owner must decide in [brackets].
If a person or company is named, add a permission check.
</task>`;
}
