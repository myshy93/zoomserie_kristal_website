// Short public IDs shown to customers and the owner, e.g. ZS-7K3Q9F (orders), QR-8M2X4D (quotes).
// Alphabet skips look-alikes (0/O, 1/I/L) so IDs are easy to read out over the phone.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export function newPublicId(prefix: 'ZS' | 'QR', length = 6): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let id = '';
  for (const byte of bytes) id += ALPHABET[byte % ALPHABET.length];
  return `${prefix}-${id}`;
}
