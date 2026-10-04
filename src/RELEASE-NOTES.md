# Nestica source update

All 107 product IDs, final prices, names and existing product URLs are preserved.

## Changes
- Optimized 228 image sources into content-fingerprinted WebP assets; responsive product image sizes are generated locally and included in the source.
- Reduced the shared font request to Cairo and Inter; preserved existing layout and styling rules.
- Background videos load near the viewport and respect reduced motion and data saving.
- Meta and TikTok product view/add-to-cart events use consistent product IDs; cart values include quantity.
- WhatsApp clicks are separate from cart handoffs. No browser event claims a confirmed purchase or qualified lead. Analytics payloads exclude customer name, phone, address and notes.
- Standard ecommerce events are available through dataLayer for an existing or future GA4/GTM integration. A GA4/GTM account ID has not been configured.
- Saved carts resolve current prices and names and exclude deleted products.
- Customer notes are escaped before rendering in cart HTML.
- Product schema only states InStock for products marked ready; unknown availability is omitted. Feed availability remains at its existing default until the merchant supplies real availability. The optional feed_availability field can override it with a feed-supported value.
- Removed duplicate brand suffixes from page titles; preserved canonical/hreflang URLs.
- Deleted product routes explicitly return 404 using the existing hosting redirects format. Utility pages keep noindex and are crawlable so crawlers can read it.
- Script/style references have content-based cache versions; optimized images use new immutable URLs.
- Completed the mechanical 4m umbrella English specifications from its existing Arabic description.

## Validation
- JavaScript syntax checks passed.
- Behavioral checks passed for single Meta/TikTok cart events, quantity value, WhatsApp click separation, current cart prices, deleted items and escaped notes.
- All catalog images resolve locally; Nunjucks block balance checked; all final prices and product identities compared with the previous source.

## Deployment and remaining checks
This ZIP contains src, matching the supplied project structure. Keep the project's existing package.json, Eleventy configuration and build/deployment setup. Build cleanly so removed pages do not survive in the output directory.

The supplied archive does not include the build configuration or dependencies. A full Eleventy build, rendered-page QA, live pixels, PageSpeed/Core Web Vitals and actual HTTP response checks still need to run in the complete project or after deployment.

Confirm actual stock, production times, shipping and return policies before changing feed availability or adding claims. GA4 requires the real measurement ID; CAPI and confirmed sales require a server/CRM integration and deduplication. They are not fabricated or enabled in this source update.
