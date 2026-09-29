import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localized = z.object({ ro: z.string(), en: z.string() });

/** The 14 allergens that must be declared under EU Regulation 1169/2011. */
export const allergens = [
  'gluten',
  'crustaceans',
  'eggs',
  'fish',
  'peanuts',
  'soy',
  'milk',
  'nuts',
  'celery',
  'mustard',
  'sesame',
  'sulphites',
  'lupin',
  'molluscs',
] as const;

const categories = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/categories' }),
  schema: z.object({
    name: localized,
    description: localized,
    order: z.number().int(),
    /** Feature flag: show the real category photo instead of the placeholder. */
    photosReady: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/products' }),
  schema: z
    .object({
      name: localized,
      category: reference('categories'),
      description: localized,
      /** `standard` = fixed price + order form; `quote` = no price, goes to the "Cere ofertă" form. */
      orderType: z.enum(['standard', 'quote']).default('standard'),
      quoteKind: z.enum(['personalizat', 'nunta']).optional(),
      /**
       * Fixed rate per unit: per piece/portion/box, or per kg (line = rate × kg).
       * Variations never change the price.
       */
      pricing: z
        .array(
          z.object({
            unit: z.enum(['bucata', 'kg', 'portie', 'cutie']),
            priceRon: z.number().positive(),
          }),
        )
        .default([]),
      ingredients: localized,
      allergens: z.array(z.enum(allergens)),
      /** Gramaj, e.g. "120 g" or "1,5 kg". */
      weight: z.string(),
      nutrition: z.object({
        per: z.string().default('100 g'),
        energyKj: z.number(),
        energyKcal: z.number(),
        fat: z.number(),
        saturatedFat: z.number(),
        carbs: z.number(),
        sugars: z.number(),
        protein: z.number(),
        salt: z.number(),
      }),
      storage: localized,
      variations: z
        .array(
          z.object({
            id: z.string(),
            type: z.enum(['dimensiune', 'portii', 'aroma', 'decor']),
            label: localized,
            options: z.array(z.object({ id: z.string(), label: localized })),
          }),
        )
        .default([]),
      /** Whether the order form offers a personalized message field (for cakes). */
      allowsMessage: z.boolean().default(false),
      /**
       * Feature flag for real photos. Unset = inherit from the category.
       * Placeholders are shown until the flag is on AND `images` is non-empty.
       */
      photosReady: z.boolean().optional(),
      images: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    })
    .refine((p) => p.orderType === 'quote' || p.pricing.length > 0, {
      message: 'Standard products need at least one price',
      path: ['pricing'],
    })
    .refine((p) => p.orderType === 'standard' || p.quoteKind !== undefined, {
      message: 'Quote products need a quoteKind',
      path: ['quoteKind'],
    }),
});

export const collections = { categories, products };
