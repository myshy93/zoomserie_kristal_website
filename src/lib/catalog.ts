import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { path, type Lang } from '../i18n/utils';

export type Category = CollectionEntry<'categories'>;
export type Product = CollectionEntry<'products'>;

export const PLACEHOLDER_IMAGE = '/placeholders/product.svg';

export async function getCategories(): Promise<Category[]> {
  const categories = await getCollection('categories');
  return categories.sort((a, b) => a.data.order - b.data.order);
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
  return getCollection(
    'products',
    (p) => !p.data.draft && (categoryId === undefined || p.data.category.id === categoryId),
  );
}

export async function getProductCategory(product: Product): Promise<Category> {
  const category = await getEntry(product.data.category);
  if (!category) throw new Error(`Unknown category "${product.data.category.id}" on product "${product.id}"`);
  return category;
}

export function productUrl(product: Product, lang: Lang): string {
  return path('products', lang, product.data.category.id, product.id);
}

export function categoryUrl(category: Category, lang: Lang): string {
  return path('products', lang, category.id);
}

/**
 * Resolves which images to show for a product. Real photos appear only when the
 * `photosReady` flag is on (product-level, else inherited from its category) and
 * the product actually has images; otherwise the placeholder is used.
 */
export function productImages(product: Product, category: Category): { images: string[]; isPlaceholder: boolean } {
  const ready = product.data.photosReady ?? category.data.photosReady;
  if (ready && product.data.images.length > 0) {
    return { images: product.data.images, isPlaceholder: false };
  }
  return { images: [PLACEHOLDER_IMAGE], isPlaceholder: true };
}

export function categoryImage(category: Category): { image: string; isPlaceholder: boolean } {
  if (category.data.photosReady && category.data.image) {
    return { image: category.data.image, isPlaceholder: false };
  }
  return { image: PLACEHOLDER_IMAGE, isPlaceholder: true };
}

export async function categoryStaticPaths() {
  const categories = await getCategories();
  return categories.map((category) => ({ params: { category: category.id }, props: { category } }));
}

export async function productStaticPaths() {
  const products = await getProducts();
  return Promise.all(
    products.map(async (product) => ({
      params: { category: product.data.category.id, product: product.id },
      props: { product, category: await getProductCategory(product) },
    })),
  );
}
