"use client";

import { useCallback, useState } from "react";
import { CollectionGlyph } from "@/components/collection-glyph";
import { GemDialog } from "@/components/gem-dialog";
import { GemJourney } from "@/components/gem-journey";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Spotlight } from "@/components/spotlight";
import { type GemShape, showcase, type ShowcaseGem } from "@/lib/showcase";
import type { GlyphKind } from "@/lib/site";

/** Line drawing shown in a slot when the 3D stones are unavailable. */
const fallbackGlyph: Record<GemShape, GlyphKind> = {
  round: "brilliant",
  oval: "brilliant",
  emerald: "step",
  square: "step",
  shield: "trillion",
  heart: "brilliant",
  marquise: "brilliant",
  hexagon: "step",
};

/**
 * The stones of the house: one slot per stone, which its 3D model flies into from the
 * hero. Choosing a stone, by its slot or by clicking the model itself, opens its details.
 */
export function GemShowcase() {
  const [selected, setSelected] = useState<ShowcaseGem | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="stones" aria-labelledby="stones-title" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading id="stones-title" eyebrow="The Stones" title="Choose a Stone" align="center" />
        <p className="mx-auto mt-5 max-w-md text-center leading-relaxed text-mist">
          Select any stone to see its details.
        </p>

        <ul className="mt-14 grid grid-cols-2 gap-4 sm:mt-20 sm:gap-6 lg:grid-cols-4">
          {showcase.map((gem, index) => (
            <Reveal as="li" key={gem.id} delay={0.05 * (index % 4)}>
              <Spotlight className="h-full border border-line bg-ink-soft transition-colors duration-700 ease-luxe hover:border-gold/40">
                <button
                  type="button"
                  onClick={() => setSelected(gem)}
                  aria-haspopup="dialog"
                  className="group flex h-full w-full flex-col items-center px-4 pb-7 pt-5 text-center sm:px-6 sm:pb-9"
                >
                  <span
                    data-gem-slot={index}
                    aria-hidden="true"
                    className="relative flex aspect-square w-full items-center justify-center"
                  >
                    <span
                      className="absolute inset-[16%] rounded-full opacity-25 blur-2xl transition-opacity duration-700 group-hover:opacity-45"
                      style={{ backgroundColor: gem.tint }}
                    />
                    <span className="absolute inset-x-[22%] bottom-[12%] h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                    <CollectionGlyph
                      kind={fallbackGlyph[gem.shape]}
                      className="gem-fallback size-1/2 text-gold/60"
                    />
                  </span>
                  <span className="mt-2 font-display text-2xl font-medium leading-tight text-ivory sm:text-[1.75rem]">
                    {gem.name}
                  </span>
                  <span className="mt-2 text-sm text-mist">{gem.cut}</span>
                  <span className="mt-4 text-[0.6875rem] font-normal uppercase tracking-[0.24em] text-gold transition-colors duration-500 group-hover:text-gold-soft">
                    Details
                  </span>
                </button>
              </Spotlight>
            </Reveal>
          ))}
        </ul>
      </div>

      <GemJourney onSelect={setSelected} />
      <GemDialog gem={selected} onClose={close} />
    </section>
  );
}
