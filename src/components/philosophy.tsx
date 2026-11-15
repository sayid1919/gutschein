import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Philosophy() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-title"
      className="border-y border-line bg-ink-soft py-24 sm:py-32"
    >
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <SectionHeading
          id="philosophy-title"
          eyebrow="Philosophy"
          title="The Art of Selecting Rare Gems"
        />

        <div className="lg:pt-10">
          <Reveal>
            <p className="text-balance font-display text-3xl italic leading-snug text-gold-soft sm:text-4xl">
              Every gemstone has its own character, history and natural beauty.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-mist">
              At Virelia, we believe that every exceptional stone deserves transparent information,
              careful presentation and individual attention.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
