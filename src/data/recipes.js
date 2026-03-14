// ─────────────────────────────────────────────────────────────────────────────
// Recipe Data
// videoId: YouTube video ID. Replace with your preferred video IDs.
// image:   High-quality Unsplash photo URL (no API key required).
// ─────────────────────────────────────────────────────────────────────────────

export const categories = [
  { id: 'caribbean', label: 'Caribbean', icon: '🌴' },
  { id: 'italian',   label: 'Italian',   icon: '🇮🇹' },
  { id: 'mexican',   label: 'Mexican',   icon: '🇲🇽' },
  { id: 'indian',    label: 'Indian',    icon: '🇮🇳' },
  { id: 'japanese',  label: 'Japanese',  icon: '🇯🇵' },
  { id: 'american',  label: 'American',  icon: '🇺🇸' },
  { id: 'french',    label: 'French',    icon: '🇫🇷' },
  { id: 'thai',      label: 'Thai',      icon: '🇹🇭' },
  { id: 'desserts',  label: 'Desserts',  icon: '🍰' },
]

const recipes = [
  // ─── 1. Spaghetti Carbonara ────────────────────────────────────────────────
  {
    id: 'spaghetti-carbonara',
    title: 'Spaghetti Carbonara',
    subtitle: 'Classic Roman pasta perfected',
    category: 'italian',
    description:
      'Authentic Roman carbonara relies on just five ingredients: pasta, guanciale (cured pork cheek), eggs, Pecorino Romano, and black pepper. No cream — ever. The magic lies in an emulsion created by tossing the hot pasta with a yolk-and-cheese mixture away from the heat, yielding a silky, luxurious sauce that clings to every strand.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1200&q=80',
    imageAlt: 'A bowl of spaghetti carbonara with crispy guanciale',
    videoId: 'D_2DBLAt57c',
    videoTitle: 'How to Make Authentic Spaghetti Carbonara',
    prepTime: '10 min',
    cookTime: '20 min',
    totalTime: '30 min',
    servings: 4,
    difficulty: 'Medium',
    tags: ['pasta', 'Italian', 'quick', 'egg', 'pork'],
    chef: 'Chef Marco Bianchi',

    ingredients: [
      { group: 'Pasta', items: [
        { amount: '400 g', item: 'spaghetti or rigatoni', note: 'use a bronze-die pasta for better sauce grip' },
        { amount: '1 tbsp', item: 'coarse sea salt', note: 'for pasta water' },
      ]},
      { group: 'Sauce', items: [
        { amount: '200 g', item: 'guanciale (or pancetta)', note: 'cut into thick lardons, rind removed' },
        { amount: '4 large', item: 'egg yolks' },
        { amount: '1 whole', item: 'large egg' },
        { amount: '80 g', item: 'Pecorino Romano, finely grated', note: 'plus extra to serve' },
        { amount: '30 g', item: 'Parmigiano-Reggiano, finely grated' },
        { amount: '2 tsp', item: 'freshly cracked black pepper', note: 'toasted and coarsely ground' },
      ]},
    ],

    steps: [
      {
        step: 1,
        title: 'Toast the pepper',
        instruction:
          'Place a large, heavy-bottomed skillet over medium heat. Add the cracked black pepper and toast for 60 seconds until fragrant. Remove and set aside. Do not let it burn.',
        tip: 'Toasting intensifies the pepper\'s flavour — this single step elevates the dish enormously.',
        image: null,
      },
      {
        step: 2,
        title: 'Render the guanciale',
        instruction:
          'In the same skillet over medium-low heat, cook the guanciale lardons without any added fat. Render slowly for 8–10 minutes until golden and the fat has been released but the interior is still slightly tender. Remove from heat. Reserve the rendered fat in the pan.',
        tip: 'Low and slow is key. If using pancetta, the process is the same but slightly faster.',
        image: null,
      },
      {
        step: 3,
        title: 'Make the egg-cheese mixture',
        instruction:
          'In a large bowl, whisk together the egg yolks and whole egg. Gradually add both cheeses and most of the toasted pepper. Whisk vigorously until you have a thick, pale yellow paste. Set the bowl over the pot you will boil the pasta in (NOT touching the water) to keep it gently warm.',
        tip: 'Pre-warming the bowl prevents the eggs from scrambling when you add the hot pasta.',
        image: null,
      },
      {
        step: 4,
        title: 'Boil the pasta',
        instruction:
          'Bring a large pot of water to a rolling boil. Add the coarse salt — the water should taste like mild sea water. Cook the spaghetti for 2 minutes less than the package directions (it will finish cooking in the sauce). Reserve at least 300 ml of the starchy cooking water before draining.',
        tip: 'Never rinse pasta — you need the surface starch to help the sauce emulsify.',
        image: null,
      },
      {
        step: 5,
        title: 'Combine and emulsify',
        instruction:
          'Transfer the drained pasta directly into the skillet with the guanciale fat over very low heat. Toss for 1 minute. Remove the skillet from the heat entirely. Working quickly, add the egg-cheese paste and toss constantly, adding pasta water a small splash at a time, until you have a glossy, creamy sauce that coats every strand. The pasta should never be "wet" — aim for a clinging, satiny consistency.',
        tip: 'Temperature control is everything. Too hot and the eggs scramble; too cool and the sauce won\'t emulsify. Off the heat with residual warmth is perfect.',
        image: null,
      },
      {
        step: 6,
        title: 'Plate and serve',
        instruction:
          'Twirl portions into warm bowls. Top with the remaining guanciale lardons, an extra grating of Pecorino Romano, and a final grind of black pepper. Serve immediately.',
        tip: 'Warm your pasta bowls by filling them with hot water for a minute. Cold bowls chill the pasta instantly.',
        image: null,
      },
    ],

    nutrition: {
      servingSize: '1 portion (approx. 380 g)',
      calories: 720,
      macros: [
        { label: 'Protein',        value: '32 g',   percent: 64,  color: '#4ade80' },
        { label: 'Carbohydrates',  value: '78 g',   percent: 78,  color: '#facc15' },
        { label: 'Total Fat',      value: '30 g',   percent: 46,  color: '#f87171' },
        { label: 'Saturated Fat',  value: '11 g',   percent: 55,  color: '#fca5a5' },
        { label: 'Dietary Fibre',  value: '3 g',    percent: 12,  color: '#86efac' },
        { label: 'Sodium',         value: '610 mg', percent: 27,  color: '#7dd3fc' },
        { label: 'Sugars',         value: '3 g',    percent: 3,   color: '#fde68a' },
      ],
      vitamins: [
        { label: 'Vitamin A',  value: '12% DV' },
        { label: 'Calcium',    value: '28% DV' },
        { label: 'Iron',       value: '18% DV' },
        { label: 'Vitamin B12', value: '25% DV' },
      ],
      allergens: ['Gluten', 'Eggs', 'Milk'],
    },
  },

  // ─── 2. Chicken Tikka Masala ───────────────────────────────────────────────
  {
    id: 'chicken-tikka-masala',
    title: 'Chicken Tikka Masala',
    subtitle: 'Rich, smoky curry with a velvety tomato-cream sauce',
    category: 'indian',
    description:
      'Chicken tikka masala is a globally beloved dish: tender marinated chicken pieces cooked in a tandoor (or under a grill) then simmered in a richly spiced, creamy tomato sauce. The double cooking — first the char, then the braise — layers smoky depth with warming spice. Pair with basmati rice and warm naan.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80',
    imageAlt: 'A bowl of chicken tikka masala with naan bread',
    videoId: 'ZHy5L_PBBJk',
    videoTitle: 'Perfect Chicken Tikka Masala from Scratch',
    prepTime: '30 min',
    cookTime: '45 min',
    totalTime: '1 hr 15 min',
    servings: 6,
    difficulty: 'Medium',
    tags: ['chicken', 'Indian', 'curry', 'spicy', 'gluten-free option'],
    chef: 'Chef Priya Sharma',

    ingredients: [
      { group: 'Chicken Marinade', items: [
        { amount: '900 g', item: 'boneless chicken thighs', note: 'cut into 4 cm chunks' },
        { amount: '200 g', item: 'full-fat plain yoghurt' },
        { amount: '3 tbsp', item: 'fresh lemon juice' },
        { amount: '1 tbsp', item: 'garam masala' },
        { amount: '1 tbsp', item: 'ground cumin' },
        { amount: '1 tbsp', item: 'ground turmeric' },
        { amount: '1 tbsp', item: 'Kashmiri red chilli powder', note: 'for colour and mild heat' },
        { amount: '2 tsp', item: 'ground coriander' },
        { amount: '1 tbsp', item: 'ginger-garlic paste', note: 'equal parts fresh ginger and garlic, blended' },
        { amount: '1 tsp', item: 'fine sea salt' },
      ]},
      { group: 'Tikka Masala Sauce', items: [
        { amount: '3 tbsp', item: 'neutral oil or ghee' },
        { amount: '2 medium', item: 'white onions, finely diced' },
        { amount: '6 cloves', item: 'garlic, minced' },
        { amount: '2 tsp', item: 'fresh ginger, grated' },
        { amount: '1 tbsp', item: 'tomato purée (paste)' },
        { amount: '800 g', item: 'canned crushed tomatoes' },
        { amount: '250 ml', item: 'double cream (heavy cream)' },
        { amount: '1 tsp', item: 'sugar', note: 'to balance acidity' },
        { amount: '2 tsp', item: 'garam masala' },
        { amount: '1 tsp', item: 'ground cumin' },
        { amount: '1 tsp', item: 'ground coriander' },
        { amount: '1 tsp', item: 'Kashmiri chilli powder' },
        { amount: '1 tsp', item: 'ground cardamom' },
        { amount: 'to taste', item: 'salt' },
        { amount: '2 tbsp', item: 'fresh coriander (cilantro), chopped', note: 'to garnish' },
      ]},
      { group: 'To Serve', items: [
        { amount: '400 g', item: 'basmati rice, cooked' },
        { amount: '4', item: 'naan breads, warmed' },
        { amount: '1', item: 'lemon, cut into wedges' },
      ]},
    ],

    steps: [
      {
        step: 1,
        title: 'Marinate the chicken',
        instruction:
          'Combine all marinade ingredients in a large bowl and mix until smooth. Add the chicken pieces and coat thoroughly. Cover and refrigerate for at least 4 hours, or overnight for best results.',
        tip: 'The longer the marinade, the more tender and flavourful the chicken. The yoghurt acts as a tenderiser.',
        image: null,
      },
      {
        step: 2,
        title: 'Grill (char) the chicken',
        instruction:
          'Preheat your grill or oven broiler to its highest setting. Thread chicken pieces onto metal skewers or lay on a foil-lined baking tray. Grill for 10–12 minutes, turning once, until the chicken is cooked through and has charred edges. Set aside.',
        tip: 'The char is essential — it imparts that signature smoky flavour. Don\'t skip or sous vide this step.',
        image: null,
      },
      {
        step: 3,
        title: 'Build the sauce base',
        instruction:
          'Heat oil or ghee in a large, heavy-bottomed pot over medium heat. Add the onions with a pinch of salt and cook for 12–15 minutes, stirring occasionally, until deep golden brown. Add the garlic, ginger, and tomato purée; cook for 2 minutes.',
        tip: 'Properly caramelised onions are the foundation of great curry. Do not rush this step.',
        image: null,
      },
      {
        step: 4,
        title: 'Add spices and tomatoes',
        instruction:
          'Add garam masala, cumin, coriander, chilli powder, and cardamom. Stir constantly for 60 seconds until fragrant. Pour in the crushed tomatoes and sugar. Bring to a boil then reduce heat and simmer for 20 minutes, stirring occasionally, until the sauce thickens and the oil begins to separate (bhuna stage).',
        tip: 'The oil separating from the sauce (bhuna) signals the tomatoes have cooked through and the raw flavour is gone.',
        image: null,
      },
      {
        step: 5,
        title: 'Blend for a smooth sauce',
        instruction:
          'Using an immersion blender (or carefully transferring to a stand blender), blend the sauce until completely smooth. Return to the pot.',
        tip: 'Blending creates that signature restaurant-smooth texture. A fine-mesh sieve pressed through will give an even silkier result.',
        image: null,
      },
      {
        step: 6,
        title: 'Finish with cream and chicken',
        instruction:
          'Stir in the double cream and bring the sauce to a gentle simmer. Add the grilled chicken pieces and simmer for 10 minutes to let the chicken absorb the sauce. Adjust seasoning.',
        tip: 'For a lighter option, swap double cream for coconut cream or cashew cream.',
        image: null,
      },
      {
        step: 7,
        title: 'Garnish and serve',
        instruction:
          'Ladle into bowls, drizzle with a little extra cream if desired, and scatter fresh coriander over the top. Serve with fluffy basmati rice, warm naan, and lemon wedges.',
        tip: 'A drizzle of melted butter or ghee over the finished dish adds richness and gloss.',
        image: null,
      },
    ],

    nutrition: {
      servingSize: '1 portion with rice (approx. 500 g)',
      calories: 680,
      macros: [
        { label: 'Protein',        value: '45 g',   percent: 90,  color: '#4ade80' },
        { label: 'Carbohydrates',  value: '55 g',   percent: 55,  color: '#facc15' },
        { label: 'Total Fat',      value: '28 g',   percent: 43,  color: '#f87171' },
        { label: 'Saturated Fat',  value: '13 g',   percent: 65,  color: '#fca5a5' },
        { label: 'Dietary Fibre',  value: '4 g',    percent: 16,  color: '#86efac' },
        { label: 'Sodium',         value: '720 mg', percent: 31,  color: '#7dd3fc' },
        { label: 'Sugars',         value: '10 g',   percent: 10,  color: '#fde68a' },
      ],
      vitamins: [
        { label: 'Vitamin C',   value: '22% DV' },
        { label: 'Vitamin A',   value: '18% DV' },
        { label: 'Iron',        value: '22% DV' },
        { label: 'Calcium',     value: '14% DV' },
      ],
      allergens: ['Milk', 'Gluten (naan)'],
    },
  },

  // ─── 3. Classic Beef Burger ───────────────────────────────────────────────
  {
    id: 'classic-beef-burger',
    title: 'Classic Smash Burger',
    subtitle: 'Crispy-edged, juicy patties with secret sauce',
    category: 'american',
    description:
      'The smash burger technique achieves the ideal crust-to-beef ratio: a thin patty pressed hard against a screaming-hot cast iron, creating a deep Maillard crust with a juicy interior. Stacked double, dressed with American cheese, pickles, shredded lettuce, and a tangy special sauce, this is a diner-quality burger at home.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80',
    imageAlt: 'A double smash burger with all the toppings',
    videoId: 'nkqPrnB4OHI',
    videoTitle: 'The Perfect Smash Burger at Home',
    prepTime: '15 min',
    cookTime: '10 min',
    totalTime: '25 min',
    servings: 4,
    difficulty: 'Easy',
    tags: ['beef', 'American', 'quick', 'burger', 'comfort food'],
    chef: 'Chef Jake Morrison',

    ingredients: [
      { group: 'Patties', items: [
        { amount: '700 g', item: '80/20 ground beef (chuck)', note: 'do not over-handle; keep cold' },
        { amount: '1 tsp', item: 'flaky sea salt' },
        { amount: '1 tsp', item: 'freshly ground black pepper' },
        { amount: '1 tbsp', item: 'neutral oil with high smoke point' },
      ]},
      { group: 'Special Sauce', items: [
        { amount: '60 g', item: 'mayonnaise' },
        { amount: '30 g', item: 'yellow mustard' },
        { amount: '30 g', item: 'dill pickle relish' },
        { amount: '1 tsp', item: 'white wine vinegar' },
        { amount: '1 tsp', item: 'sweet paprika' },
        { amount: '1 tsp', item: 'garlic powder' },
        { amount: '1 tsp', item: 'onion powder' },
        { amount: '1 pinch', item: 'cayenne pepper' },
      ]},
      { group: 'Build', items: [
        { amount: '4', item: 'brioche burger buns, split and toasted' },
        { amount: '8 slices', item: 'American cheese (or mild cheddar)' },
        { amount: '1 cup', item: 'iceberg lettuce, finely shredded' },
        { amount: '1 large', item: 'beef tomato, thinly sliced' },
        { amount: '1 small', item: 'white onion, very thinly sliced' },
        { amount: '12', item: 'dill pickle chips' },
      ]},
    ],

    steps: [
      {
        step: 1,
        title: 'Make the special sauce',
        instruction:
          'Whisk together all sauce ingredients in a small bowl. Cover and refrigerate until needed — it improves after 30 minutes. The sauce keeps for up to a week.',
        tip: 'Make a double batch; it\'s also outstanding as a dipping sauce for fries.',
        image: null,
      },
      {
        step: 2,
        title: 'Form and prep the patties',
        instruction:
          'Divide the cold ground beef into 8 equal balls of about 85 g each — this is a double smash burger. Do not compress or shape them further. Season the tops generously with salt and pepper just before cooking.',
        tip: 'Cold beef is crucial. Warm fat smears; cold fat shatters into those glorious crispy bits.',
        image: null,
      },
      {
        step: 3,
        title: 'Heat the pan',
        instruction:
          'Place a large cast-iron skillet or griddle over the highest heat your stove can produce. Add a thin film of oil. Heat for 3–4 minutes until the oil is just beginning to smoke. This is non-negotiable — a cold pan produces a steamed patty, not a smashed burger.',
        tip: 'Open a window or turn on the extractor fan. The smoke means flavour.',
        image: null,
      },
      {
        step: 4,
        title: 'Smash the patties',
        instruction:
          'Working in batches, place 2 beef balls onto the hot surface, spacing them apart. Immediately press each one flat with a heavy spatula or burger press lined with baking parchment, pressing firmly and evenly for 10 full seconds until the patty is about 5–6 mm thin. Do not move or press again. Cook for 2 minutes until a deep mahogany crust forms on the underside.',
        tip: 'Press to the edge of the bun size. You want maximum surface area for crust.',
        image: null,
      },
      {
        step: 5,
        title: 'Flip, cheese, and stack',
        instruction:
          'Flip each patty in one decisive move. Place a slice of American cheese on top immediately. Cook for 60 more seconds. For a double burger, place a second patty directly on top of the first; steam-melt the cheese with a splash of water and a lid for 15 seconds.',
        tip: 'American cheese melts beautifully and creates that classic burger lacquer. Don\'t use a cheese that refuses to melt.',
        image: null,
      },
      {
        step: 6,
        title: 'Assemble the burger',
        instruction:
          'Spread special sauce on both toasted bun halves. On the bottom bun, layer: shredded lettuce, tomato slice, sliced onion, the double patty stack, and pickle chips. Crown with the top bun. Serve immediately with fries.',
        tip: 'Putting lettuce under the patty acts as a moisture barrier and keeps the bun from going soggy.',
        image: null,
      },
    ],

    nutrition: {
      servingSize: '1 double burger (approx. 450 g)',
      calories: 890,
      macros: [
        { label: 'Protein',        value: '52 g',   percent: 100, color: '#4ade80' },
        { label: 'Carbohydrates',  value: '48 g',   percent: 48,  color: '#facc15' },
        { label: 'Total Fat',      value: '52 g',   percent: 80,  color: '#f87171' },
        { label: 'Saturated Fat',  value: '22 g',   percent: 100, color: '#fca5a5' },
        { label: 'Dietary Fibre',  value: '2 g',    percent: 8,   color: '#86efac' },
        { label: 'Sodium',         value: '1080 mg',percent: 47,  color: '#7dd3fc' },
        { label: 'Sugars',         value: '8 g',    percent: 8,   color: '#fde68a' },
      ],
      vitamins: [
        { label: 'Iron',       value: '35% DV' },
        { label: 'Zinc',       value: '40% DV' },
        { label: 'Vitamin B12',value: '55% DV' },
        { label: 'Calcium',    value: '20% DV' },
      ],
      allergens: ['Gluten', 'Eggs', 'Milk', 'Mustard'],
    },
  },

  // ─── 4. Beef Tacos ────────────────────────────────────────────────────────
  {
    id: 'beef-tacos',
    title: 'Birria-Style Beef Tacos',
    subtitle: 'Slow-braised, consommé-dipped, quesabirria perfection',
    category: 'mexican',
    description:
      'Birria originated in Jalisco, Mexico, as a slow-cooked goat stew. Today\'s quesabirria tacos — filled with tender braised beef, dipped in the rich chilli consommé, and crisped on a griddle — have taken the world by storm. The consommé doubles as a dipping sauce, making every bite explosively flavourful.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80',
    imageAlt: 'Quesabirria tacos with consomme dipping broth',
    videoId: 'cExJMWmsi4M',
    videoTitle: 'Birria Tacos (Quesabirria) at Home',
    prepTime: '30 min',
    cookTime: '3 hr',
    totalTime: '3 hr 30 min',
    servings: 8,
    difficulty: 'Advanced',
    tags: ['beef', 'Mexican', 'slow cook', 'tacos', 'weekend project'],
    chef: 'Chef Isabella Cruz',

    ingredients: [
      { group: 'Birria Meat', items: [
        { amount: '1.5 kg', item: 'beef short rib or chuck roast', note: 'cut into large chunks' },
        { amount: '500 g', item: 'oxtail', note: 'optional but adds deep gelatin' },
        { amount: '2 tsp', item: 'fine sea salt' },
        { amount: '1 tsp', item: 'ground black pepper' },
        { amount: '2 tbsp', item: 'neutral oil' },
      ]},
      { group: 'Chilli Marinade (Adobo)', items: [
        { amount: '4', item: 'dried guajillo chillies', note: 'seeds removed' },
        { amount: '2', item: 'dried ancho chillies', note: 'seeds removed' },
        { amount: '2', item: 'dried chiles de árbol', note: 'for heat, adjust to taste' },
        { amount: '1 medium', item: 'white onion, quartered' },
        { amount: '6 cloves', item: 'garlic, unpeeled' },
        { amount: '4 medium', item: 'Roma tomatoes, halved' },
        { amount: '1 tsp', item: 'dried Mexican oregano' },
        { amount: '1 tsp', item: 'ground cumin' },
        { amount: '1/2 tsp', item: 'ground cinnamon' },
        { amount: '1/4 tsp', item: 'ground cloves' },
        { amount: '3 tbsp', item: 'apple cider vinegar' },
        { amount: '500 ml', item: 'beef stock' },
      ]},
      { group: 'Assembly', items: [
        { amount: '16', item: 'corn tortillas' },
        { amount: '300 g', item: 'Oaxacan cheese or low-moisture mozzarella, shredded' },
        { amount: '1 medium', item: 'white onion, finely diced' },
        { amount: '1 bunch', item: 'fresh cilantro, chopped' },
        { amount: '2', item: 'limes, cut into wedges' },
        { amount: '1 jar', item: 'pickled jalapeños' },
      ]},
    ],

    steps: [
      {
        step: 1,
        title: 'Toast and soak the chillies',
        instruction:
          'Heat a dry skillet over medium heat. Toast the dried chillies for 30 seconds per side until fragrant and pliable, pressing them flat — do not let them blacken. Transfer to a bowl, cover with boiling water, and soak for 20 minutes.',
        tip: 'Toasting awakens the chillies\' complex flavours. Soaking softens them for blending.',
        image: null,
      },
      {
        step: 2,
        title: 'Char the aromatics',
        instruction:
          'On the same dry skillet, char the onion, garlic, and halved tomatoes over high heat until blackened on the cut side. This adds depth and complexity. Allow to cool slightly; peel the garlic.',
        tip: 'The char adds a smoky, slightly bitter note that balances the sweet chillies.',
        image: null,
      },
      {
        step: 3,
        title: 'Blend the adobo',
        instruction:
          'Drain the soaked chillies, reserving 100 ml of the soaking liquid. Blend the chillies, charred aromatics, spices, vinegar, and reserved soaking liquid until completely smooth. Pass through a fine-mesh sieve for a silkier adobo.',
        tip: 'Strain out the chilli skins — they can make the sauce bitter and gritty.',
        image: null,
      },
      {
        step: 4,
        title: 'Sear the beef',
        instruction:
          'Season the beef aggressively with salt and pepper. Heat oil in a large Dutch oven over high heat. Sear the beef in batches until deeply browned on all sides, about 3–4 minutes per side. Do not crowd the pan.',
        tip: 'Proper browning is the single biggest flavour contributor in a braise. Take your time.',
        image: null,
      },
      {
        step: 5,
        title: 'Braise low and slow',
        instruction:
          'Return all beef to the pot. Pour the adobo over the beef, then add beef stock until the meat is just submerged. Bring to a boil, then reduce heat to the lowest simmer. Cover tightly and braise for 2.5–3 hours until the beef is pull-apart tender.',
        tip: 'Alternatively, cook in a slow cooker on low for 8 hours or pressure cooker for 60 minutes at high.',
        image: null,
      },
      {
        step: 6,
        title: 'Shred and skim the consommé',
        instruction:
          'Remove the beef and shred with two forks, discarding any bones. Skim the fat from the surface of the braising liquid (consommé) — save this fat for the griddle. Taste and season the consommé with salt. Keep both the meat and consommé warm.',
        tip: 'The fat you skim is liquid gold — it\'s packed with flavour and is what you griddle the tacos in.',
        image: null,
      },
      {
        step: 7,
        title: 'Assemble and griddle the tacos',
        instruction:
          'Heat a griddle or large skillet over medium-high heat. Brush with the reserved birria fat. Dip a tortilla into the warm consommé, coating both sides, then lay on the griddle. Add shredded cheese and a generous portion of birria meat to one half. Fold the tortilla over and press gently. Cook for 2 minutes per side until crispy and golden.',
        tip: 'Work in batches and keep the assembled tacos warm in a low oven while you finish the rest.',
        image: null,
      },
      {
        step: 8,
        title: 'Serve with consommé',
        instruction:
          'Serve the tacos with individual cups of hot consommé for dipping, topped with diced onion, cilantro, pickled jalapeños, and a squeeze of lime.',
        tip: 'The dipping ritual is non-negotiable. The consommé transforms the taco with each dip.',
        image: null,
      },
    ],

    nutrition: {
      servingSize: '2 tacos with consommé (approx. 350 g)',
      calories: 620,
      macros: [
        { label: 'Protein',        value: '42 g',   percent: 84,  color: '#4ade80' },
        { label: 'Carbohydrates',  value: '38 g',   percent: 38,  color: '#facc15' },
        { label: 'Total Fat',      value: '34 g',   percent: 52,  color: '#f87171' },
        { label: 'Saturated Fat',  value: '14 g',   percent: 70,  color: '#fca5a5' },
        { label: 'Dietary Fibre',  value: '5 g',    percent: 20,  color: '#86efac' },
        { label: 'Sodium',         value: '840 mg', percent: 37,  color: '#7dd3fc' },
        { label: 'Sugars',         value: '4 g',    percent: 4,   color: '#fde68a' },
      ],
      vitamins: [
        { label: 'Vitamin C',  value: '28% DV' },
        { label: 'Iron',       value: '32% DV' },
        { label: 'Zinc',       value: '38% DV' },
        { label: 'Vitamin B6', value: '30% DV' },
      ],
      allergens: ['Milk'],
    },
  },

  // ─── 5. French Onion Soup ─────────────────────────────────────────────────
  {
    id: 'french-onion-soup',
    title: 'French Onion Soup',
    subtitle: 'Deep caramelised onions, rich beef broth, gruyère crown',
    category: 'french',
    description:
      'A Parisian bistro staple, French onion soup hinges on patience: onions caramelised for a full hour until they collapse into a dark, jammy, deeply sweet mass. Deglazed with cognac and white wine, finished with a rich beef broth, then crowned with a thick slice of crusty bread and a melted, bubbling dome of Gruyère — this is warming, timeless perfection.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80',
    imageAlt: 'French onion soup with melted gruyere cheese on top',
    videoId: 'O2J9GxpKQpM',
    videoTitle: 'Classic French Onion Soup — The Right Way',
    prepTime: '15 min',
    cookTime: '1 hr 30 min',
    totalTime: '1 hr 45 min',
    servings: 6,
    difficulty: 'Medium',
    tags: ['soup', 'French', 'vegetable', 'comfort food', 'winter'],
    chef: 'Chef Sophie Lefèvre',

    ingredients: [
      { group: 'Soup', items: [
        { amount: '1.5 kg', item: 'yellow onions (about 6 large)', note: 'halved and very thinly sliced' },
        { amount: '60 g', item: 'unsalted butter' },
        { amount: '2 tbsp', item: 'olive oil' },
        { amount: '1 tsp', item: 'fine sea salt' },
        { amount: '1/2 tsp', item: 'caster sugar', note: 'helps initiate caramelisation' },
        { amount: '3 cloves', item: 'garlic, minced' },
        { amount: '3 tbsp', item: 'cognac or brandy' },
        { amount: '250 ml', item: 'dry white wine' },
        { amount: '1.5 litres', item: 'good-quality beef stock' },
        { amount: '2 sprigs', item: 'fresh thyme' },
        { amount: '1', item: 'bay leaf' },
        { amount: '1 tsp', item: 'Worcestershire sauce' },
        { amount: 'to taste', item: 'salt and freshly ground black pepper' },
      ]},
      { group: 'Gruyère Crouton', items: [
        { amount: '6 thick slices', item: 'sourdough or baguette', note: 'toasted until very dry' },
        { amount: '300 g', item: 'Gruyère cheese, coarsely grated' },
        { amount: '30 g', item: 'Parmigiano-Reggiano, finely grated', note: 'optional, for extra depth' },
      ]},
    ],

    steps: [
      {
        step: 1,
        title: 'Begin caramelising the onions',
        instruction:
          'Melt butter with olive oil in a large, heavy-bottomed pot or Dutch oven over medium heat. Add all sliced onions, salt, and sugar. Stir to coat. Cook uncovered, stirring every 5–7 minutes, for the first 20 minutes as the onions soften and release their liquid.',
        tip: 'A wide, heavy pot is essential. The onions will initially seem overwhelming — they reduce by about 75%.',
        image: null,
      },
      {
        step: 2,
        title: 'Develop the deep caramel',
        instruction:
          'Reduce heat to medium-low. Continue cooking for another 35–40 minutes, scraping the bottom of the pot frequently as the fond (brown bits) builds up. The onions should turn a deep mahogany colour. If the pan dries out, add a splash of water to deglaze and prevent burning.',
        tip: 'Do not rush this. Pale golden onions make pale, sweet soup. Deep mahogany onions make magnificent soup.',
        image: null,
      },
      {
        step: 3,
        title: 'Add garlic, cognac, and wine',
        instruction:
          'Add the garlic and cook for 2 minutes. Carefully add the cognac (it may flame briefly — stand back) and stir, scraping all the fond from the bottom. Add the white wine and cook until fully reduced and the alcohol smell dissipates, about 5 minutes.',
        tip: 'The cognac deglazes all those precious caramelised bits from the pan — that\'s concentrated flavour.',
        image: null,
      },
      {
        step: 4,
        title: 'Build the broth',
        instruction:
          'Add the beef stock, thyme, bay leaf, and Worcestershire sauce. Bring to a boil, then reduce heat and simmer gently for 20–25 minutes. Remove thyme and bay leaf. Season with salt and pepper. Taste — the broth should be rich, slightly sweet, and deeply savory.',
        tip: 'Use the best beef stock you can find or make. The stock is the backbone of the soup.',
        image: null,
      },
      {
        step: 5,
        title: 'Prepare the cheese croutons',
        instruction:
          'Position the oven rack in the upper third. Preheat your oven to 200°C (400°F). Arrange oven-safe soup crocks on a baking sheet. Ladle hot soup into the crocks, filling to about 1 cm from the rim. Float a toasted bread slice on top of each. Generously mound Gruyère (and Parmigiano if using) over the bread, letting it hang over the edges.',
        tip: 'The cheese overhang is not accidental — it seals the rim and creates that dramatic, bubbling crown.',
        image: null,
      },
      {
        step: 6,
        title: 'Bake and broil',
        instruction:
          'Bake for 10 minutes. Then switch to the broiler on high and broil for 2–3 minutes, watching carefully, until the cheese is deeply golden, bubbly, and caramelised in spots. The rim will brown where the cheese meets the crock.',
        tip: 'Every broiler is different. Watch from the moment you switch it on — it can go from perfect to burnt in 30 seconds.',
        image: null,
      },
      {
        step: 7,
        title: 'Serve',
        instruction:
          'Carefully transfer the very hot crocks to heat-proof serving plates. Warn guests that the crocks are extremely hot. Serve immediately — the cheese deflates quickly.',
        tip: 'Use napkins around the hot crocks for safe handling.',
        image: null,
      },
    ],

    nutrition: {
      servingSize: '1 crock (approx. 450 g)',
      calories: 490,
      macros: [
        { label: 'Protein',        value: '22 g',   percent: 44,  color: '#4ade80' },
        { label: 'Carbohydrates',  value: '38 g',   percent: 38,  color: '#facc15' },
        { label: 'Total Fat',      value: '26 g',   percent: 40,  color: '#f87171' },
        { label: 'Saturated Fat',  value: '15 g',   percent: 75,  color: '#fca5a5' },
        { label: 'Dietary Fibre',  value: '4 g',    percent: 16,  color: '#86efac' },
        { label: 'Sodium',         value: '920 mg', percent: 40,  color: '#7dd3fc' },
        { label: 'Sugars',         value: '14 g',   percent: 14,  color: '#fde68a' },
      ],
      vitamins: [
        { label: 'Vitamin C',  value: '18% DV' },
        { label: 'Calcium',    value: '45% DV' },
        { label: 'Iron',       value: '12% DV' },
        { label: 'Vitamin B6', value: '15% DV' },
      ],
      allergens: ['Gluten', 'Milk'],
    },
  },

  // ─── 6. Pad Thai ──────────────────────────────────────────────────────────
  {
    id: 'pad-thai',
    title: 'Pad Thai',
    subtitle: 'Wok-charred rice noodles, tiger prawns, tamarind glaze',
    category: 'thai',
    description:
      'Authentic Pad Thai demands "wok hei" — the elusive breath of the wok that imparts a complex, slightly smoky char achievable only at very high heat. Every element is cooked separately and brought together in seconds. Tamarind paste provides the distinctive sour-sweet backbone, fish sauce adds umami depth, and palm sugar rounds it all into a harmonious whole.',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=1200&q=80',
    imageAlt: 'Pad Thai with prawns, bean sprouts, and peanuts',
    videoId: 'IkzZEzCOBbU',
    videoTitle: 'Restaurant Pad Thai at Home — Wok Technique',
    prepTime: '25 min',
    cookTime: '15 min',
    totalTime: '40 min',
    servings: 4,
    difficulty: 'Medium',
    tags: ['noodles', 'Thai', 'seafood', 'quick', 'Asian'],
    chef: 'Chef Noon Thongchai',

    ingredients: [
      { group: 'Noodles & Protein', items: [
        { amount: '300 g', item: 'dried flat rice noodles (3–5 mm wide)', note: 'soaked in room temp water for 30 min, drained' },
        { amount: '300 g', item: 'raw tiger prawns, peeled and deveined' },
        { amount: '200 g', item: 'extra-firm tofu', note: 'pressed, cut into 1 cm cubes' },
        { amount: '3 tbsp', item: 'neutral oil with high smoke point', note: 'divided' },
      ]},
      { group: 'Pad Thai Sauce', items: [
        { amount: '4 tbsp', item: 'tamarind paste', note: 'not concentrate — use block tamarind dissolved in warm water' },
        { amount: '3 tbsp', item: 'fish sauce', note: 'use soy sauce for vegan' },
        { amount: '2 tbsp', item: 'palm sugar', note: 'or brown sugar' },
        { amount: '1 tbsp', item: 'oyster sauce' },
        { amount: '1 tsp', item: 'white sugar' },
      ]},
      { group: 'Aromatics & Extras', items: [
        { amount: '3', item: 'shallots, thinly sliced' },
        { amount: '4 cloves', item: 'garlic, minced' },
        { amount: '3', item: 'large eggs' },
        { amount: '2 stalks', item: 'Chinese chives or spring onion greens', note: 'cut into 2 cm lengths' },
        { amount: '120 g', item: 'bean sprouts, divided' },
        { amount: '3 tbsp', item: 'dried shrimp', note: 'optional; adds authentic flavour' },
        { amount: '2 tbsp', item: 'salted radish (chai poh)', note: 'rinsed and roughly chopped' },
      ]},
      { group: 'Garnish (served alongside)', items: [
        { amount: '60 g', item: 'roasted unsalted peanuts, crushed' },
        { amount: '1 tsp', item: 'dried chilli flakes' },
        { amount: '2 tbsp', item: 'sugar (in a small dish)' },
        { amount: '2 tbsp', item: 'fish sauce (in a small dish)' },
        { amount: '2', item: 'limes, cut into wedges' },
        { amount: '60 g', item: 'fresh bean sprouts' },
      ]},
    ],

    steps: [
      {
        step: 1,
        title: 'Mix the sauce',
        instruction:
          'Combine tamarind paste, fish sauce, palm sugar, oyster sauce, and white sugar in a small bowl. Stir until the sugar dissolves. Taste: it should be simultaneously sour, salty, and sweet with no single note dominating. Adjust as needed.',
        tip: 'The sauce is the soul of Pad Thai. Taste it multiple times and adjust before you start cooking.',
        image: null,
      },
      {
        step: 2,
        title: 'Fry the tofu',
        instruction:
          'Heat a wok or large skillet over maximum heat until smoking. Add 1 tbsp oil. Add tofu cubes in a single layer and do not move for 90 seconds. Toss and cook for another 60 seconds until golden on most sides. Remove and set aside.',
        tip: 'A really hot wok is crucial — this is one situation where you cannot have too much heat.',
        image: null,
      },
      {
        step: 3,
        title: 'Stir-fry aromatics',
        instruction:
          'Add another tbsp of oil to the wok. Add shallots and garlic; stir-fry for 60 seconds until fragrant and beginning to colour. Add dried shrimp and salted radish; stir-fry for 30 seconds.',
        tip: 'Keep everything moving constantly — aromatics go from golden to burnt very quickly at this heat.',
        image: null,
      },
      {
        step: 4,
        title: 'Add noodles and sauce',
        instruction:
          'Add the drained rice noodles and all of the Pad Thai sauce. Toss vigorously with tongs or chopsticks for 2 minutes, ensuring every noodle is coated. If the noodles are sticking, add 2 tbsp of water. They should be tender-chewy with a slight bite.',
        tip: 'Never let the noodles sit still — they will stick and burn. Constant movement is essential.',
        image: null,
      },
      {
        step: 5,
        title: 'Add prawns and eggs',
        instruction:
          'Push the noodles to one side of the wok. Add the prawns to the clear side and cook for 60–90 seconds until pink and just cooked. Push everything to one side again, add a small drizzle of oil, and crack in the eggs. Scramble briefly then fold the noodles over the egg before it fully sets — you want large, soft curds incorporated throughout.',
        tip: 'The eggs should not be fully cooked before mixing — they finish cooking from the residual heat of the noodles.',
        image: null,
      },
      {
        step: 6,
        title: 'Finish and plate',
        instruction:
          'Add the Chinese chives (or spring onion), half the bean sprouts, and the fried tofu. Toss everything together for 30 seconds. Plate immediately — Pad Thai waits for no one.',
        tip: 'For maximum wok hei, resist the urge to add too much at once. Cook in smaller batches if possible.',
        image: null,
      },
      {
        step: 7,
        title: 'Serve with garnishes',
        instruction:
          'Serve with the garnish tray: crushed peanuts, dried chilli, fresh bean sprouts, lime wedges, and small dishes of sugar and fish sauce so diners can adjust seasoning themselves. This self-seasoning ritual is integral to authentic Pad Thai.',
        tip: 'The four-condiment seasoning set (sugar, chilli, fish sauce, vinegar with chilli) is the Thai way — always season your own dish.',
        image: null,
      },
    ],

    nutrition: {
      servingSize: '1 plate (approx. 400 g)',
      calories: 590,
      macros: [
        { label: 'Protein',        value: '38 g',   percent: 76,  color: '#4ade80' },
        { label: 'Carbohydrates',  value: '68 g',   percent: 68,  color: '#facc15' },
        { label: 'Total Fat',      value: '16 g',   percent: 25,  color: '#f87171' },
        { label: 'Saturated Fat',  value: '3 g',    percent: 15,  color: '#fca5a5' },
        { label: 'Dietary Fibre',  value: '3 g',    percent: 12,  color: '#86efac' },
        { label: 'Sodium',         value: '1150 mg',percent: 50,  color: '#7dd3fc' },
        { label: 'Sugars',         value: '12 g',   percent: 12,  color: '#fde68a' },
      ],
      vitamins: [
        { label: 'Vitamin C',  value: '15% DV' },
        { label: 'Iron',       value: '20% DV' },
        { label: 'Selenium',   value: '45% DV' },
        { label: 'Vitamin B12',value: '18% DV' },
      ],
      allergens: ['Gluten', 'Eggs', 'Crustaceans', 'Fish', 'Soy', 'Peanuts'],
    },
  },

  // ─── 7. Chocolate Lava Cake ───────────────────────────────────────────────
  {
    id: 'chocolate-lava-cake',
    title: 'Chocolate Lava Cake',
    subtitle: 'Molten dark chocolate centre, crisp shell, vanilla bean ice cream',
    category: 'desserts',
    description:
      'The molten lava cake (fondant au chocolat) is a precision dessert — 12 minutes in the oven stands between a gloriously flowing centre and a fully-set chocolate cake. Use the best dark chocolate you can find (70% cacao minimum), give them exactly the right time, and you will be rewarded with a dessert that never fails to impress.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200&q=80',
    imageAlt: 'Chocolate lava cake cut open with molten centre flowing out',
    videoId: 'gxHYAjAQR8k',
    videoTitle: 'Foolproof Molten Chocolate Lava Cake',
    prepTime: '20 min',
    cookTime: '12 min',
    totalTime: '32 min',
    servings: 6,
    difficulty: 'Medium',
    tags: ['dessert', 'chocolate', 'French', 'dinner party', 'make-ahead'],
    chef: 'Pâtissier Amélie Fontaine',

    ingredients: [
      { group: 'Lava Cakes', items: [
        { amount: '200 g', item: '70% dark chocolate, finely chopped', note: 'Valrhona, Callebaut, or Green & Black\'s recommended' },
        { amount: '120 g', item: 'unsalted butter', note: 'plus extra for greasing' },
        { amount: '4 large', item: 'eggs' },
        { amount: '4 large', item: 'egg yolks', note: 'in addition to the whole eggs' },
        { amount: '120 g', item: 'icing sugar (powdered sugar), sifted' },
        { amount: '60 g', item: 'plain flour, sifted', note: 'plus extra for dusting' },
        { amount: '1/4 tsp', item: 'fine sea salt' },
        { amount: '1 tsp', item: 'vanilla bean paste or extract' },
        { amount: '1 tbsp', item: 'good-quality cocoa powder', note: 'for dusting ramekins' },
      ]},
      { group: 'To Serve', items: [
        { amount: '6 scoops', item: 'best-quality vanilla bean ice cream' },
        { amount: 'as needed', item: 'fresh raspberries or strawberries' },
        { amount: 'to dust', item: 'icing sugar' },
        { amount: 'as needed', item: 'fresh mint leaves', note: 'optional garnish' },
      ]},
    ],

    steps: [
      {
        step: 1,
        title: 'Prepare the ramekins',
        instruction:
          'Generously butter 6 individual ramekins (150–180 ml capacity). Dust with cocoa powder, tapping out the excess. The coating must be thorough — any bare spots will cause the cakes to stick. Place on a baking tray and refrigerate.',
        tip: 'Cocoa powder is used instead of flour so you don\'t see white patches on the finished dark cake.',
        image: null,
      },
      {
        step: 2,
        title: 'Melt chocolate and butter',
        instruction:
          'Place chocolate and butter in a heatproof bowl set over a pot of barely simmering water (bain-marie). Stir gently until completely melted and combined. Remove from heat and allow to cool to room temperature — about 10 minutes. Do not let any water enter the bowl.',
        tip: 'You can also melt in the microwave in 30-second bursts at 50% power, stirring between each. Stop when just a few lumps remain and stir to finish.',
        image: null,
      },
      {
        step: 3,
        title: 'Whip the eggs and sugar',
        instruction:
          'In a large bowl, whisk together the eggs, egg yolks, and icing sugar until thick, pale, and the mixture has doubled in volume — about 3–4 minutes with an electric hand whisk. The mixture should fall from the whisk in a thick ribbon.',
        tip: 'This aeration is what gives the cakes their delicate structure while keeping the centre liquid.',
        image: null,
      },
      {
        step: 4,
        title: 'Combine mixtures',
        instruction:
          'Pour the cooled chocolate mixture and vanilla into the egg mixture. Gently fold with a large spatula until just combined and uniform in colour. Sift the flour and salt over the top and fold in with the minimum number of strokes — do not overmix.',
        tip: 'Overmixing develops gluten and can tighten the batter, affecting the molten centre. Fold until you just see no more flour streaks.',
        image: null,
      },
      {
        step: 5,
        title: 'Fill and refrigerate',
        instruction:
          'Pour the batter into the prepared ramekins, filling each about 3/4 full. Cover with cling film and refrigerate for at least 30 minutes, or up to 24 hours. This resting period develops flavour and allows the gluten to relax.',
        tip: 'You can make these a day ahead for a dinner party — the perfect make-ahead dessert.',
        image: null,
      },
      {
        step: 6,
        title: 'Bake to perfection',
        instruction:
          'Preheat oven to 200°C (390°F / Gas Mark 6). Remove ramekins from fridge 15 minutes before baking. Bake on the upper-middle rack for exactly 11–13 minutes. The edges should be set and slightly pulling away from the sides; the centre should still have a visible jiggle when gently shaken.',
        tip: 'Know your oven! The first time you make this, bake one as a test. 11 min = very liquid centre; 12 min = ideal flowing lava; 13 min = thick, barely flowing lava.',
        image: null,
      },
      {
        step: 7,
        title: 'Turn out and serve',
        instruction:
          'Remove from the oven. Let stand for exactly 60 seconds — no longer. Run a thin knife around the inside edge of each ramekin. Place a dessert plate over the top, invert quickly and confidently, then lift the ramekin straight up. Dust with icing sugar, add a scoop of ice cream, fresh berries, and serve within 2 minutes.',
        tip: 'Confidence on the inversion is key. A hesitant, slow inversion risks the cake collapsing. Flip it decisively.',
        image: null,
      },
    ],

    nutrition: {
      servingSize: '1 lava cake with ice cream (approx. 200 g)',
      calories: 540,
      macros: [
        { label: 'Protein',        value: '9 g',    percent: 18,  color: '#4ade80' },
        { label: 'Carbohydrates',  value: '52 g',   percent: 52,  color: '#facc15' },
        { label: 'Total Fat',      value: '34 g',   percent: 52,  color: '#f87171' },
        { label: 'Saturated Fat',  value: '20 g',   percent: 100, color: '#fca5a5' },
        { label: 'Dietary Fibre',  value: '3 g',    percent: 12,  color: '#86efac' },
        { label: 'Sodium',         value: '180 mg', percent: 8,   color: '#7dd3fc' },
        { label: 'Sugars',         value: '40 g',   percent: 40,  color: '#fde68a' },
      ],
      vitamins: [
        { label: 'Iron',       value: '20% DV' },
        { label: 'Magnesium',  value: '18% DV' },
        { label: 'Calcium',    value: '10% DV' },
        { label: 'Riboflavin', value: '12% DV' },
      ],
      allergens: ['Gluten', 'Eggs', 'Milk', 'Soy (in chocolate)'],
    },
  },

  // ─── 8. Sushi Rolls ──────────────────────────────────────────────────────
  {
    id: 'homemade-sushi-rolls',
    title: 'Homemade Sushi Rolls',
    subtitle: 'California rolls, spicy tuna, and vegetarian futomaki',
    category: 'japanese',
    description:
      'Sushi at home is more accessible than most people think. The key lies in properly seasoned sushi rice — the soul of all sushi. With well-cooked, correctly vinegared rice and fresh fillings, you can create restaurant-quality rolls in your own kitchen. This guide covers three classic styles: California (uramaki), spicy tuna, and a vibrant vegetarian futomaki.',
    image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=1200&q=80',
    imageAlt: 'Assorted homemade sushi rolls on a wooden board',
    videoId: 'I5DpSRLjSHk',
    videoTitle: 'Perfect Sushi Rice & How to Roll Sushi at Home',
    prepTime: '45 min',
    cookTime: '30 min',
    totalTime: '1 hr 15 min',
    servings: 4,
    difficulty: 'Medium',
    tags: ['Japanese', 'seafood', 'rice', 'sushi', 'dinner party'],
    chef: 'Chef Hiroshi Tanaka',

    ingredients: [
      { group: 'Sushi Rice', items: [
        { amount: '400 g', item: 'Japanese short-grain sushi rice' },
        { amount: '480 ml', item: 'cold water' },
        { amount: '60 ml', item: 'rice wine vinegar' },
        { amount: '2 tbsp', item: 'caster sugar' },
        { amount: '1 tsp', item: 'fine sea salt' },
      ]},
      { group: 'California Roll (Uramaki)', items: [
        { amount: '4 sheets', item: 'nori (dried seaweed), half-sheets' },
        { amount: '150 g', item: 'imitation crab (surimi) or real king crab' },
        { amount: '1', item: 'ripe avocado, sliced' },
        { amount: '1/2', item: 'English cucumber, julienned' },
        { amount: '2 tbsp', item: 'toasted sesame seeds' },
        { amount: '2 tbsp', item: 'tobiko (flying fish roe)', note: 'optional garnish' },
      ]},
      { group: 'Spicy Tuna Roll', items: [
        { amount: '200 g', item: 'sashimi-grade tuna, finely diced' },
        { amount: '2 tbsp', item: 'Japanese mayonnaise (Kewpie)' },
        { amount: '1–2 tsp', item: 'sriracha sauce', note: 'adjust to heat preference' },
        { amount: '1 tsp', item: 'sesame oil' },
        { amount: '1 tsp', item: 'togarashi or chilli flakes' },
        { amount: '2 stalks', item: 'spring onion, thinly sliced' },
      ]},
      { group: 'Condiments & Serving', items: [
        { amount: '4 tbsp', item: 'soy sauce or tamari' },
        { amount: '2 tbsp', item: 'pickled ginger (gari)' },
        { amount: '1 tbsp', item: 'wasabi paste', note: 'adjust to taste' },
      ]},
    ],

    steps: [
      {
        step: 1,
        title: 'Wash and cook the rice',
        instruction:
          'Rinse the sushi rice in cold water, gently agitating, until the water runs clear — typically 4–5 rinses. This removes surface starch that would make the rice gluey. Add to a saucepan with the 480 ml cold water. Bring to a boil, cover tightly, reduce heat to the very lowest setting, and cook for 13 minutes. Remove from heat and let steam with the lid on for a further 10 minutes. Do not lift the lid during cooking.',
        tip: 'The absorption method is key. Never stir sushi rice while cooking — it breaks the grains.',
        image: null,
      },
      {
        step: 2,
        title: 'Season the sushi rice',
        instruction:
          'Warm the rice wine vinegar with the sugar and salt (do not boil) until dissolved. Transfer the cooked rice to a wide, flat wooden or non-metallic bowl (hangiri). Pour the vinegar mixture over the rice in a thin stream. Using a rice paddle or flat spatula, fold the vinegar through the rice using slicing motions while fanning it to cool it quickly. The rice should be shiny, slightly sticky, and at body temperature.',
        tip: 'Fan vigorously while folding — the rapid cooling gives sushi rice its characteristic gloss.',
        image: null,
      },
      {
        step: 3,
        title: 'Prepare fillings',
        instruction:
          'Mix diced tuna with Kewpie mayo, sriracha, sesame oil, and spring onion. Taste and adjust spice level. Slice the avocado and cucumber. Keep all fillings ready at room temperature — cold fillings make rolling harder and can crack the nori.',
        tip: 'Toss avocado slices lightly in lemon juice to prevent browning.',
        image: null,
      },
      {
        step: 4,
        title: 'Set up your rolling station',
        instruction:
          'Place a bamboo rolling mat on your work surface. Have a bowl of cold water with a splash of rice wine vinegar (tezu) ready for wetting your hands. Lay out all fillings, the rice, nori sheets, sesame seeds, and cling film. For uramaki (inside-out rolls), cover the bamboo mat with cling film.',
        tip: 'Keep your hands consistently damp with tezu to prevent rice from sticking to your fingers.',
        image: null,
      },
      {
        step: 5,
        title: 'Roll the California rolls (Uramaki)',
        instruction:
          'Place a half-sheet of nori (shiny side down) on the cling-film-covered mat. With damp hands, spread a thin, even layer of sushi rice over the entire nori, leaving no gaps. Sprinkle with sesame seeds. Flip the rice-covered nori over so the rice faces down on the mat. Arrange crab, avocado, and cucumber in a line 2 cm from the edge nearest you. Lift the mat with your thumbs, rolling away from you, pressing firmly to keep the roll tight. Seal the edge. Roll in tobiko if using.',
        tip: 'A tight, even roll is the goal. Practice makes perfect — your first roll may not be beautiful but will taste just as good.',
        image: null,
      },
      {
        step: 6,
        title: 'Roll the spicy tuna rolls',
        instruction:
          'Place nori shiny-side down on the (uncovered) mat. Spread rice as before. Arrange spicy tuna in a line near the bottom edge. Roll tightly, using the mat to guide and compress. These are traditional maki (rice on the outside — nori visible).',
        tip: 'Don\'t overfill. A common beginner mistake — less filling makes rolling far easier.',
        image: null,
      },
      {
        step: 7,
        title: 'Slice and plate',
        instruction:
          'Using a sharp, wet knife, slice each roll into 8 equal pieces using a single, confident sawing motion. Clean and re-wet the knife between each cut. Arrange on a plate with pickled ginger and wasabi on the side. Serve with soy sauce for dipping.',
        tip: 'A dull or dry knife crushes sushi rolls. Keep a glass of water nearby and wipe the blade between cuts.',
        image: null,
      },
    ],

    nutrition: {
      servingSize: '8 pieces / half roll (approx. 250 g)',
      calories: 340,
      macros: [
        { label: 'Protein',        value: '18 g',   percent: 36,  color: '#4ade80' },
        { label: 'Carbohydrates',  value: '52 g',   percent: 52,  color: '#facc15' },
        { label: 'Total Fat',      value: '8 g',    percent: 12,  color: '#f87171' },
        { label: 'Saturated Fat',  value: '1 g',    percent: 5,   color: '#fca5a5' },
        { label: 'Dietary Fibre',  value: '3 g',    percent: 12,  color: '#86efac' },
        { label: 'Sodium',         value: '680 mg', percent: 30,  color: '#7dd3fc' },
        { label: 'Sugars',         value: '6 g',    percent: 6,   color: '#fde68a' },
      ],
      vitamins: [
        { label: 'Omega-3',    value: '65% DV' },
        { label: 'Vitamin D',  value: '12% DV' },
        { label: 'Iodine',     value: '35% DV' },
        { label: 'Selenium',   value: '28% DV' },
      ],
      allergens: ['Fish', 'Crustaceans', 'Gluten (soy sauce)', 'Sesame', 'Eggs (mayo)'],
    },
  },

  // ─── Grammy's Caribbean Curry with Added Gut Support ─────────────────────
  {
    id: 'grammys-caribbean-curry',
    title: "Grammy's Caribbean Curry",
    subtitle: 'With added gut support',
    category: 'caribbean',
    description:
      "A rich, fragrant curry passed down from Grammy, rooted in the bold flavours of the Caribbean — scotch bonnet heat, allspice warmth, fresh thyme, and creamy coconut milk. Every ingredient has been chosen not just for flavour but for your gut: anti-inflammatory turmeric and ginger, prebiotic-rich sweet potato and chickpeas, fibre-packed callaloo or spinach, and a swirl of live coconut kefir stirred in off the heat to keep those probiotics alive. Soul food that loves your microbiome back.",
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80',
    imageAlt: "Grammy's Caribbean Curry — golden coconut broth, sweet potato and chickpeas",

    video: {
      type:  'instagram',
      url:   'https://www.instagram.com/reel/DVq-JlUiJut/',
      title: "Grammy's Caribbean Curry — Instagram Reel",
    },

    prepTime:   '20 min',
    cookTime:   '50 min',
    totalTime:  '1 hr 10 min',
    servings:   4,
    difficulty: 'Medium',
    tags: ['caribbean', 'curry', 'gut health', 'turmeric', 'coconut', 'gluten-free', 'dairy-free'],
    chef: 'Your Name',

    ingredients: [
      { group: 'Marinade', items: [
        { amount: '800 g',   item: 'bone-in chicken thighs',              note: 'skin on for maximum flavour; remove if preferred' },
        { amount: '2 tbsp',  item: 'Caribbean curry powder',               note: 'use a Jamaican-style blend with allspice and scotch bonnet' },
        { amount: '1 tsp',   item: 'ground turmeric',                      note: 'gut-supportive and anti-inflammatory' },
        { amount: '1 tbsp',  item: 'fresh ginger, finely grated',          note: 'aids digestion and reduces bloating' },
        { amount: '4 cloves',item: 'garlic, crushed' },
        { amount: '½ tsp',   item: 'ground allspice' },
        { amount: '1 tsp',   item: 'fine sea salt' },
        { amount: '1 tbsp',  item: 'apple cider vinegar',                  note: 'raw, with the mother — supports stomach acid and gut lining' },
      ]},
      { group: 'Curry Base', items: [
        { amount: '2 tbsp',  item: 'coconut oil' },
        { amount: '1 large', item: 'brown onion, finely diced' },
        { amount: '3 cloves',item: 'garlic, sliced' },
        { amount: '1 tbsp',  item: 'fresh ginger, grated' },
        { amount: '1',       item: 'scotch bonnet chilli',                 note: 'whole for mild heat, pierced for medium, finely chopped for hot' },
        { amount: '4 sprigs',item: 'fresh thyme' },
        { amount: '2',       item: 'spring onions (scallions), sliced' },
        { amount: '2',       item: 'medium tomatoes, roughly chopped' },
        { amount: '400 ml',  item: 'full-fat coconut milk',                note: 'shake the can well before opening' },
        { amount: '300 ml',  item: 'low-sodium chicken or vegetable stock' },
      ]},
      { group: 'Gut-Support Additions', items: [
        { amount: '1 large', item: 'sweet potato (approx. 350 g), cubed',  note: 'skin on for extra prebiotic fibre — just scrub well' },
        { amount: '400 g',   item: 'tin chickpeas, drained and rinsed',    note: 'prebiotic fibre feeds beneficial gut bacteria' },
        { amount: '100 g',   item: 'callaloo or baby spinach',             note: 'callaloo is traditional; spinach is a great substitute' },
        { amount: '4 tbsp',  item: 'live coconut kefir',                   note: 'stir in off the heat to preserve the live cultures' },
        { amount: '1 tsp',   item: 'ground turmeric',                      note: 'second hit of turmeric — add to the pot as it simmers' },
      ]},
      { group: 'To Serve', items: [
        { amount: '',        item: 'brown rice or cauliflower rice',        note: 'brown rice adds extra fibre; cauliflower rice keeps it grain-free' },
        { amount: '',        item: 'fresh coriander (cilantro), roughly torn' },
        { amount: '',        item: 'lime wedges' },
        { amount: '',        item: 'scotch bonnet hot sauce',               note: 'optional, for table heat' },
      ]},
    ],

    steps: [
      {
        step: 1,
        title: 'Marinate the chicken',
        instruction:
          'Combine the curry powder, turmeric, grated ginger, crushed garlic, allspice, salt, and apple cider vinegar in a large bowl. Add the chicken thighs and toss to coat every surface. Cover and marinate in the fridge for at least 30 minutes — overnight gives the best flavour and the ACV begins to tenderise the meat.',
        tip: 'The apple cider vinegar in the marinade is not just for flavour — the acetic acid helps break down the protein fibres for more tender chicken and supports stomach acid production when you eat it.',
        image: null,
      },
      {
        step: 2,
        title: 'Brown the chicken',
        instruction:
          'Heat the coconut oil in a large, heavy-based pot or Dutch oven over medium-high heat. Remove the chicken from the marinade (reserve the marinade) and brown the pieces skin-side down for 4–5 minutes until deep golden. Flip and brown the other side for 2–3 minutes. Remove and set aside — the chicken will finish cooking in the sauce.',
        tip: "Don't rush the browning. The Maillard reaction creates the deep flavour base that carries the whole dish. A crowded pan steams rather than sears — work in two batches if needed.",
        image: null,
      },
      {
        step: 3,
        title: 'Build the aromatic base',
        instruction:
          'Reduce heat to medium. In the same pot, add the diced onion and cook for 5–6 minutes until soft and translucent. Add the sliced garlic, grated ginger, whole (or chopped) scotch bonnet, spring onions, and thyme sprigs. Cook for another 2 minutes, stirring constantly. Add the chopped tomatoes and cook until they break down and the mixture becomes jammy, about 4 minutes.',
        tip: 'Keeping the scotch bonnet whole gives you Caribbean flavour without overwhelming heat — the oils infuse the broth without releasing full capsaicin. Remove before serving for family-friendly heat.',
        image: null,
      },
      {
        step: 4,
        title: 'Add liquid and return the chicken',
        instruction:
          'Pour in the reserved marinade, coconut milk, and stock. Stir well, scraping up any browned bits from the base of the pot — that is all flavour. Add the second teaspoon of turmeric and stir through. Return the browned chicken to the pot, nestling the pieces into the broth. Bring to a gentle boil, then reduce to a low simmer, partially cover, and cook for 20 minutes.',
        tip: 'Scraping the fond (the browned bits on the bottom) is one of the most important flavour steps in any braise. Do not skip it.',
        image: null,
      },
      {
        step: 5,
        title: 'Add the gut-support vegetables',
        instruction:
          'Add the cubed sweet potato and drained chickpeas to the pot. Stir gently, making sure the vegetables are submerged in the broth. Continue simmering uncovered for 15–18 minutes until the sweet potato is tender when pierced with a knife and the sauce has thickened slightly. Remove the thyme sprigs and the scotch bonnet if you used it whole.',
        tip: 'Sweet potato skin-on adds resistant starch — a type of prebiotic fibre that feeds Bifidobacterium and Lactobacillus strains in your gut. Just scrub the skin thoroughly before cubing.',
        image: null,
      },
      {
        step: 6,
        title: 'Wilt the greens and add kefir',
        instruction:
          'Remove the pot from the heat. Stir in the callaloo or baby spinach and let it wilt in the residual heat for 1–2 minutes. Once the pot is no longer actively simmering, stir in the coconut kefir one tablespoon at a time until fully incorporated. Taste and adjust salt.',
        tip: 'This is the most important gut-support step: kefir must go in off the heat. Temperatures above 40 °C kill the live cultures. Let the pot cool slightly and the kefir will swirl through the creamy coconut broth beautifully without curdling.',
        image: null,
      },
      {
        step: 7,
        title: 'Plate and serve',
        instruction:
          'Spoon the curry over brown rice or cauliflower rice. Top with fresh torn coriander and a squeeze of fresh lime. Serve with extra scotch bonnet sauce at the table. The curry keeps for 3 days in the fridge — the flavours deepen overnight.',
        tip: 'Add the kefir fresh when reheating leftovers rather than reheating it with the curry, so the live cultures are preserved in every serving.',
        image: null,
      },
    ],

    nutrition: {
      servingSize: '1 bowl (approx. 450 g, without rice)',
      calories: 545,
      macros: [
        { label: 'Protein',        value: '38 g',   percent: 38,  color: '#4ade80' },
        { label: 'Carbohydrates',  value: '42 g',   percent: 32,  color: '#facc15' },
        { label: 'Total Fat',      value: '24 g',   percent: 24,  color: '#f87171' },
        { label: 'Saturated Fat',  value: '16 g',   percent: 15,  color: '#fca5a5' },
        { label: 'Dietary Fibre',  value: '9 g',    percent: 30,  color: '#86efac' },
        { label: 'Sodium',         value: '620 mg', percent: 27,  color: '#7dd3fc' },
        { label: 'Sugars',         value: '8 g',    percent: 9,   color: '#fde68a' },
      ],
      vitamins: [
        { label: 'Vitamin A',      value: '95% DV',  note: 'from sweet potato and callaloo' },
        { label: 'Vitamin C',      value: '40% DV',  note: 'from scotch bonnet and tomato' },
        { label: 'Iron',           value: '28% DV',  note: 'from chickpeas and greens' },
        { label: 'Curcumin',       value: 'High',    note: 'anti-inflammatory compound from turmeric' },
        { label: 'Live Cultures',  value: '~1 billion CFU', note: 'from coconut kefir — add off heat to preserve' },
        { label: 'Potassium',      value: '32% DV',  note: 'from sweet potato and coconut milk' },
      ],
      allergens: ['Tree nuts (coconut)'],
    },
  },
]

export default recipes
