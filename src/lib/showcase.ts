import type { CategoryId } from "@/lib/shop";

export type GemShape =
  | "round"
  | "oval"
  | "emerald"
  | "square"
  | "shield"
  | "heart"
  | "marquise"
  | "hexagon";

export interface ShowcaseGem {
  id: string;
  name: string;
  /** Shown under the name and in the details panel. */
  cut: string;
  colour: string;
  /** One or two sentences about the stone, for the details panel. */
  intro?: string;
  /** Further facts for the details panel, shown after cut and colour. */
  facts?: readonly { label: string; value: string }[];
  /** Shop category the details panel links to. */
  category: CategoryId;

  /** How the 3D stone is drawn. */
  shape: GemShape;
  tint: string;
  /** Refractive index used for rendering. */
  ior: number;
  /** Strength of the rainbow "fire". */
  fire: number;
  /** Where the stone floats in the hero, as fractions of the stage's width and height. */
  home: { x: number; y: number; size: number };
  /** Sideways swing during the flight, as a fraction of the viewport width. */
  swing: number;
}

/**
 * The stones shown in 3D on the landing page, in the order of their slots.
 * Demantoid and emerald are the house's signature stones and are drawn largest.
 */
export const showcase: readonly ShowcaseGem[] = [
  {
    id: "demantoid",
    name: "Demantoid Garnet",
    cut: "Round brilliant",
    colour: "Green",
    intro:
      "The green variety of andradite garnet. Its dispersion is higher than diamond's, which is what gives a well-cut stone its fire.",
    facts: [
      { label: "Mineral", value: "Andradite garnet" },
      { label: "Hardness", value: "6.5–7 Mohs" },
      { label: "Refractive index", value: "1.88–1.89" },
      { label: "Dispersion", value: "0.057" },
    ],
    category: "demantoid-garnet",
    shape: "round",
    tint: "#62e052",
    ior: 1.89,
    fire: 0.022,
    home: { x: 0.36, y: 0.46, size: 0.46 },
    swing: -0.05,
  },
  {
    id: "emerald",
    name: "Emerald",
    cut: "Emerald cut",
    colour: "Green",
    intro:
      "The green variety of beryl, coloured by chromium and vanadium. Fine inclusions, known as the jardin, are typical of natural stones.",
    facts: [
      { label: "Mineral", value: "Beryl" },
      { label: "Hardness", value: "7.5–8 Mohs" },
      { label: "Refractive index", value: "1.57–1.59" },
      { label: "Crystal system", value: "Hexagonal" },
    ],
    category: "emerald",
    shape: "emerald",
    tint: "#1fcf82",
    ior: 1.58,
    fire: 0.008,
    home: { x: 0.74, y: 0.6, size: 0.36 },
    swing: 0.06,
  },
  {
    id: "blue",
    name: "Blue Gemstone",
    cut: "Square step cut",
    colour: "Blue",
    category: "other-gemstones",
    shape: "square",
    tint: "#3fb0ff",
    ior: 1.62,
    fire: 0.01,
    home: { x: 0.86, y: 0.2, size: 0.18 },
    swing: -0.07,
  },
  {
    id: "red",
    name: "Red Gemstone",
    cut: "Shield cut",
    colour: "Red",
    category: "other-gemstones",
    shape: "shield",
    tint: "#ff3b32",
    ior: 1.76,
    fire: 0.014,
    home: { x: 0.1, y: 0.2, size: 0.2 },
    swing: 0.07,
  },
  {
    id: "pink",
    name: "Pink Gemstone",
    cut: "Heart brilliant",
    colour: "Pink",
    category: "other-gemstones",
    shape: "heart",
    tint: "#ff86c0",
    ior: 1.74,
    fire: 0.02,
    home: { x: 0.12, y: 0.82, size: 0.2 },
    swing: -0.06,
  },
  {
    id: "purple",
    name: "Purple Gemstone",
    cut: "Hexagonal fancy cut",
    colour: "Purple",
    category: "other-gemstones",
    shape: "hexagon",
    tint: "#9a6bff",
    ior: 1.7,
    fire: 0.02,
    home: { x: 0.56, y: 0.1, size: 0.17 },
    swing: 0.05,
  },
  {
    id: "olive",
    name: "Yellow-Green Gemstone",
    cut: "Marquise fancy cut",
    colour: "Yellow-green",
    category: "other-gemstones",
    shape: "marquise",
    tint: "#d6d032",
    ior: 1.64,
    fire: 0.012,
    home: { x: 0.5, y: 0.92, size: 0.2 },
    swing: -0.05,
  },
  {
    id: "golden",
    name: "Golden Gemstone",
    cut: "Oval brilliant",
    colour: "Golden yellow",
    category: "other-gemstones",
    shape: "oval",
    tint: "#ffb62e",
    ior: 1.6,
    fire: 0.012,
    home: { x: 0.92, y: 0.9, size: 0.16 },
    swing: 0.06,
  },
];
