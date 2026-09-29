// POST /api/quotes — "Cere ofertă" for custom/wedding cakes. A plain multipart form
// post (works without JS): optional reference photo goes to R2, the request to D1,
// the owner gets an email, and the browser is redirected to the thank-you page.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { path, type Lang } from '../../i18n/utils';
import { newPublicId } from '../../lib/server/ids';
import { notifyOwner, quoteMessage } from '../../lib/server/notify';
import { quoteSchema } from '../../lib/server/validation';

export const prerender = false;

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const MAX_BODY_BYTES = MAX_PHOTO_BYTES + 64 * 1024;
const PHOTO_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

const redirect = (location: string) => new Response(null, { status: 303, headers: { location } });

export const POST: APIRoute = async ({ request, locals }) => {
  const declared = Number(request.headers.get('content-length') ?? 0);
  let lang: Lang = 'ro';
  const back = (error: string) => redirect(`${path('quote', lang)}?error=${error}`);

  if (declared > MAX_BODY_BYTES) return back('photo_size');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return back('invalid');
  }
  if (form.get('lang') === 'en') lang = 'en';

  const fields = Object.fromEntries(
    [...form.entries()].filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
  const parsed = quoteSchema.safeParse(fields);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.path[0];
    return back(first === 'eventDate' ? 'event_date' : first === 'phone' ? 'phone' : 'invalid');
  }
  const quote = parsed.data;
  const id = newPublicId('QR');
  const thanks = redirect(`${path('quoteThanks', lang)}?id=${id}`);

  if (quote.website) return thanks;

  const photo = form.get('photo');
  let photoKey: string | null = null;
  if (photo instanceof File && photo.size > 0) {
    const ext = PHOTO_TYPES[photo.type];
    if (!ext) return back('photo_type');
    if (photo.size > MAX_PHOTO_BYTES) return back('photo_size');
    photoKey = `quotes/${id}/${crypto.randomUUID()}.${ext}`;
    await env.QUOTE_PHOTOS.put(photoKey, photo.stream(), { httpMetadata: { contentType: photo.type } });
  }

  try {
    await env.DB.prepare(
      `INSERT INTO quote_requests (id, cake_type, last_name, first_name, phone, address, event_date,
         description, photo_key, lang)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        quote.kind === 'nunta' ? 'tort_nunta' : 'tort_personalizat',
        quote.lastName,
        quote.firstName,
        quote.phone,
        quote.address,
        quote.eventDate ?? null,
        quote.description,
        photoKey,
        quote.lang,
      )
      .run();
  } catch (error) {
    // Don't leave an orphaned photo in R2 without a row pointing at it.
    if (photoKey) await env.QUOTE_PHOTOS.delete(photoKey);
    throw error;
  }

  locals.cfContext.waitUntil(notifyOwner(quoteMessage(id, quote, photoKey)));
  return thanks;
};
