// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import { site } from './src/config/site.ts';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  // One canonical form for every URL (/despre, not /despre/); matches the links built in src/i18n/utils.ts.
  trailingSlash: 'never',
  build: { format: 'file' },

  // Romanian at the root (/despre), English under /en (/en/about).
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});
