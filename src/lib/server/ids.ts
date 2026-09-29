// Readable numbers shown to customers and the owner: prefix + day (Bucharest time) + the
// sequence within that day, e.g. C-260929-01 (first order on 29 Sep 2026), O-260929-03
// (third quote request that day). Easy to read out over the phone.
import { env } from 'cloudflare:workers';

export type IdPrefix = 'C' | 'O'; // C = comandă, O = cerere de ofertă

/** YYMMDD in Europe/Bucharest, so numbering resets at local midnight. */
function today(): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bucharest',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${part('year')}${part('month')}${part('day')}`;
}

const format = (scope: string, n: number) => `${scope}-${String(n).padStart(2, '0')}`;

/** Next number for today; the counter is incremented atomically in D1. */
export async function nextId(prefix: IdPrefix): Promise<string> {
  const scope = `${prefix}-${today()}`;
  const row = await env.DB.prepare(
    `INSERT INTO id_counters (scope, value) VALUES (?, 1)
     ON CONFLICT(scope) DO UPDATE SET value = value + 1
     RETURNING value`,
  )
    .bind(scope)
    .first<{ value: number }>();
  return format(scope, row!.value);
}

/** Plausible-looking number that doesn't consume the counter (honeypot responses). */
export function fakeId(prefix: IdPrefix): string {
  return format(`${prefix}-${today()}`, 1 + Math.floor(Math.random() * 20));
}
