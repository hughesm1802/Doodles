// ─────────────────────────────────────────────────────────────
// Store profile for ONE tenant. Ember & Crust is a FICTIONAL Irish
// Shopify store used for the demo (ICP: 1–20 staff, no in-house
// marketer, no agency). In production this comes from the onboarding
// questionnaire plus the store's existing site copy, and every row the
// engine reads carries this storeId (row-level security per tenant).
// ─────────────────────────────────────────────────────────────

// Fixed "today" so the demo is reproducible.
export const TODAY = '2026-11-05';

export const business = {
  storeId: 'st_7f3a91',
  platform: 'Shopify',
  forwardingAddress: 'questions@embercrust.workerbee.ie',
  christmasCutoff: '2026-12-17', // last order date for Christmas delivery
  name: 'Ember & Crust',
  owner: 'Siobhán',
  location: 'Cork, Ireland',
  type: 'Online store selling wood-fired pizza kits, delivered nationwide',
  website: 'embercrust.example',
  audience: 'Families and couples doing a Friday "fakeaway", plus offices booking team pizza nights',
  staff: 4,

  products: [
    // stock: units on hand (null = made to order, so no overstock check)
    { id: 'margherita', name: 'Margherita Pizza Kit', price: 22, cat: 'kit', stock: null },
    { id: 'pepperoni', name: 'Pepperoni Pizza Kit', price: 24, cat: 'kit', stock: null },
    { id: 'nduja', name: 'Nduja & Chilli Kit', price: 26, cat: 'kit', stock: null },
    { id: 'vegan', name: 'Vegan Garden Kit', price: 24, cat: 'kit', stock: null },
    { id: 'kids', name: 'Kids Party Kit (6 minis)', price: 30, cat: 'kit', stock: null },
    { id: 'gf-base', name: 'Gluten-Free Base Add-on', price: 5, cat: 'addon', stock: 90 },
    { id: 'hot-honey', name: 'Chilli Hot Honey 250ml', price: 8.5, cat: 'addon', stock: 60 },
    { id: 'garlic-dip', name: 'Garlic & Herb Dip', price: 3.5, cat: 'addon', stock: 70 },
    { id: 'cookie', name: 'Cookie Dough Tub', price: 7, cat: 'addon', stock: 90 },
    { id: 'beans', name: 'Espresso Beans 1kg (for the morning after)', price: 32, cat: 'extra', stock: 40 },
    { id: 'stone', name: 'Cordierite Pizza Stone', price: 45, cat: 'gear', stock: 25 },
    { id: 'peel', name: 'Bamboo Pizza Peel', price: 28, cat: 'gear', stock: 110 },
    { id: 'team-box', name: 'Team Pizza Night Box (per head)', price: 24, cat: 'corporate', stock: null },
  ],

  // Pairs already sold as a bundle (so the Bee doesn't suggest them again)
  existingBundles: [],

  // Words that make a news story relevant to this business
  industryKeywords: [
    'pizza', 'hospitality', 'restaurant', 'takeaway', 'food', 'e-commerce', 'online retail',
    'delivery', 'small business', 'independent', 'cork', 'artisan', 'sourdough',
    'packaging', 'gluten', 'coeliac', 'corporate', 'christmas', 'meal kit', 'fakeaway',
  ],

  // Topics the Bee watches across emails, search and news.
  // `faqs` come from the owner's past replies: the Bee's knowledge base.
  topics: [
    {
      id: 'storage',
      headline: 'Can You Freeze Pizza Dough? How to Store Your Pizza Kit',
      label: 'Freezing & storing kits',
      keywords: ['freez', 'fridge', 'shelf life', 'how long', 'keep', 'store', 'storing', 'best before', 'expir'],
      impact: 4,
      faqs: [
        { q: 'Can I freeze my pizza kit?', a: 'Yes. Freeze the dough balls on the day they arrive and they keep for up to 3 months. Thaw in the fridge overnight, then leave at room temperature for 2 hours before stretching.' },
        { q: 'How long does the kit last in the fridge?', a: 'The dough is at its best within 4 days of delivery. Sauce and toppings carry their own best-before dates on each tub.' },
      ],
    },
    {
      id: 'glutenfree',
      headline: 'Gluten-Free & Coeliac-Safe Pizza at Home: Your Questions Answered',
      label: 'Gluten-free & coeliac options',
      keywords: ['gluten', 'coeliac', 'celiac'],
      impact: 4,
      faqs: [
        { q: 'Do you have gluten-free pizza bases?', a: 'Yes. Our Gluten-Free Base add-on swaps any kit to certified gluten-free bases, made in a dedicated gluten-free facility.' },
        { q: 'Is the gluten-free base safe for coeliacs?', a: 'The bases are certified gluten-free and packed separately. Our sauces and toppings contain no gluten ingredients, but they are packed in a kitchen that handles flour.' },
      ],
    },
    {
      id: 'homeoven',
      headline: 'How to Cook Pizzeria-Quality Pizza in a Normal Home Oven',
      label: 'Cooking in a normal home oven',
      keywords: ['oven', 'temperature', 'crispy', 'soggy', 'no pizza oven', 'normal oven', 'grill'],
      impact: 3,
      faqs: [
        { q: 'Do I need a pizza oven?', a: 'No. Every kit is tested in a normal home oven. Preheat to the highest setting (240–250°C) with a tray or stone inside for 30 minutes.' },
        { q: 'How do I get a crispy base at home?', a: 'Preheat the tray or stone for a full 30 minutes, stretch the base thin, go light on sauce, and finish for 1 minute under the grill.' },
      ],
    },
    {
      id: 'corporate',
      headline: 'Team Pizza Nights: The At-Home Christmas Party Your Team Will Actually Enjoy',
      label: 'Corporate & team pizza nights',
      keywords: ['corporate', 'team', 'colleagues', 'employees', 'office', 'invoice', 'bulk', 'christmas party', 'company'],
      impact: 5,
      faqs: [
        { q: 'Do you do corporate or team orders?', a: 'Yes. Our Team Pizza Night Box ships to each person’s home or to the office, with one invoice and a live pizza-making video call option.' },
        { q: 'Can you invoice our company?', a: 'Yes. We invoice on 30-day terms for orders of 10 boxes or more.' },
      ],
    },
    {
      id: 'delivery',
      headline: 'Where We Deliver in Ireland & When Your Kit Will Arrive',
      label: 'Delivery areas & timing',
      keywords: ['deliver', 'courier', 'ship', 'galway', 'dublin', 'belfast', 'northern ireland', 'arrive'],
      impact: 3,
      faqs: [
        { q: 'Where do you deliver?', a: 'Anywhere in the Republic of Ireland, Tuesday to Friday. Northern Ireland delivery is coming in early 2027.' },
      ],
    },
    {
      id: 'packaging',
      headline: 'Our Packaging: What We Use, Why, and What’s Changing',
      label: 'Packaging & sustainability',
      keywords: ['packaging', 'plastic', 'recycl', 'compost', 'single-use', 'waste'],
      impact: 3,
      faqs: [],
    },
  ],

  // Review aspects: what customers talk about
  aspects: {
    dough: ['dough', 'crust', 'base', 'sourdough', 'bubbly'],
    instructions: ['instructions', 'video', 'guide', 'easy to follow', 'qr code'],
    delivery: ['delivery', 'arrived', 'courier', 'late', 'delayed'],
    packaging: ['packaging', 'plastic', 'tubs', 'recycl', 'waste'],
    glutenfree: ['gluten', 'coeliac'],
    value: ['price', 'value', 'expensive', 'worth', 'pricey'],
  },
  aspectLabels: {
    dough: 'Dough & crust quality',
    instructions: 'Easy instructions & how-to video',
    delivery: 'Delivery timing',
    packaging: 'Packaging & plastic',
    glutenfree: 'Gluten-free options',
    value: 'Value for money',
  },

  // The owner's views, captured at onboarding so opinion posts sound like them
  stances: {
    packaging: 'We’ve been working towards plastic-free kits and we’d rather lead than wait for a levy to make us.',
    glutenfree: 'Nobody should have to sit out pizza night. Gluten-free shouldn’t mean second best.',
    corporate: 'A team that makes dinner together gets more from it than another hotel function room.',
    delivery: 'Independent food businesses can’t keep giving 30% to the apps. Direct is better for everyone.',
    default: 'As a small, independent Cork food business, we see the effect of this every week.',
  },
};

export const defaultBrand = {
  tone: 'warm', // warm | straight | premium
  emoji: true,
  signOff: '— Siobhán & the Ember crew',
  hashtags: ['#EmberAndCrust', '#CorkFood', '#PizzaNight', '#ShopLocalIreland'],
  avoid: ['cheap', 'best in the world', 'authentic Italian'],
  channels: {
    blog: true, email: true, instagram: true, reel: true, ads: true, linkedin: true, press: true,
  },
};
