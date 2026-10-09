# ratio73

A multilingual Korean skincare storefront mockup. The range philosophy is 70% trusted core products and 30% social discoveries, starting with Centellian24 Madeca Cream Time Reverse Season 7, 50 mL.

## Preview

- English, Korean and Simplified Chinese; language and currency are independent.
- AUD and USD sample price books (A$24 / US$16), not live exchange rates or confirmed selling prices.
- Responsive landing page, product information, editable preview bag, planned Club 73 membership, newsletter and price-match form demonstrations.
- Club 73 is planned to be free to join. Members may eventually suggest products and vote on a vetted shortlist; requests and votes will inform but not guarantee stocking decisions. There is no live membership registration, nomination or voting in this preview.
- Only language, currency and sample bag quantity persist in browser local storage.
- No real orders, payments, newsletter subscriptions, price-match submissions or loyalty accounts are created.
- Search indexing is disabled while this is a mockup.

## Run

Node.js 20 or later. No application dependencies or installation required.

```sh
npm run dev
npm run check
npm run build
```

Local preview: http://localhost:4173. Optional local build output: `public/`. Cloudflare serves the same static files directly from `src/`, so dashboard deployments also work when the build command is blank.

## Publish on Cloudflare Workers

In Workers & Pages, create a Worker connected to `samlim-415/ratio73`:

| Setting | Value |
| --- | --- |
| Worker name | `ratio73` |
| Production branch | `main` |
| Root directory | `/` |
| Build command | Leave blank (not required for this static site) |
| Deploy command | `npx wrangler@4 deploy` |
| Assets directory | `./src` (already configured; present in Git) |

Enable the Worker’s `workers.dev` route under Settings → Domains & Routes. Cloudflare assigns the actual URL using the account’s configured subdomain. Do not treat an anticipated hostname as a verified deployment. No app-specific secrets or environment variables are needed for this static preview. Future GitHub pushes can deploy automatically when Workers Builds is connected.

## Before opening for real orders

Confirm selling prices, country-specific inventory/fulfilment, taxes and shipping; connect commerce and payment services; connect newsletter consent and email delivery; confirm Club 73 membership, product suggestion and advisory voting rules, plus price-match terms; add business/contact, privacy and returns information; review translations; replace preview-only wording and remove `noindex` only when ready. Use approved supplier product assets before commercial launch.

## Files

- `src/index.html`: page structure and English content.
- `src/styles.css`: responsive brand system and layouts.
- `src/app.js`: translations, sample prices and client-only interactions.
- `scripts/build.mjs`: copies only public source assets into `public/`.
- `wrangler.jsonc`: Cloudflare static assets configuration.

## Product sources

Checked 8 October 2026:

- User-supplied reference: https://global.oliveyoung.com/product/detail?prdtNo=GA240121561&dataSource=search_result
- Product facts, ingredients and usage: https://centellian24.com/products/centellian24-madeca-cream-time-reverse-season-7-50ml
- Product photograph: https://www.ulta.com/p/madeca-cream-time-reverse-pimprod2058852?sku=2657775
- Photograph file: https://media.ulta.com/i/ulta/2657775?fmt=auto&h=1400&w=1400

The unaltered product photograph is used for this design mockup; no reproduction licence has been established. Product trademarks and photographs belong to their owners. Obtain supplier-approved assets for commercial use. No Olive Young ranking, review score, independent test result or authorised-dealer status is claimed.
