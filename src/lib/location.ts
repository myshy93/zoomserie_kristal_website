// Map, directions and opening-hours helpers. Pure functions: used at build time and in the
// browser (open-now badge), so nothing here may import server-only modules.
import { site, type OpeningHours, type Weekday } from '../config/site';

const { lat, lng } = site.geo;

/** Universal links: open the app on phones, the website on desktop. */
export function directionsUrls() {
  const google = new URL('https://www.google.com/maps/dir/');
  google.searchParams.set('api', '1');
  google.searchParams.set('destination', `${lat},${lng}`);
  if (site.googlePlaceId) google.searchParams.set('destination_place_id', site.googlePlaceId);

  const waze = new URL('https://waze.com/ul');
  waze.searchParams.set('ll', `${lat},${lng}`);
  waze.searchParams.set('navigate', 'yes');

  return { google: google.toString(), waze: waze.toString() };
}

/** Plain "view on Google Maps" link, used as schema.org `hasMap`. */
export function mapUrl(): string {
  const url = new URL('https://www.google.com/maps/search/');
  url.searchParams.set('api', '1');
  url.searchParams.set('query', `${lat},${lng}`);
  if (site.googlePlaceId) url.searchParams.set('query_place_id', site.googlePlaceId);
  return url.toString();
}

/** Maps Embed API (free, no usage limits); the key is referrer-restricted in Google Cloud. */
export function mapEmbedUrl(key: string, lang: string): string {
  const url = new URL('https://www.google.com/maps/embed/v1/place');
  url.searchParams.set('key', key);
  url.searchParams.set('q', site.googlePlaceId ? `place_id:${site.googlePlaceId}` : `${lat},${lng}`);
  url.searchParams.set('zoom', '16');
  url.searchParams.set('language', lang);
  return url.toString();
}

/** Hours for one weekday, or undefined when closed that day. */
export function hoursOn(hours: readonly OpeningHours[], day: Weekday): OpeningHours | undefined {
  return hours.find((h) => h.days.includes(day));
}

/** Current weekday and "HH:MM" in Bucharest, whatever the visitor's own timezone. */
export function bucharestNow(now: Date): { day: Weekday; time: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bucharest',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  const day = (['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(part('weekday')) + 1) as Weekday;
  return { day, time: `${part('hour')}:${part('minute')}` };
}

export type OpenStatus =
  | { open: true; closes: string }
  | { open: false; opens?: { day: Weekday; time: string; inDays: number } };

/** "HH:MM" strings compare correctly as text. */
export function openStatus(hours: readonly OpeningHours[], now: Date): OpenStatus {
  const { day, time } = bucharestNow(now);
  const today = hoursOn(hours, day);
  if (today && time >= today.opens && time < today.closes) return { open: true, closes: today.closes };
  if (today && time < today.opens) return { open: false, opens: { day, time: today.opens, inDays: 0 } };
  for (let inDays = 1; inDays <= 7; inDays++) {
    const next = (((day - 1 + inDays) % 7) + 1) as Weekday;
    const h = hoursOn(hours, next);
    if (h) return { open: false, opens: { day: next, time: h.opens, inDays } };
  }
  return { open: false };
}

/** schema.org OpeningHoursSpecification, one entry per hours block. */
export function openingHoursSpecification(hours: readonly OpeningHours[]) {
  const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days.map((d) => `https://schema.org/${names[d - 1]}`),
    opens: h.opens,
    closes: h.closes,
  }));
}
