// Owner notifications for new orders and quote requests. Email goes out through the
// Mailjet Send API v3.1; WhatsApp (Cloud API) is planned and will be another sender here.
// Notifications run in waitUntil and must never fail the customer's submission.
import { env } from 'cloudflare:workers';
import { site } from '../../config/site';
import type { PricedOrder } from './pricing';
import type { OrderInput, QuoteInput } from './validation';

/** Secrets (`wrangler secret put`, or `.dev.vars` locally) and vars used for email. */
interface MailEnv {
  MAILJET_API_KEY?: string;
  MAILJET_SECRET_KEY?: string;
  /** Comma-separated for several recipients. */
  OWNER_EMAIL?: string;
  /** Must be a validated sender in Mailjet. */
  MAIL_FROM_EMAIL?: string;
  MAIL_FROM_NAME?: string;
}

interface Message {
  subject: string;
  text: string;
}

const ron = (bani: number) =>
  new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(bani / 100);

const unitLabel: Record<string, string> = { bucata: 'buc.', kg: 'kg', portie: 'porții', cutie: 'cutii' };

export function orderMessage(id: string, order: OrderInput, priced: PricedOrder): Message {
  const lines = priced.lines.map((line, i) => {
    const details = [...line.optionLabels];
    if (line.message) details.push(`Mesaj: „${line.message}”`);
    return [
      `${i + 1}. ${line.productName} — ${line.quantity} ${unitLabel[line.unit]} × ${ron(line.unitPriceBani)} = ${ron(line.lineTotalBani)}`,
      ...details.map((d) => `   ${d}`),
    ].join('\n');
  });
  const delivery =
    order.fulfillment === 'delivery'
      ? `Livrare la: ${order.address}${priced.freeDelivery ? ' (gratuită)' : ' (taxă de comunicat, sub prag)'}`
      : 'Ridicare din cofetărie';
  return {
    subject: `Comandă nouă ${id} — ${order.lastName} ${order.firstName}, ${ron(priced.subtotalBani)}`,
    text: [
      `Comandă nouă ${id}`,
      '',
      `Client: ${order.lastName} ${order.firstName}`,
      `Telefon: ${order.phone}`,
      delivery,
      `Limba site: ${order.lang}`,
      '',
      ...lines,
      '',
      `Subtotal: ${ron(priced.subtotalBani)}`,
      ...(order.notes ? ['', `Observații: ${order.notes}`] : []),
    ].join('\n'),
  };
}

export function quoteMessage(id: string, quote: QuoteInput, photoKey: string | null): Message {
  const type = quote.kind === 'nunta' ? 'Tort de nuntă' : 'Tort personalizat';
  return {
    subject: `Cerere ofertă ${id} — ${type}, ${quote.lastName} ${quote.firstName}`,
    text: [
      `Cerere ofertă nouă ${id}`,
      '',
      `Tip: ${type}`,
      ...(quote.eventDate ? [`Data evenimentului: ${quote.eventDate}`] : []),
      `Client: ${quote.lastName} ${quote.firstName}`,
      `Telefon: ${quote.phone}`,
      `Adresă: ${quote.address}`,
      `Limba site: ${quote.lang}`,
      '',
      'Descriere:',
      quote.description,
      '',
      photoKey ? `Poză de inspirație (R2 zoomserie-quote-photos): ${photoKey}` : 'Fără poză atașată.',
    ].join('\n'),
  };
}

interface MailjetResponse {
  Messages?: { Status: string; Errors?: { ErrorMessage: string }[] }[];
}

export async function notifyOwner(message: Message): Promise<void> {
  const { MAILJET_API_KEY, MAILJET_SECRET_KEY, OWNER_EMAIL, MAIL_FROM_EMAIL, MAIL_FROM_NAME } =
    env as unknown as MailEnv;
  if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY || !OWNER_EMAIL || !MAIL_FROM_EMAIL) {
    console.warn(`[notify] email not configured, skipped: ${message.subject}`);
    return;
  }
  try {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        authorization: `Basic ${btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: MAIL_FROM_EMAIL, Name: MAIL_FROM_NAME || site.name },
            To: OWNER_EMAIL.split(',').map((email) => ({ Email: email.trim() })),
            Subject: message.subject,
            TextPart: message.text,
          },
        ],
      }),
    });
    // Mailjet reports failures per message, so a 200 can still hide an error.
    const body = (await response.json().catch(() => ({}))) as MailjetResponse;
    const errors = (body.Messages ?? [])
      .filter((m) => m.Status !== 'success')
      .flatMap((m) => m.Errors?.map((e) => e.ErrorMessage) ?? [m.Status]);
    if (!response.ok || errors.length > 0) {
      console.error(`[notify] email failed ${response.status}: ${errors.join('; ') || JSON.stringify(body)}`);
    }
  } catch (error) {
    console.error('[notify] email error', error);
  }
}
