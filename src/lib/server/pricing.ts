// Server-side order pricing. Every line is re-checked against the content collection
// and priced from it; the client's cart prices are display-only and never read here.
// Pricing rule: a product is sold per unit (bucata/portie/cutie) or per kg, at a fixed
// rate per unit; variations (aromă, decor...) never change the price.
import { site } from '../../config/site';
import { getProducts } from '../catalog';
import { quantityStep } from '../cart';
import type { OrderItemInput } from './validation';

export interface PricedLine {
  productSlug: string;
  productName: string;
  unit: OrderItemInput['unit'];
  variations: Record<string, string>;
  message: string | null;
  quantity: number;
  unitPriceBani: number;
  lineTotalBani: number;
  /** Human-readable variation labels (RO), for the owner notification. */
  optionLabels: string[];
}

export interface PricedOrder {
  lines: PricedLine[];
  subtotalBani: number;
  freeDelivery: boolean;
}

export class PricingError extends Error {
  constructor(
    readonly index: number,
    readonly reason: string,
  ) {
    super(`item ${index}: ${reason}`);
  }
}

export async function priceOrder(items: OrderItemInput[]): Promise<PricedOrder> {
  const products = new Map((await getProducts()).map((p) => [p.id, p]));

  const lines = items.map((item, index): PricedLine => {
    const fail = (reason: string): never => {
      throw new PricingError(index, reason);
    };
    const product = products.get(item.productId) ?? fail('unknown_product');
    const { data } = product;
    if (data.orderType !== 'standard') fail('quote_only');

    const price = data.pricing.find((p) => p.unit === item.unit) ?? fail('unit');
    const step = quantityStep(item.unit);
    if (!Number.isInteger(item.quantity / step)) fail('quantity_step');

    const sent = Object.keys(item.variations);
    if (sent.some((id) => !data.variations.some((v) => v.id === id))) fail('unknown_variation');
    const optionLabels = data.variations.map((variation) => {
      const option = variation.options.find((o) => o.id === item.variations[variation.id]) ?? fail('variation');
      return `${variation.label.ro}: ${option.label.ro}`;
    });

    const message = item.message.trim();
    if (message && !data.allowsMessage) fail('message_not_allowed');

    const unitPriceBani = Math.round(price.priceRon * 100);
    return {
      productSlug: product.id,
      productName: data.name.ro,
      unit: item.unit,
      variations: item.variations,
      message: message || null,
      quantity: item.quantity,
      unitPriceBani,
      lineTotalBani: Math.round(unitPriceBani * item.quantity),
      optionLabels,
    };
  });

  const subtotalBani = lines.reduce((sum, line) => sum + line.lineTotalBani, 0);
  return { lines, subtotalBani, freeDelivery: subtotalBani >= site.freeDeliveryThresholdRon * 100 };
}
