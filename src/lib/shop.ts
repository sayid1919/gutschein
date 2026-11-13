export const categories = [
  {
    id: "demantoid-garnet",
    name: "Demantoid Garnet",
    summary: "Rough and faceted demantoid, the green garnet prized for its brilliance and fire.",
  },
  {
    id: "emerald",
    name: "Emerald",
    summary: "Natural emeralds selected for colour and character.",
  },
  {
    id: "other-gemstones",
    name: "Other Gemstones",
    summary: "Remarkable precious and semi-precious stones beyond our two signature gems.",
  },
  {
    id: "fine-jewelry",
    name: "Fine Jewelry",
    summary: "Selected pieces that let an exceptional stone take the lead.",
  },
] as const;

export type Category = (typeof categories)[number];
export type CategoryId = Category["id"];

export function getCategory(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

/** Facts shown in the specification table of a product page, in this order. */
export const specLabels = {
  weight: "Weight",
  dimensions: "Dimensions",
  shape: "Shape & cut",
  colour: "Colour",
  clarity: "Clarity",
  origin: "Origin",
  treatment: "Treatment",
  report: "Laboratory report",
} as const;

export type SpecKey = keyof typeof specLabels;

export interface ProductImage {
  /** Path under `public`, for example `/products/demantoid-1-02ct/front.jpg`. */
  src: string;
  alt: string;
}

export interface Product {
  /** Unique, URL-safe identifier. Never reuse the slug of a sold stone. */
  slug: string;
  category: CategoryId;
  name: string;
  description: string;
  /** Price in the smallest currency unit (rappen for CHF): CHF 1,250.00 is 125000. */
  price: number;
  /** Every stone is one of a kind. Set this as soon as it is sold. */
  sold?: boolean;
  /** At least one photograph; the first is used on listing cards. */
  images: readonly [ProductImage, ...ProductImage[]];
  /** Optional footage, shown above the photographs on the product page. */
  video?: { src: string; poster: string };
  specs?: Partial<Record<SpecKey, string>>;
}

export const shop = {
  /** ISO 4217 code, lowercase, as Stripe expects it. */
  currency: "chf",
  locale: "en-CH",
  /** Most items a single order may contain. */
  maxItemsPerOrder: 20,
  /** Countries Stripe Checkout will accept a shipping address from. */
  shippingCountries: [
    "CH", "LI", "DE", "AT", "FR", "IT", "NL", "BE", "LU", "ES", "PT", "IE",
    "DK", "SE", "NO", "FI", "GB", "US", "CA", "AU", "JP", "SG", "HK", "AE",
  ],
} as const;

const priceFormat = new Intl.NumberFormat(shop.locale, {
  style: "currency",
  currency: shop.currency.toUpperCase(),
});

export function formatPrice(minorUnits: number): string {
  return priceFormat.format(minorUnits / 100);
}

export function productPath(product: Pick<Product, "category" | "slug">): string {
  return `/shop/${product.category}/${product.slug}`;
}
