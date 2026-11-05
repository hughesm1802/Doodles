// What happens to each output type: how easy it is to act on (the E in ICE),
// where the draft goes on approval (suggest-only hand-off), and how the
// result is measured (feedback loop). Mirrors the MVP spec tables.

export const OUTPUTS = {
  social: {
    label: 'Social / PR post', ease: 5,
    handoff: 'Copy + image spec ready to paste (Buffer / Meta draft later)',
    measure: { metric: 'Referral sessions, branded search impressions', source: 'GA4, GSC', windows: [14], win: 'Above the store’s trailing average' },
  },
  note: {
    label: 'Customer thank-you', ease: 5,
    handoff: 'Card text ready to print. Private, never posted',
    measure: { metric: 'Repeat order from the customer', source: 'Shopify', windows: [90], win: 'Customer orders again within 90 days' },
  },
  email: {
    label: 'Email campaign', ease: 4,
    handoff: 'Copy block ready to paste (Klaviyo campaign draft in Phase 2)',
    measure: { metric: 'Revenue per recipient', source: 'Klaviyo', windows: [7], win: 'Beats the store’s trailing 90-day average' },
  },
  bundle: {
    label: 'Bundle / joint promo', ease: 4,
    handoff: 'Step-by-step bundle setup notes for Shopify',
    measure: { metric: 'Bundle orders, AOV', source: 'Shopify', windows: [28], win: 'AOV or pair revenue up vs the previous 28 days' },
  },
  page: {
    label: 'Page optimisation', ease: 3,
    handoff: 'Change list for the page: title, meta, FAQ block, internal links',
    measure: { metric: 'Avg position + CTR on target queries', source: 'GSC', windows: [28, 56], win: 'Position improves ≥ 3 places or CTR up ≥ 20%' },
  },
  blog: {
    label: 'Blog post / FAQ', ease: 3,
    handoff: 'Created in Shopify as an unpublished article',
    measure: { metric: 'Clicks + impressions for target queries', source: 'GSC', windows: [28, 56, 90], win: 'Page reaches top 10 for a target query, or clicks beat the store median for new posts' },
  },
  pr: {
    label: 'PR story', ease: 3,
    handoff: 'Release + journalist pitch ready. Permission check first',
    measure: { metric: 'Referral sessions, branded search impressions', source: 'GA4, GSC', windows: [14], win: 'Above the store’s trailing average' },
  },
  ops: {
    label: 'Private ops note', ease: 2,
    handoff: 'Private note to the owner. Never marketing copy',
    measure: { metric: 'New reviews mentioning the theme', source: 'Reviews', windows: [60], win: 'Theme falls below the trigger level' },
  },
};
