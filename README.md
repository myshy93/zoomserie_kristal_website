# Zoomserie — website

Bilingual (RO/EN) presentation and ordering site for a neighbourhood cakery in Berceni, Bucharest. "Zoomserie" is a placeholder brand name until the client confirms the real one.

Business scope, decisions and open questions live in the planning repo: `/Users/mihai/zoomserie_kristal` (`CLAUDE.md`, `TASKS.md`).

## Stack

- **Astro 7 + Tailwind CSS 4**: static pages, with small inline scripts only where a form needs them.
- **Cloudflare** (`@astrojs/cloudflare`): hosting, plus D1 (order and quote storage) and R2 (quote reference photos). Not wired up yet.

## Commands

| Command           | Action                                     |
| :---------------- | :----------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4321`             |
| `npm run build`   | Production build to `./dist/`              |
| `npm run preview` | Preview the build locally                  |
| `npm run check`   | Type-check `.astro` and `.ts` files        |

## Structure

```text
src/
├── config/site.ts         Business details (phone, WhatsApp, address, legal); TODO placeholders
├── content.config.ts      Product + category schemas (Zod)
├── content/
│   ├── categories/*.json  One file per category, bilingual fields
│   └── products/*.json    One file per product, bilingual fields
├── i18n/                  UI strings (ui.ts) + localized routes and helpers (utils.ts)
├── lib/catalog.ts         Collection queries, URLs, photo feature-flag resolution
├── layouts/ components/   Shared layout, header/footer, forms
├── views/                 One view per page, rendered by both languages
└── pages/                 Thin route files: RO at the root, EN under /en
```

### URLs and languages

Romanian is served at the root and English under `/en`. Each language uses its own URL names, e.g. `/produse/torturi/tort-ciocolata` and `/en/products/torturi/tort-ciocolata`. Product and category slugs are shared by both languages. Every page is a thin route file per language that renders a shared view from `src/views/`. To add a page, add its paths to `routes` in `src/i18n/utils.ts`, create the view, then create both route files.

URLs have no trailing slash (`trailingSlash: 'never'`). Build links with `path()`, `productUrl()` or `categoryUrl()` rather than writing them by hand.

### Products and photo feature flags

Each product JSON holds everything its page shows: price(s) per unit, ingredients, the 14 EU allergens, weight (gramaj), nutrition values, storage conditions, variations (dimensiune / porții / aromă / decor), and whether a personalized message can be added.

- `orderType: "standard"` shows fixed prices and the order form.
- `orderType: "quote"` (with `quoteKind: "personalizat" | "nunta"`) shows no price and links to the "Cere ofertă" form instead.

**Photos.** A product shows real images only when `photosReady` is `true` and its `images` list is non-empty. `photosReady` is set per product; if it isn't set on a product, the category's value applies. Until then the product shows `public/placeholders/product.svg`. For phase 2, add the photos and flip the flags; no layout changes are needed.

The products in `src/content/products/` that are marked "(exemplu)" are samples. Replace them with the client's real catalog.

## Not done yet

- `/api/orders` and `/api/quotes` endpoints (D1 insert, R2 upload, owner email + WhatsApp notifications). The forms already post to these paths.
- D1/R2 bindings in `wrangler.jsonc`, schema migrations, and the retention cleanup cron.
- Instagram gallery embed, GA4, Search Console, real brand, domain and business details.
