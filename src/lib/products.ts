import type { CategoryId, Product } from "@/lib/shop";

/**
 * The shop's inventory. Each entry is one stone, lot or piece.
 *
 * SETTING A PRICE
 *   Add or change the `price` line of an entry. Write the amount in Swiss francs as a
 *   plain number, without quotes, currency or thousands separators:
 *
 *       price: 1250,        ->  CHF 1,250.00
 *       price: 89.5,        ->  CHF 89.50
 *
 *   An entry with no `price` line is shown as "Price on request" and cannot be bought.
 *
 * MARKING A PIECE AS SOLD
 *   Add the line `sold: true,` to its entry. Keep the entry so its page stays online.
 *
 * LISTING A NEW PIECE
 *   Put its photographs (and optional video) in `public/products/<slug>/`, then copy an
 *   entry below and change its values. `slug` must be unique and is used in the page address.
 */
export const products: readonly Product[] = [
  {
    slug: "demantoid-round-group-of-ten",
    category: "demantoid-garnet",
    name: "Demantoid Garnet, Round, Group of Ten",
    images: [
      {
        src: "/products/demantoid-round-group-of-ten/1.jpg",
        alt: "Ten round faceted demantoid garnets, one of them held in tweezers",
      },
    ],
    specs: { shape: "Round" },
  },
  {
    slug: "blue-square-step-cut",
    category: "other-gemstones",
    name: "Blue Gemstone, Square Step Cut",
    images: [
      { src: "/products/blue-square-step-cut/1.jpg", alt: "Blue square step-cut gemstone, face up" },
      { src: "/products/blue-square-step-cut/2.jpg", alt: "Blue square step-cut gemstone held in tweezers" },
    ],
    specs: { shape: "Square step cut", colour: "Blue" },
  },
  {
    slug: "bicolour-emerald-cut-trio",
    category: "other-gemstones",
    name: "Bi-Colour Gemstones, Emerald Cut, Set of Three",
    images: [
      {
        src: "/products/bicolour-emerald-cut-trio/1.jpg",
        alt: "Three emerald-cut gemstones with purple and colourless zones",
      },
    ],
    specs: { shape: "Emerald cut", colour: "Purple and colourless" },
  },
  {
    slug: "red-shield-cut",
    category: "other-gemstones",
    name: "Red Gemstone, Shield Cut",
    images: [{ src: "/products/red-shield-cut/1.jpg", alt: "Red shield-cut gemstone held in tweezers" }],
    video: {
      src: "/products/red-shield-cut/video.mp4",
      poster: "/products/red-shield-cut/1.jpg",
    },
    specs: { shape: "Shield cut", colour: "Red" },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function productsIn(category: CategoryId): Product[] {
  return products.filter((product) => product.category === category);
}
