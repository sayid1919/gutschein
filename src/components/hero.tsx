import { ButtonLink } from "@/components/button-link";
import { Gem } from "@/components/gem";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-16 sm:pt-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_78%_38%,rgb(18_64_43/0.75),transparent_70%),radial-gradient(40rem_30rem_at_0%_100%,rgb(203_171_108/0.08),transparent_70%)]"
      />

      <div className="container-page grid items-center gap-10 py-10 sm:gap-14 sm:py-16 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:py-24">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow">{site.tagline}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1
              id="hero-title"
              className="mt-6 text-balance font-display text-[clamp(3rem,11vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.01em] text-ivory"
            >
              Discover the <em className="text-gold-soft">Extraordinary.</em>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory/90 sm:text-xl">
              Explore a carefully curated world of natural gemstones, where rarity, beauty and
              authenticity come together.
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <p className="mt-5 max-w-xl leading-relaxed text-mist">
              Discover our exclusive Demantoid Garnet collection, featuring exceptional rough and
              faceted gemstones, alongside a selection of remarkable precious and semi-precious
              stones.
            </p>
          </Reveal>

          <Reveal delay={0.36} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/shop">Visit the Shop</ButtonLink>
            <ButtonLink href="/shop/demantoid-garnet" variant="outline" arrow>
              Explore Demantoid
            </ButtonLink>
          </Reveal>
        </div>

        {/* The 3D stones are drawn over this area by <GemJourney>; the drawing is their fallback. */}
        <div
          data-gem-stage
          aria-hidden="true"
          className="relative order-first mx-auto aspect-square w-full max-w-[16rem] sm:max-w-sm lg:order-none lg:max-w-[34rem]"
        >
          <div className="absolute inset-[6%] animate-glow-breathe rounded-full bg-[radial-gradient(closest-side,rgb(111_210_122/0.26),transparent)] blur-2xl" />
          <Gem animated={false} className="gem-fallback absolute inset-[20%] size-[60%]" />
        </div>
      </div>

      <div aria-hidden="true" className="hairline" />
    </section>
  );
}
