import Link from "next/link";
import { CollectionGlyph } from "@/components/collection-glyph";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { categories } from "@/lib/shop";
import type { GlyphKind } from "@/lib/site";

/** Line drawing shown in a slot when the 3D stones are unavailable. Same order as the categories. */
const fallbackGlyphs: readonly GlyphKind[] = ["brilliant", "step", "step", "ring"];

/** The four shop categories, each with the slot its 3D stone lands in. */
export function GemSlots() {
  return (
    <section id="shop-by-stone" aria-labelledby="slots-title" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading id="slots-title" eyebrow="The Shop" title="Choose Your Stone" align="center" />

        <ul className="mt-14 grid grid-cols-2 gap-4 sm:mt-20 sm:gap-6 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Reveal as="li" key={category.id} delay={0.06 * index}>
              <Link
                href={`/shop/${category.id}`}
                className="group flex h-full flex-col items-center border border-line bg-ink-soft px-4 pb-7 pt-5 text-center transition-colors duration-700 ease-luxe hover:border-gold/40 hover:bg-surface sm:px-6 sm:pb-9"
              >
                <span
                  data-gem-slot={index}
                  aria-hidden="true"
                  className="relative flex aspect-square w-full items-center justify-center"
                >
                  <span className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.07),transparent)]" />
                  <span className="absolute inset-x-[22%] bottom-[14%] h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                  <CollectionGlyph
                    kind={fallbackGlyphs[index] ?? "brilliant"}
                    className="gem-fallback size-1/2 text-gold/60"
                  />
                </span>
                <span className="mt-2 font-display text-2xl font-medium leading-tight text-ivory sm:text-3xl">
                  {category.name}
                </span>
                <span className="mt-4 text-[0.6875rem] font-normal uppercase tracking-[0.24em] text-gold transition-colors duration-500 group-hover:text-gold-soft">
                  Explore <span aria-hidden="true">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
