import type { StaticImageData } from "next/image";
import demantoidCollection from "@/assets/photos/demantoid-collection.jpg";
import faceted from "@/assets/photos/faceted-gemstones.jpg";
import rare from "@/assets/photos/rare-gemstones.jpg";
import rough from "@/assets/photos/rough-gemstones.jpg";

export interface Photo {
  src: StaticImageData;
  alt: string;
}

/**
 * Photography used across the page. To swap in a new picture, replace the file in
 * `src/assets/photos` (keeping its name) or point the entry at a different import.
 */
export const collectionPhotos: Partial<Record<string, Photo>> = {
  "demantoid-garnet": {
    src: demantoidCollection,
    alt: "A group of round faceted demantoid garnets",
  },
  "rough-gemstones": {
    src: rough,
    alt: "Rough green garnet crystals on their host rock",
  },
  "faceted-gemstones": {
    src: faceted,
    alt: "Blue square step-cut gemstone held in tweezers",
  },
  "rare-gemstones": {
    src: rare,
    alt: "Three bi-colour emerald-cut gemstones in a stone tray",
  },
};
