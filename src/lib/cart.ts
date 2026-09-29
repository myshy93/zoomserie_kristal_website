// Client-side cart (localStorage). Prices stored here are for display only: the
// /api/orders function recomputes every unit price server-side from the catalog.

type Localized = { ro: string; en: string };

export interface CartLine {
  /** Identity of product + unit + variations + message; identical adds merge into one line. */
  key: string;
  productId: string;
  unit: string;
  variations: Record<string, string>;
  message: string;
  quantity: number;
  /** Display snapshot only, never trusted by the server. */
  unitPriceRon: number;
  display: { name: Localized; options: Localized[]; url: Localized };
}

const STORAGE_KEY = 'zoomserie.cart.v1';
const CHANGE_EVENT = 'cart:change';

/** Per-kg items move in 0.5 kg steps (TBD with client, see planning repo open questions). */
export function quantityStep(unit: string): number {
  return unit === 'kg' ? 0.5 : 1;
}

export function lineKey(line: Pick<CartLine, 'productId' | 'unit' | 'variations' | 'message'>): string {
  const variations = Object.entries(line.variations).sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify([line.productId, line.unit, variations, line.message.trim()]);
}

export function readCart(): CartLine[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage blocked (private mode, quota): the cart just won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function addLine(line: Omit<CartLine, 'key'>): void {
  const key = lineKey(line);
  const lines = readCart();
  const existing = lines.find((l) => l.key === key);
  if (existing) existing.quantity += line.quantity;
  else lines.push({ ...line, key });
  writeCart(lines);
}

export function setQuantity(key: string, quantity: number): void {
  const lines = readCart();
  const line = lines.find((l) => l.key === key);
  if (!line) return;
  const step = quantityStep(line.unit);
  line.quantity = Math.max(step, Math.round(quantity / step) * step);
  writeCart(lines);
}

export function removeLine(key: string): void {
  writeCart(readCart().filter((l) => l.key !== key));
}

export function clearCart(): void {
  writeCart([]);
}

export const lineTotal = (line: CartLine): number => Math.round(line.unitPriceRon * line.quantity * 100) / 100;

export const cartTotal = (lines: CartLine[]): number =>
  Math.round(lines.reduce((sum, l) => sum + lineTotal(l), 0) * 100) / 100;

export const cartCount = (lines: CartLine[]): number => lines.length;

/** Runs `callback` now and whenever the cart changes (this tab or another). */
export function watchCart(callback: (lines: CartLine[]) => void): void {
  const run = () => callback(readCart());
  window.addEventListener(CHANGE_EVENT, run);
  window.addEventListener('storage', (e) => e.key === STORAGE_KEY && run());
  run();
}
