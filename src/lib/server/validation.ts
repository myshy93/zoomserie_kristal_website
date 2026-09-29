// Request schemas for /api/orders and /api/quotes. Prices never come from the client;
// see pricing.ts for how order lines are checked against the catalog.
import { z } from 'astro/zod';

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => text(max).min(1);

/** Romanian mobile/landline: 07xx xxx xxx, 02x/03x..., optional +40 / 0040 prefix. */
const phone = z
  .string()
  .transform((value) => value.replace(/[\s.\-()]/g, ''))
  .pipe(z.string().regex(/^(\+40|0040|0)[237]\d{8}$/, 'phone'));

const contact = {
  lang: z.enum(['ro', 'en']).default('ro'),
  lastName: required(80),
  firstName: required(80),
  phone,
  /** Honeypot: hidden from people, bots fill it in. */
  website: z.string().optional(),
};

export const orderItemSchema = z.object({
  productId: required(100),
  unit: z.enum(['bucata', 'kg', 'portie', 'cutie']),
  variations: z.record(z.string(), z.string().max(100)).default({}),
  message: text(60).default(''),
  quantity: z.number().positive().max(100),
});

export const orderSchema = z
  .object({
    ...contact,
    fulfillment: z.enum(['delivery', 'pickup']),
    address: text(300).default(''),
    notes: text(1000).default(''),
    items: z.array(orderItemSchema).min(1).max(30),
  })
  .refine((o) => o.fulfillment === 'pickup' || o.address.length > 0, {
    message: 'required',
    path: ['address'],
  });

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;

const today = () => new Date().toISOString().slice(0, 10);

export const quoteSchema = z
  .object({
    ...contact,
    kind: z.enum(['personalizat', 'nunta']),
    eventDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .or(z.literal('').transform(() => undefined)),
    description: required(2000),
    address: required(300),
  })
  .refine((q) => q.kind !== 'nunta' || q.eventDate !== undefined, {
    message: 'required',
    path: ['eventDate'],
  })
  .refine((q) => q.eventDate === undefined || q.eventDate >= today(), {
    message: 'past',
    path: ['eventDate'],
  });

export type QuoteInput = z.infer<typeof quoteSchema>;

/** Flattens zod issues into `{ field: code }` for the client to highlight. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join('.') || '_';
    fields[key] ??= issue.message;
  }
  return fields;
}
