// Sample Google Search Console data, compared like-for-like:
// impressions/clicks/position = last 28 days (finalised, ending 3 days ago because GSC lags 2–3 days),
// prevImpressions = the 28 days before that.
// page = the URL that ranks (null = no relevant page ranks).
export const searchQueries = [
  { query: 'ember and crust', page: '/', clicks: 760, impressions: 1300, prevImpressions: 1250, position: 1.1 },
  { query: 'pizza kit delivery ireland', page: '/collections/kits', clicks: 120, impressions: 2300, prevImpressions: 2100, position: 6.2 },
  { query: 'pizza kits cork', page: '/collections/kits', clicks: 95, impressions: 650, prevImpressions: 620, position: 3.4 },
  { query: 'can you freeze pizza dough', page: null, clicks: 7, impressions: 1450, prevImpressions: 1300, position: 14.8 },
  { query: 'how long does pizza dough last in the fridge', page: null, clicks: 3, impressions: 880, prevImpressions: 820, position: 17.2 },
  { query: 'freeze pizza dough balls', page: null, clicks: 2, impressions: 380, prevImpressions: 350, position: 19.5 },
  { query: 'gluten free pizza cork', page: '/collections/kits', clicks: 16, impressions: 640, prevImpressions: 380, position: 11.3 },
  { query: 'coeliac safe pizza delivery', page: null, clicks: 1, impressions: 310, prevImpressions: 150, position: 21.6 },
  { query: 'gluten free pizza kit', page: '/products/gluten-free-base', clicks: 9, impressions: 480, prevImpressions: 290, position: 12.9 },
  { query: 'how to cook pizza in a normal oven', page: null, clicks: 5, impressions: 1050, prevImpressions: 1000, position: 18.4 },
  { query: 'crispy pizza base home oven', page: null, clicks: 2, impressions: 330, prevImpressions: 300, position: 18.1 },
  { query: 'corporate christmas gifts ireland', page: null, clicks: 2, impressions: 520, prevImpressions: 160, position: 24.7 },
  { query: 'virtual christmas party ideas', page: null, clicks: 1, impressions: 700, prevImpressions: 210, position: 31.2 },
  { query: 'team building ideas remote', page: null, clicks: 1, impressions: 700, prevImpressions: 690, position: 38.0 },
  { query: 'nduja pizza', page: '/products/nduja-chilli-kit', clicks: 26, impressions: 800, prevImpressions: 760, position: 9.4 },
  { query: 'hot honey pizza', page: '/products/nduja-chilli-kit', clicks: 18, impressions: 700, prevImpressions: 650, position: 9.8 },
  { query: 'pizza stone vs steel', page: '/products/pizza-stone', clicks: 11, impressions: 530, prevImpressions: 500, position: 8.6 },
  { query: 'pizza delivery galway', page: null, clicks: 0, impressions: 200, prevImpressions: 190, position: 41.0 },
];
