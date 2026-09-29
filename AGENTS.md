## Project

Website for the Zoomserie cakery (placeholder brand name). Read `README.md` for structure and conventions. Business scope, decisions and open questions are in the planning repo at `/Users/mihai/zoomserie_kristal/CLAUDE.md`.

- Every user-facing string must exist in both `ro` and `en` (`src/i18n/ui.ts`, and the `{ ro, en }` fields in content JSON).
- Build internal links with the helpers in `src/i18n/utils.ts` / `src/lib/catalog.ts`; don't hand-write URLs.
- Real product photos are gated by `photosReady` (see `productImages()` in `src/lib/catalog.ts`).

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
