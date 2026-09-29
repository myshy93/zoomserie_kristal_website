// POST /api/orders — one order request for the whole cart (no payment). Validates the
// body, reprices every line from the catalog, stores orders + order_items atomically
// in D1 and emails the owner.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { newPublicId } from '../../lib/server/ids';
import { notifyOwner, orderMessage } from '../../lib/server/notify';
import { PricingError, priceOrder } from '../../lib/server/pricing';
import { fieldErrors, orderSchema } from '../../lib/server/validation';

export const prerender = false;

const MAX_BODY_BYTES = 32 * 1024;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request, locals }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json(415, { error: 'unsupported_media_type' });
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: 'too_large' });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return json(400, { error: 'validation', fields: fieldErrors(parsed.error) });
  const order = parsed.data;

  // Honeypot filled: pretend it worked so bots don't adapt, but store nothing.
  if (order.website) return json(201, { orderId: newPublicId('ZS') });

  let priced;
  try {
    priced = await priceOrder(order.items);
  } catch (error) {
    if (error instanceof PricingError) {
      return json(422, { error: 'invalid_items', item: error.index, reason: error.reason });
    }
    throw error;
  }

  const id = newPublicId('ZS');
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO orders (id, last_name, first_name, phone, fulfillment, address, customer_notes,
         subtotal_bani, delivery_fee_bani, total_bani, lang, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
    ).bind(
      id,
      order.lastName,
      order.firstName,
      order.phone,
      order.fulfillment,
      order.fulfillment === 'delivery' ? order.address : null,
      order.notes || null,
      priced.subtotalBani,
      // Delivery fee below the free threshold is agreed on confirmation (TBD with client).
      priced.subtotalBani,
      order.lang,
      now,
      now,
    ),
    ...priced.lines.map((line) =>
      env.DB.prepare(
        `INSERT INTO order_items (order_id, product_slug, product_name, variations, personalized_message,
           quantity, unit, unit_price_bani, line_total_bani)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        id,
        line.productSlug,
        line.productName,
        JSON.stringify(line.variations),
        line.message,
        line.quantity,
        line.unit,
        line.unitPriceBani,
        line.lineTotalBani,
      ),
    ),
  ]);

  locals.cfContext.waitUntil(notifyOwner(orderMessage(id, order, priced)));

  return json(201, { orderId: id, totalRon: priced.subtotalBani / 100, freeDelivery: priced.freeDelivery });
};
