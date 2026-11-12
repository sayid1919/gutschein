import type { StaticImageData } from "next/image";
import demantoidCollection from "@/assets/photos/demantoid-collection.jpg";
import demantoidFeature from "@/assets/photos/demantoid-feature.jpg";
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
    alt: "Faceted demantoid garnets in several cuts beside a rough crystal, on dark slate",
  },
  "rough-gemstones": {
    src: rough,
    alt: "Rough green garnet crystals on their host rock",
  },
  "faceted-gemstones": {
    src: faceted,
    alt: "Loose faceted gemstones in a range of colours and cuts",
  },
  "rare-gemstones": {
    src: rare,
    alt: "Three rare gemstones resting in an open gem parcel paper",
  },
};

export const demantoidFeaturePhoto: Photo = {
  src: demantoidFeature,
  alt: "Round brilliant-cut demantoid garnet showing green brilliance and fire",
};
