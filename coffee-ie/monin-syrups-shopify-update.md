# /collections/monin-syrups — Shopify update pack

Page chosen: `/collections/monin-syrups` (priority page in the brief: 57% of Monin clicks, "monin syrup" at Ahrefs position 4, plus the "monin" and "coffee syrup" clusters agreed 12 Nov).

Where: Shopify admin → Products → Collections → Monin Syrups.

## 1. Fields to change

| Shopify field | New value |
| --- | --- |
| Title (renders as H1) | Monin Coffee Syrups |
| Search engine listing → Page title | Monin Syrups Ireland \| Coffee Syrups & Flavours \| Coffee.ie |
| Search engine listing → Meta description | Shop Monin coffee syrups in Ireland: vanilla, caramel, hazelnut, sugar-free and seasonal flavours in 25cl, 70cl and 1L bottles, plus pumps. |
| URL handle | **Leave as `monin-syrups`.** Don't tick any redirect box; nothing changes. |

Check before saving: if the theme menu or breadcrumbs use the collection title, the nav label changes to "Monin Coffee Syrups" too.

## 2. Description (above grid): paste into the HTML (`<>`) view

Published version: unconfirmed facts removed, so this can go live now.

```html
<p>Monin syrups add flavour to coffee, lattes, hot chocolate, iced drinks, lemonades and cocktails. Shop the range at Coffee.ie, from vanilla, caramel and hazelnut to <a href="/collections/monin-sugar-free">sugar-free</a> and seasonal flavours, in 25cl, 70cl and 1L bottles with matching pumps, delivered across Ireland.</p>
```

## 3. Below-grid content: hold until facts are confirmed

The default collection description renders **above** the product grid. Below-grid content needs a theme section or a metafield (e.g. `custom.below_grid_html`) output under the grid in the collection template. Paste this there once it exists.

Links are only on handles confirmed in the brief. The other flavours still need their handles looked up.

```html
<h2>Shop Monin syrups by flavour</h2>
<ul>
  <li><strong>Classic coffee:</strong> <a href="/products/monin-vanilla-syrup">Vanilla</a>, <a href="/products/monin-caramel-syrup">Caramel</a>, Hazelnut, Salted Caramel, Chocolate, White Chocolate, <a href="/products/monin-irish-syrup">Irish</a>, Praline, Roasted Hazelnut, Nut-Free Hazelnut</li>
  <li><strong>Dessert:</strong> Tiramisu, Crème Brûlée, Chocolate Cookie, Honeycomb</li>
  <li><strong>Seasonal:</strong> <a href="/products/monin-pumkin-spice-syrup-1-ltr">Pumpkin Spice</a>, Gingerbread, Winter Spice, Cinnamon</li>
  <li><strong>Tea and lemonade:</strong> <a href="/products/monin-chai-syrup">Chai</a>, Matcha Green Tea, Peach Tea, Lemon Tea, Cloudy Lemonade</li>
  <li><strong>Fruit and floral:</strong> <a href="/products/monin-strawberry-syrup-70-cl">Strawberry</a>, Raspberry, Coconut, Rose, Elderflower, Mint</li>
  <li><strong>Bar:</strong> Triple Sec, Pure Sugar Cane</li>
  <li><strong>Sugar-free:</strong> <a href="/products/monin-sugar-free-vanilla-syrup">Vanilla</a>, <a href="/products/monin-sugar-free-caramel-syrup-1-ltr">Caramel</a>, <a href="/products/monin-sugar-free-hazelnut-syrup">Hazelnut</a>. See the full <a href="/collections/monin-sugar-free">Monin sugar-free range</a>.</li>
</ul>

<h2>Seasonal pick: winter flavours</h2>
<p>Gingerbread, Winter Spice and Cinnamon for festive lattes and hot chocolates.</p>
<!-- Add 3 product cards. Rotate: Sep–Oct Pumpkin Spice; May–Aug Cloudy Lemonade, Peach Tea, Lemon Tea. -->

<h2>Bottle sizes and pumps</h2>
<p>25cl bottles suit trying a new flavour at home; 70cl and 1L suit regular use and cafés. Pumps are sold separately: the glass bottle pump fits 70cl glass bottles, and the <a href="/products/monin-plastic-bottle-pump">plastic bottle pump</a> fits [CONFIRM: 1L] bottles.</p>

<h2>Monin sugar-free syrups</h2>
<p>Coffee.ie stocks Monin sugar-free vanilla, caramel and hazelnut syrups, the same flavours with [CONFIRM: no added sugar]. Browse the full <a href="/collections/monin-sugar-free">Monin sugar-free range</a>.</p>

<h2>For cafés and trade</h2>
<p>[CONFIRM WITH MATT: wholesale route, wording and link.]</p>

<h2>Monin syrup FAQs</h2>
<h3>What are Monin syrups?</h3>
<p>Monin is a French brand, founded in Bourges in 1912, that makes flavoured syrups for coffee, tea, lemonades and cocktails.</p>
<h3>Where can I buy Monin syrup in Ireland?</h3>
<p>Coffee.ie stocks [COUNT] Monin syrup flavours online, with delivery across Ireland in [X] working days.</p>
<h3>Which Monin syrup is best for coffee?</h3>
<p>Vanilla, caramel and hazelnut are the most popular for lattes and cappuccinos. Salted caramel and white chocolate suit richer, dessert-style drinks.</p>
<h3>Does Monin make sugar-free syrup?</h3>
<p>Yes. Coffee.ie stocks Monin sugar-free vanilla, caramel and hazelnut.</p>
<h3>How much Monin syrup goes in a coffee?</h3>
<p>[CONFIRM from label or Monin trade sheet.]</p>
<h3>Do Monin syrups come with a pump?</h3>
<p>No, pumps are sold separately. Choose the glass pump for 70cl glass bottles or the plastic pump for [CONFIRM: 1L] bottles.</p>
<h3>What's the difference between Monin syrup and sauce?</h3>
<p>Syrups are thin and mix into hot or cold drinks. Sauces are thicker, for mochas, drizzles and desserts. See <a href="/collections/monin-sauces">Monin sauces</a>.</p>
```

## 4. After saving

- [ ] View the live page on desktop and mobile: H1, intro and grid all render (this ties into the brief's desktop ranking-gap check).
- [ ] GSC → URL Inspection → Request indexing for `/collections/monin-syrups`.
- [ ] Note the go-live date for the 8- and 12-week KPI review.
