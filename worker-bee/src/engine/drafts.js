// ─────────────────────────────────────────────────────────────
// Draft generation. In the prototype these are deterministic templates
// filled with the opportunity's evidence and the brand profile, so the
// demo works offline. In production, the same inputs go to an LLM via
// buildPrompt() below, and these templates become the fallback/structure.
// ─────────────────────────────────────────────────────────────
import { euro, pct, fmtDate } from './text.js';

export const CHANNELS = {
  blog: { label: 'Blog / FAQ page', spec: 'Meta title ≤ 60 · meta description ≤ 155 · FAQPage schema', minutes: 90 },
  reel: { label: 'Reel · TikTok · Short', spec: '9:16 vertical · 1080×1920 · 15–45s · keep text clear of top 250px & bottom 400px', minutes: 45 },
  instagram: { label: 'Instagram post', spec: '4:5 portrait · 1080×1350 · caption ≤ 2,200 · 3–5 hashtags', minutes: 20 },
  email: { label: 'Email', spec: 'Subject ≤ 50 · preview ≤ 90 · one clear CTA', minutes: 30 },
  gbp: { label: 'Google Business post', spec: '≤ 1,500 chars (first ~100 visible) · 4:3 image 1200×900 · CTA button', minutes: 10 },
  linkedin: { label: 'LinkedIn post', spec: '≤ 3,000 chars · hook in first 210 · 1:1 1080×1080 or 1.91:1 1200×627', minutes: 25 },
  press: { label: 'Press / media', spec: 'Headline · 3 short paragraphs · quote · boilerplate · contact', minutes: 60 },
  shopify: { label: 'Shopify setup', spec: 'Product · price · compare-at · tags · collection', minutes: 15 },
  web: { label: 'Website update', spec: 'Title tag ≤ 60 · meta ≤ 155 · on-page changes', minutes: 30 },
  reply: { label: 'Replies', spec: 'Reply within 48h · thank · own it · fix · invite back', minutes: 20 },
  note: { label: 'Personal note', spec: 'Handwritten card or personal email · private, never posted', minutes: 5 },
  internal: { label: 'Team action', spec: 'Internal · for you and the team, not customers', minutes: 15 },
};

const TONES = {
  warm: { open: 'Right so,', cta: 'Grab yours', thanks: 'Thanks a million', close: 'Hope to see you again soon!', adj: 'gorgeous' },
  straight: { open: 'Quick update:', cta: 'Order now', thanks: 'Thank you', close: 'Thanks again for ordering.', adj: 'great' },
  premium: { open: 'From our kitchen:', cta: 'Discover it', thanks: 'Thank you sincerely', close: 'We look forward to welcoming you back.', adj: 'exceptional' },
};

function voice(brand) {
  const t = TONES[brand.tone] || TONES.warm;
  return {
    ...t,
    e: (s) => (brand.emoji ? ` ${s}` : ''),
    tags: (...extra) => [...brand.hashtags.slice(0, 4), ...extra].join(' '),
    sign: brand.signOff,
  };
}

const d = (channel, fields, extra = {}) => ({ channel, ...CHANNELS[channel], fields, ...extra });
const f = (label, text, limit, mono = false) => ({ label, text, limit, mono });
const trim = (s, n) => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const quote = (s) => `“${s.replace(/^["“]|["”]$/g, '')}”`;

// ── Builders per opportunity kind ─────────────────────────────

function faqContent(o, brand, biz) {
  const v = voice(brand);
  const t = o.data.topic;
  const kw = o.data.primaryKeyword || t.label.toLowerCase();
  const qs = (o.data.questions || []).slice(0, 6);
  const faqs = t.faqs.length ? t.faqs : [{ q: `${t.label}: what you need to know`, a: '[Answer from your team]' }];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
  };
  const searchLines = (o.data.queries || []).slice(0, 4).map((q) => `• “${q.query}” (${q.impressions.toLocaleString('en-IE')} searches, position ${q.position})`).join('\n');
  return [
    d('blog', [
      f('H1', t.headline),
      f('URL', `/${slug(t.headline)}`),
      f('Meta title', trim(`${t.headline.split(':')[0].split('?')[0]}${t.headline.includes('?') ? '?' : ''} | ${biz.name}`, 60), 60),
      f('Meta description', trim(`${faqs[0].q} ${faqs[0].a}`, 155), 155),
      f('Target searches', searchLines || `• ${kw}`),
      f('Outline (from real customer questions)', [
        `Intro: “We get asked this every week, so here's everything in one place.”`,
        ...faqs.map((x) => `H2: ${x.q}`),
        ...qs.slice(0, 3).map((q) => `H3 (customer's own words): ${q}`),
        'Short how-to video embed (reuse the Reel below)',
        `CTA: shop the kits (internal link to /shop)`,
      ].join('\n')),
      f('FAQPage schema (JSON-LD)', JSON.stringify(schema, null, 2), null, true),
    ]),
    d('reel', [
      f('Hook (0–3s)', `${faqs[0].q} We get this question every single week.`),
      f('Shot list', [
        '1. Close-up: hands holding the kit box to camera (2s)',
        `2. Answer on screen while showing it: ${trim(faqs[0].a, 120)} (8s)`,
        faqs[1] ? `3. Second tip: ${trim(faqs[1].a, 100)} (8s)` : '3. Show the finished pizza coming out of the oven (5s)',
        '4. Slow-mo cheese pull, end card with logo (4s)',
      ].join('\n')),
      f('On-screen text', faqs.map((x) => x.q).join(' → ')),
      f('Caption', `${faqs[0].q} You asked, we answered${v.e('👇')}\n\nFull guide on our blog (link in bio).\n\n${v.tags('#PizzaTips')}`, 2200),
      f('Export', 'One 9:16 edit → Instagram Reels, TikTok and YouTube Shorts. Cover frame 1080×1920; keep the title in the centre 1080×1350 so it crops cleanly to the grid.'),
    ]),
    d('instagram', [
      f('Carousel slides', [`Slide 1: ${t.label}: your top questions, answered${v.e('🍕')}`, ...faqs.map((x, i) => `Slide ${i + 2}: ${x.q}\n→ ${x.a}`), `Slide ${faqs.length + 2}: Save this for pizza night`].join('\n\n')),
      f('Caption', `${v.open} the questions we get asked most about ${t.label.toLowerCase()}, all in one place. Save it for your next pizza night${v.e('📌')}\n\n${v.sign}\n\n${v.tags()}`, 2200),
    ]),
    d('gbp', [
      f('Post', trim(`${faqs[0].q} ${faqs[0].a} Read our full guide on the website.`, 1500), 1500),
      f('Button', 'Learn more → blog URL'),
    ]),
    d('reply', [
      f('Saved reply for your inbox', `Hi [Name],\n\n${v.thanks} for getting in touch! ${faqs[0].a}\n\nWe've put all the details in a short guide: [blog link]\n\n${v.sign}`),
    ], { label: 'Saved inbox reply', minutes: 10 }),
  ];
}

function bundle(o, brand, biz) {
  const v = voice(brand);
  const { A, B, conf, bundlePrice, full } = o.data;
  const name = `${A.name.replace(/ \(.*\)/, '').replace(/ Kit$/, '')} + ${B.name.replace(/ \d+\w*$/, '').replace(/ \(.*\)/, '')} Bundle`;
  return [
    d('shopify', [
      f('Product title', name),
      f('Price', `${euro(bundlePrice)} (compare-at ${euro(full)}, save ${euro(full - bundlePrice)})`),
      f('Description', `The combo our customers already love: ${pct(conf)} of people who order the ${A.name} add ${B.name}. Now together, for less.`),
      f('Setup', `Tags: bundle, ${A.cat}, gift-idea\nCollections: Bundles, Gift ideas\nCross-sell: show on the ${A.name} product page as “Make it a bundle”`),
    ]),
    d('instagram', [
      f('Caption', `You lot figured this one out before we did${v.e('😄')} Most of you ordering the ${A.name} add ${B.name}, so we've made it official.\n\nThe ${name}: ${euro(bundlePrice)} (save ${euro(full - bundlePrice)}). ${v.cta}, link in bio.\n\n${v.tags('#Bundle')}`, 2200),
      f('Visual brief', `Flat-lay overhead, both products side by side on the wooden board, ${name} sticker. 4:5 crop, product centred, logo bottom right.`),
    ]),
    d('reel', [
      f('Hook (0–3s)', `The combo ${pct(conf)} of our customers already order…`),
      f('Shot list', `1. ${A.name} unboxing (3s)\n2. Pour or add ${B.name} (4s)\n3. Bite / reaction shot (3s)\n4. End card: bundle price ${euro(bundlePrice)}`),
      f('Caption', `Officially a bundle. ${v.cta}${v.e('🔥')} ${v.tags()}`, 2200),
    ]),
    d('email', [
      f('Subject', trim(`You've been ordering this combo all along`, 50), 50),
      f('Preview text', trim(`So we made it a bundle, and you save ${euro(full - bundlePrice)}.`, 90), 90),
      f('Body', `Hi [First name],\n\nWe noticed something: most people who order the ${A.name} also add ${B.name}. So we've made it official.\n\nThe ${name}: ${euro(bundlePrice)} (usually ${euro(full)}).\n\n[${v.cta}]\n\n${v.sign}`),
    ]),
    d('gbp', [
      f('Offer post', trim(`New: the ${name}. ${A.name} + ${B.name} for ${euro(bundlePrice)}, save ${euro(full - bundlePrice)}. Our customers' favourite combo, now official.`, 1500), 1500),
      f('Button', 'Order online'),
    ]),
  ];
}

function risingProduct(o, brand, biz) {
  const v = voice(brand);
  const { product, rShare, qShare } = o.data;
  const isGF = o.topic === 'glutenfree';
  return [
    d('instagram', [
      f('Caption', isGF
        ? `Gluten-free doesn't mean second best${v.e('🙌')} Our certified gluten-free base works with every kit, and more of you are choosing it every week. Just add it at checkout.\n\n${v.sign}\n\n${v.tags('#GlutenFreeIreland', '#CoeliacIreland')}`
        : `Our quiet bestseller: the ${product.name}. More of you are adding it every week. Have you tried it yet?${v.e('👀')}\n\n${v.tags()}`, 2200),
      f('Visual brief', isGF ? 'Side-by-side: regular vs gluten-free pizza. Caption overlay: “Can you tell which is which?” 4:5.' : `Hero shot of ${product.name}, 4:5, natural light.`),
    ]),
    d('reel', [
      f('Hook (0–3s)', isGF ? 'Can you tell which one is gluten-free?' : `Why everyone's suddenly adding the ${product.name}…`),
      f('Shot list', isGF ? '1. Two pizzas side by side (3s)\n2. Taste test with staff or a regular (8s)\n3. Reveal (3s)\n4. “Add a GF base to any kit” end card' : '1. Product close-up\n2. In use\n3. Result\n4. End card'),
      f('Caption', `${isGF ? 'Gluten-free base, any kit.' : product.name} ${v.cta}. ${v.tags()}`, 2200),
    ]),
    d('email', [
      f('Subject', trim(isGF ? 'Gluten-free? Every kit, no compromise' : `Our quiet bestseller: ${product.name}`, 50), 50),
      f('Preview text', trim(isGF ? 'Our certified GF base now goes with every kit.' : 'Here’s why more of you are adding it.', 90), 90),
      f('Body', `Hi [First name],\n\n${isGF ? `More of you than ever are choosing our gluten-free base: it's now in ${pct(rShare)} of orders. It's certified gluten-free and packed separately, and it works with every kit.` : `The ${product.name} is now in ${pct(rShare)} of orders, up from ${pct(qShare)}.`}\n\n[${v.cta}]\n\n${v.sign}`),
    ]),
    d('internal', [
      f('Product idea', isGF ? 'Demand signal across orders, emails, search and news: test a dedicated “Gluten-Free Pizza Night Kit” (GF bases, labelled sauce and toppings) and a GF Christmas gift box. Three customers asked for one this month.' : `Consider a dedicated landing page and moving ${product.name} into the main navigation.`),
    ]),
  ];
}

function prDeal(o, brand, biz) {
  const v = voice(brand);
  const { org, qty, value, consent } = o.data;
  const check = consent
    ? `✓ ${org} gave permission to share (see their email). Still send them this draft before it goes out.`
    : `⚠ Ask ${org} for permission before publishing anything that names them.`;
  return [
    d('press', [
      f('Permission check', check),
      f('Headline', `Cork pizza-kit maker ${biz.name} hosts ${qty}-person virtual pizza night for ${org}`),
      f('Release', `${biz.location.split(',')[0]}, ${fmtDate('2026-11-05')} 2026. Independent Cork food business ${biz.name} has delivered its largest order yet: ${qty} Team Pizza Night Boxes for ${org}'s company all-hands, with every employee making pizza together on one live video call.\n\nThe order reflects a wider shift. Companies are swapping hotel functions for at-home experiences that include hybrid and remote staff.\n\n“${biz.stances.corporate}” said ${biz.owner}, founder of ${biz.name}.\n\n${org} has already asked about doing it again for Christmas.\n\nAbout ${biz.name}: ${biz.type}, based in ${biz.location}.`),
      f('Pitch email to local business desk', `Subject: ${qty} people, one video call, ${qty} pizza kits: a Cork small-business story\n\nHi [Journalist name],\n\nQuick story that might suit your small-business slot: we just delivered our biggest order yet (${qty} pizza kits for ${org}'s all-hands) and it says a lot about how Christmas parties are changing. Happy to share photos, numbers and a quote.\n\n${biz.owner}, ${biz.name}`),
    ]),
    d('linkedin', [
      f('Post', `Last Friday, ${qty} people at ${org} made pizza together on a single video call.\n\nIt was the biggest order in our history, and honestly the most fun we've had packing boxes.\n\nWhat we're learning: teams don't want another hotel function room. They want something everyone can join, wherever they work.\n\nThank you ${org} for trusting a small Cork business with your all-hands.\n\nIf you're planning a team Christmas, our Team Pizza Night Box ships anywhere in Ireland.\n\n${v.tags('#TeamBuilding', '#CorporateGifts')}`, 3000),
    ]),
    d('instagram', [
      f('Caption', `${qty} people. One video call. A LOT of pizza${v.e('🍕')}\n\nHuge thanks to the ${org} team for letting us be part of your all-hands. Planning a team Christmas? DM us.\n\n${v.tags('#TeamPizzaNight')}`, 2200),
      f('Visual brief', `Reshare ${org}'s photo (with permission) as slide 1, then packing-day shots of ${qty} boxes stacked in the kitchen.`),
    ]),
    d('blog', [
      f('Case study H1', `How ${org} Brought ${qty} People Together for a Pizza Night`),
      f('Meta description', trim(`${org} swapped a hotel function for ${qty} at-home pizza kits and one live cook-along. Here's how it worked and how to book one for your team.`, 155), 155),
      f('Outline', 'The challenge (hybrid team, one celebration) → What we sent → The live call → Results & quotes → Book a team night (CTA)'),
    ]),
  ];
}

function opinion(o, brand, biz) {
  const v = voice(brand);
  const { article, stance } = o.data;
  return [
    d('linkedin', [
      f('Post', `${article.title}.\n\n${stance}\n\nHere's what this looks like from inside a small Cork food business:\n\n→ [Your experience: one specific example]\n→ [What you're already doing about it]\n→ [What you'd ask of customers / government / the industry]\n\nWhat do you think? Would love to hear from other independents.\n\n${v.tags()}`, 3000),
      f('Source', `${article.outlet}, ${fmtDate(article.date)}. Link the article in the first comment, not the post, for better reach.`),
    ]),
    d('press', [
      f('Comment pitch to journalist', `Subject: Local voice on “${trim(article.title, 60)}”\n\nHi [Name],\n\nSaw your piece on this. I run ${biz.name}, a ${biz.type.toLowerCase()} in ${biz.location.split(',')[0]}, and I'd be glad to give a small-business view for any follow-up:\n\n“${stance}”\n\nAvailable for a quick call today or tomorrow.\n\n${biz.owner}`),
    ]),
    d('reel', [
      f('Format', 'Talking head, 30–40s, filmed in the kitchen. Phone at eye level, 9:16.'),
      f('Script', `[0–3s] “You might have seen this in the news…” (headline on screen)\n[3–20s] ${stance}\n[20–35s] “Here's what we're doing about it: [one concrete thing].”\n[35–40s] “What do you think? Tell me below.”`),
      f('Caption', `Our take on this week's news. ${v.tags()}`, 2200),
    ]),
  ];
}

const FIXES = {
  delivery: [
    'Check courier performance by day: are the late kits all Friday deliveries?',
    'Move the dispatch cut-off for Friday deliveries to Wednesday 2pm',
    'Turn on SMS tracking so customers aren’t left wondering',
    'Proactive policy: if a kit is late, refund delivery automatically and say so on the site',
  ],
  packaging: [
    'Price compostable or reusable tubs for sauce and toppings',
    'Pilot a tub take-back scheme at the coffee bar (customers asked for it)',
    'Add a “what’s recyclable” line to the instruction card',
    'Once you change it, tell everyone: it answers the upcoming packaging levy too',
  ],
};

function reviewFix(o, brand, biz) {
  const v = voice(brand);
  const { aspect, label, mentions } = o.data;
  return [
    d('internal', [
      f('What customers are saying', mentions.map((m) => `• ${quote(m.quote)} (${m.review.author}, ${fmtDate(m.review.date)})`).join('\n')),
      f('Fix checklist', (FIXES[aspect] || ['Find the root cause with the team', 'Agree one change this week', 'Measure for 4 weeks']).map((x) => `☐ ${x}`).join('\n')),
      f('Watch', `The Bee will track new reviews mentioning ${label.toLowerCase()} and tell you whether the fix is working.`),
    ]),
    d('reply', [
      f('Reply template', `Hi [Name], ${v.thanks.toLowerCase()} for telling us, and I'm sorry about this. You're not the only one who's mentioned it, so we're changing [specific fix] from [date]. I'd love to make it up to you: email me at hello@${biz.website} and [your gesture, e.g. your next delivery is on us]. ${biz.owner}`),
    ]),
    d('instagram', [
      f('“We listened” post (after the fix)', `You told us, we listened${v.e('💛')}\n\nA few of you mentioned ${label.toLowerCase()}. From [date] we've [what changed]. Thanks for the honest feedback: it's how we get better.\n\n${v.sign}`, 2200),
      f('When to post', 'Only once the fix is live. The Bee will remind you.'),
    ]),
  ];
}

function reviewAmplify(o, brand, biz) {
  const v = voice(brand);
  const { label, mentions } = o.data;
  const top = mentions.slice(-5);
  return [
    d('instagram', [
      f('Carousel', [`Slide 1: Don't take our word for it${v.e('⭐')}`, ...top.map((m, i) => `Slide ${i + 2}: ${quote(m.quote)} (${m.review.author})`)].join('\n\n')),
      f('Caption', `Our customers say it better than we ever could. ${v.thanks} to everyone who took the time to leave a review${v.e('🙏')}\n\n${v.tags()}`, 2200),
      f('Visual brief', 'Brand-colour background, review text big and centred, 5 stars above, 4:5 crop. One review per slide.'),
    ]),
    d('web', [
      f('Homepage testimonial strip', top.slice(0, 3).map((m) => `${quote(m.quote)} (${m.review.author})`).join('\n')),
      f('Product page note', `Add one ${label.toLowerCase()} quote under the Add to cart button. It works on the exact moment people hesitate.`),
    ]),
    d('gbp', [
      f('Post', trim(`What our customers say about our ${label.toLowerCase()}: ${quote(top[top.length - 1].quote)} Thank you!`, 1500), 1500),
    ]),
  ];
}

function momentStaff(o, brand, biz) {
  const v = voice(brand);
  const { name, reviews } = o.data;
  return [
    d('internal', [
      f(`Thank-you note to ${name}`, `${name},\n\nYou've been named in ${reviews.length} five-star reviews recently. Here's what people said:\n\n${reviews.map((r) => `${quote(r.text)} (${r.author})`).join('\n')}\n\nThat's the stuff that builds this business. Thank you.\n\n${biz.owner}`),
      f('Idea', 'Print the best review and put it up behind the counter. Lunch is on you this week.'),
    ]),
    d('instagram', [
      f('Consent', `☐ Ask ${name} if they're happy to be featured first`),
      f('Caption', `Meet ${name}${v.e('👋')} If you've been to the coffee bar, you already know. ${name} has been named in ${reviews.length} of our recent reviews. Here's one:\n\n${quote(reviews[reviews.length - 1].text)}\n\n${v.tags('#MeetTheTeam')}`, 2200),
      f('Visual brief', `Candid shot of ${name} at work, natural light, 4:5. No posed headshot.`),
    ]),
  ];
}

function momentLoyal(o, brand, biz) {
  return [
    d('note', o.data.milestones.map((m) => f(`Card for ${m.customer} (order no. ${m.n})`,
      `Dear ${m.customer.split(' ')[0]},\n\nThat's order number ${m.n}! It genuinely makes our week to see your name come in. There's a little something extra in this box, on us.\n\nThank you,\n${biz.owner} & the team`))),
    d('internal', [
      f('Action', '☐ Handwrite the card and pop it in their next box\n☐ Add a free Cookie Dough Tub to the order\n☐ Tag the customer “VIP” in Shopify'),
      f('Why not post it?', 'This one is just for them. It isn’t content. Real loyalty is built in private.'),
    ]),
  ];
}

function replyFor(r, v, biz) {
  const t = r.text.toLowerCase();
  if (r.rating <= 3) {
    if (/late|arriv|courier|deliver/.test(t)) return `Hi ${r.author.split(' ')[0]}, I'm really sorry your kit didn't arrive when it should have. That's not good enough on a night you'd planned around it. We're [changing our Friday courier cut-off] to fix this. Please email hello@${biz.website} so I can sort your next delivery. ${biz.owner}`;
    if (/plastic|packag|recycl/.test(t)) return `Hi ${r.author.split(' ')[0]}, thank you for this. You're right, and you're not the only one who's said it. We're [testing compostable tubs and a take-back scheme] now. Watch this space! ${biz.owner}`;
    return `Hi ${r.author.split(' ')[0]}, thank you for the honest feedback. I'd love to hear more and put it right: hello@${biz.website}. ${biz.owner}`;
  }
  const bits = [];
  if (/dough|crust|base|sourdough/.test(t) && !/gluten|coeliac/.test(t)) bits.push('the dough is our pride and joy');
  if (/aoife|darragh|tomás|niamh/i.test(t)) bits.push(`we'll make sure ${t.match(/aoife|darragh|tomás|niamh/i)[0].replace(/^./, (c) => c.toUpperCase())} sees this`);
  if (/gluten|coeliac/.test(t)) bits.push('making sure everyone can join pizza night matters a lot to us');
  if (/kids/.test(t)) bits.push('we love hearing the kids got stuck in');
  return `${v.thanks}, ${r.author.split(' ')[0]}! ${bits.length ? `${bits.join(', and ').replace(/^./, (c) => c.toUpperCase())}.` : 'This made our day.'} ${v.close}`;
}

function replyReviews(o, brand, biz) {
  const v = voice(brand);
  return [
    d('reply', o.data.reviews.map((r) => f(`${r.author} · ${'★'.repeat(r.rating)} · ${fmtDate(r.date)}`, replyFor(r, v, biz), 4096))),
  ];
}

function seoQuickwin(o, brand, biz) {
  return [
    d('web', o.data.queries.map((q) => f(`${q.page} → “${q.query}” (position ${q.position})`,
      `New title tag: ${trim(`${q.query.replace(/\b\w/g, (c) => c.toUpperCase())} | ${biz.name}`, 60)}\nMeta description: ${trim(`Looking for ${q.query}? Hand-made in ${biz.location.split(',')[0]} and delivered across Ireland. See why customers keep coming back.`, 155)}\nOn-page: add an H2 using the exact phrase, a 3-question FAQ block, and 2 internal links from the blog.`))),
  ];
}

const BUILDERS = {
  'faq-content': faqContent,
  bundle,
  'rising-product': risingProduct,
  'pr-deal': prDeal,
  opinion,
  'review-fix': reviewFix,
  'review-amplify': reviewAmplify,
  'moment-staff': momentStaff,
  'moment-loyal': momentLoyal,
  'reply-reviews': replyReviews,
  'seo-quickwin': seoQuickwin,
};

const PUBLIC = new Set(['blog', 'reel', 'instagram', 'email', 'gbp', 'linkedin', 'press']);

export function buildDrafts(opp, brand, biz) {
  const all = (BUILDERS[opp.kind] || (() => []))(opp, brand, biz);
  return all.filter((x) => !PUBLIC.has(x.channel) || brand.channels[x.channel] !== false);
}

/** Minutes of marketing work the drafts stand in for (shown as "time saved"). */
export const draftMinutes = (drafts) => drafts.reduce((s, x) => s + (x.minutes || 0), 0);

/** Flags phrases the brand has asked never to use. */
export function brandCheck(text, avoid) {
  const t = text.toLowerCase();
  return avoid.filter((w) => w && t.includes(w.toLowerCase()));
}

/** The structured prompt this opportunity would send to the LLM in production. */
export function buildPrompt(opp, brand, biz) {
  const evidence = opp.evidence.slice(0, 8).map((e) => `- [${e.source} · ${e.date} · ${e.who}] ${e.text}`).join('\n');
  return `<role>
You are the marketing worker bee for ${biz.name}: ${biz.type}, ${biz.location}.
Audience: ${biz.audience}.
</role>

<brand_voice>
Tone: ${brand.tone}. Emoji: ${brand.emoji ? 'sparingly' : 'none'}. Sign-off: "${brand.signOff}".
Never say: ${brand.avoid.join('; ')}.
Irish English spelling. Sound like the owner, ${biz.owner}, not like an agency.
</brand_voice>

<opportunity type="${opp.kind}" score="${opp.score}" sources="${opp.sources.join(',')}">
${opp.title}
${opp.insight}
</opportunity>

<evidence>
${evidence}
</evidence>

<task>
1. In one sentence, explain why this matters to the business.
2. Draft content for these channels: ${[...new Set(buildDrafts(opp, brand, biz).map((x) => x.channel))].join(', ')}.
   Respect each channel's format limits. Use customers' own words where possible.
3. Never invent facts, prices or quotes beyond the evidence. Mark anything that needs the owner's input as [brackets].
4. If the content names a customer, client or staff member, add a consent check.
</task>`;
}
