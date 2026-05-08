# Nestica 11ty Storefront

This is the Nestica website rebuilt as a static 11ty storefront.

## Run locally

```bash
npm install
npm run start
```

Open:

```txt
http://localhost:8080
```

## Main editable files

- `src/_data/products.json` — product data
- `src/_data/categories.json` — category data
- `src/_data/settings.json` — brand, WhatsApp, email, currency
- `src/assets/images/products/` — product images
- `src/assets/images/categories/` — category images
- `src/assets/css/site.css` — design/theme
- `src/assets/js/cart.js` — localStorage cart and WhatsApp order flow
- `src/assets/js/app.js` — language/theme/search scripts

## Important

This is a static site. There is no .NET Admin Panel or SQL database. To add products, edit `products.json` or later connect a CMS like Decap CMS, Sanity, Strapi, or Headless WordPress.
