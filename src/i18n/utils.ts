import { ui, type UiKey } from './ui';

export type Lang = keyof typeof ui;

/** Localized field shape used in content collections: `{ ro, en }`. */
export type Localized = Record<Lang, string>;

export function useTranslations(lang: Lang) {
  return (key: UiKey, vars: Record<string, string | number> = {}) =>
    ui[lang][key].replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
}

export function otherLang(lang: Lang): Lang {
  return lang === 'ro' ? 'en' : 'ro';
}

/** Per-language base path of every page. Romanian lives at the root, English under /en. */
export const routes = {
  home: { ro: '/', en: '/en' },
  about: { ro: '/despre', en: '/en/about' },
  products: { ro: '/produse', en: '/en/products' },
  gallery: { ro: '/galerie', en: '/en/gallery' },
  contact: { ro: '/contact', en: '/en/contact' },
  quote: { ro: '/cere-oferta', en: '/en/request-quote' },
  quoteThanks: { ro: '/cere-oferta/multumim', en: '/en/request-quote/thank-you' },
  cart: { ro: '/cos', en: '/en/cart' },
  cookies: { ro: '/politica-cookies', en: '/en/cookie-policy' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

/** Builds a localized URL, e.g. `path('products', 'en', 'torturi')` → `/en/products/torturi`. */
export function path(key: RouteKey, lang: Lang, ...segments: string[]): string {
  const base = routes[key][lang];
  if (segments.length === 0) return base;
  return [base.replace(/\/$/, ''), ...segments].join('/');
}

/** URLs of the same page in every language, e.g. `localized((l) => path('about', l))`. */
export function localized(url: (lang: Lang) => string): Record<Lang, string> {
  return { ro: url('ro'), en: url('en') };
}

export function formatPrice(ron: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'ro' ? 'ro-RO' : 'en-GB', {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 2,
  }).format(ron);
}
