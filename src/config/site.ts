// Business details shown across the site. Values marked TODO are placeholders
// until the client confirms them (see planning repo: zoomserie_kristal/CLAUDE.md).

/** ISO weekday: 1 = Monday … 7 = Sunday. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface OpeningHours {
  days: readonly Weekday[];
  /** 24h "HH:MM", Bucharest time. */
  opens: string;
  closes: string;
}

// TODO: exact street number, bloc/scara and postal code from the client.
const postalAddress = {
  streetAddress: 'Drumul Dealu Bradului, Bloc C5, Grand Kristal Residence',
  locality: 'București',
  region: 'Sector 4',
  postalCode: '041838',
  country: 'RO',
} as const;

export const site = {
  name: 'Zoomserie', // TODO: placeholder brand name
  url: 'https://zoomserie.ro', // TODO: real domain once the brand name is confirmed
  phone: '+40 755 041 450', // TODO
  whatsappNumber: '40755041450', // international format, no "+" (used in wa.me links)
  email: 'contact@zoomserie.ro', // TODO
  postalAddress,
  address: `${postalAddress.streetAddress}, ${postalAddress.region}, ${postalAddress.locality}`,
  // TODO: exact shop pin. Placeholder = Grand Kristal bloc C4 (OpenStreetMap), next to C5.
  geo: { lat: 44.35832, lng: 26.13132 },
  // Google Business Profile place ID, once the client has one. When set, the map and the
  // directions link point at the listing (name, reviews, hours) instead of a bare pin.
  googlePlaceId: undefined as string | undefined,
  // TODO: real hours from the client. Days not listed are closed.
  openingHours: [
    { days: [2, 3, 4, 5, 6], opens: '09:00', closes: '20:00' },
    { days: [7], opens: '10:00', closes: '16:00' },
  ] as OpeningHours[],
  instagramUrl: 'https://www.instagram.com/', // TODO
  freeDeliveryThresholdRon: 200,
  legal: {
    companyName: 'TODO SRL',
    cui: 'TODO',
    regCom: 'TODO',
  },
} as const;
