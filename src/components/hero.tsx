import { ButtonLink } from "@/components/button-link";
import { Gem } from "@/components/gem";
import { GemStage } from "@/components/gem-stage";
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

      <div className="container-page grid items-center gap-14 py-16 sm:py-20 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:py-24">
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
            <ButtonLink href="#collections">Our Collections</ButtonLink>
            <ButtonLink href="#demantoid" variant="outline" arrow>
              Explore Demantoid
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={0.2} offset={0} className="relative mx-auto w-full max-w-[21rem] sm:max-w-md lg:max-w-[34rem]">
          <div
            aria-hidden="true"
            className="absolute inset-[4%] animate-glow-breathe rounded-full bg-[radial-gradient(closest-side,rgb(111_210_122/0.32),transparent)] blur-2xl"
          />
          <GemStage fallback={<Gem animated={false} className="size-full" />} />
          <p className="mt-2 text-center text-[0.6875rem] uppercase tracking-[0.28em] text-mist">
            Drag to turn the stone
          </p>
        </Reveal>
      </div>

      <div aria-hidden="true" className="hairline" />
    </section>
  );
}
