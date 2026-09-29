// Owner notifications for new orders and quote requests. Email goes out through the
// Resend HTTP API; WhatsApp (Cloud API) is planned and will be another sender here.
// Notifications run in waitUntil and must never fail the customer's submission.
import { env } from 'cloudflare:workers';
import { site } from '../../config/site';
import type { PricedOrder } from './pricing';
import type { OrderInput, QuoteInput } from './validation';

/** Secrets (`wrangler secret put`, or `.dev.vars` locally) and vars used for email. */
interface MailEnv {
  RESEND_API_KEY?: string;
  OWNER_EMAIL?: string;
  MAIL_FROM?: string;
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

export async function notifyOwner(message: Message): Promise<void> {
  const { RESEND_API_KEY, OWNER_EMAIL, MAIL_FROM } = env as unknown as MailEnv;
  if (!RESEND_API_KEY || !OWNER_EMAIL) {
    console.warn(`[notify] email not configured, skipped: ${message.subject}`);
    return;
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: MAIL_FROM || `${site.name} <onboarding@resend.dev>`,
        to: OWNER_EMAIL.split(',').map((a) => a.trim()),
        subject: message.subject,
        text: message.text,
      }),
    });
    if (!response.ok) console.error(`[notify] email failed ${response.status}: ${await response.text()}`);
  } catch (error) {
    console.error('[notify] email error', error);
  }
}
