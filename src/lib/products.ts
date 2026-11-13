import type { CategoryId, Product } from "@/lib/shop";

/**
 * The shop's inventory. Each entry is one stone or piece.
 *
 * To list an item:
 *   1. Put its photographs (and optional video) in `public/products/<slug>/`.
 *   2. Add an entry below. `price` is in the smallest currency unit, so
 *      CHF 1,250.00 is written as 125000.
 *   3. When it sells, set `sold: true`. Keep the entry so its page stays online.
 *
 * Example:
 *   {
 *     slug: "demantoid-round-1-02ct",
 *     category: "demantoid-garnet",
 *     name: "Demantoid Garnet, Round Brilliant, 1.02 ct",
 *     description: "A bright, lively stone with strong dispersion.",
 *     price: 125000,
 *     images: [{ src: "/products/demantoid-round-1-02ct/front.jpg", alt: "Round demantoid garnet, face up" }],
 *     specs: { weight: "1.02 ct", dimensions: "6.1 mm", origin: "Russia", treatment: "None" },
 *   }
 */
export const products: readonly Product[] = [];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function productsIn(category: CategoryId): Product[] {
  return products.filter((product) => product.category === category);
}
