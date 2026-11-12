const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

export const site = {
  name: "Virelia Gemhouse",
  wordmark: "Virelia",
  descriptor: "Gemhouse",
  tagline: "Rare Gems. Swiss Standards.",
  headline: "Discover the Extraordinary.",
  locality: "Swiss-Based · Worldwide",
  description:
    "Explore a carefully curated world of natural gemstones, where rarity, beauty and authenticity come together. Home of an exclusive Demantoid Garnet collection.",
} as const;

export const navigation = [
  { label: "Collections", href: "#collections" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Our Promise", href: "#promise" },
  { label: "Demantoid", href: "#demantoid" },
] as const;

export type GlyphKind = "brilliant" | "rough" | "step" | "trillion" | "ring";

export interface Collection {
  id: string;
  name: string;
  summary: string;
  glyph: GlyphKind;
  featured?: boolean;
}

export const collections: readonly Collection[] = [
  {
    id: "demantoid-garnet",
    name: "Demantoid Garnet",
    summary:
      "Our signature collection. Exceptional rough and faceted stones with extraordinary green brilliance.",
    glyph: "brilliant",
    featured: true,
  },
  {
    id: "rough-gemstones",
    name: "Rough Gemstones",
    summary: "Natural crystals, presented just as the earth shaped them.",
    glyph: "rough",
  },
  {
    id: "faceted-gemstones",
    name: "Faceted Gemstones",
    summary: "Cut stones chosen for their colour, clarity and light.",
    glyph: "step",
  },
  {
    id: "rare-gemstones",
    name: "Rare Gemstones",
    summary: "Remarkable precious and semi-precious stones, seldom seen.",
    glyph: "trillion",
  },
  {
    id: "fine-jewelry",
    name: "Fine Jewelry",
    summary: "Selected pieces that let an exceptional stone take the lead.",
    glyph: "ring",
  },
];

export const promises: readonly string[] = [
  "Transparent gemstone information",
  "Independent laboratory reports where available",
  "Carefully selected gemstones",
  "Secure international shipping options",
  "Personal assistance for collectors and buyers",
];
