import { ButtonLink } from "@/components/button-link";
import { Gem } from "@/components/gem";
import { Reveal } from "@/components/reveal";

export function DemantoidFeature() {
  return (
    <section id="demantoid" aria-labelledby="demantoid-title" className="pb-24 sm:pb-32">
      <div className="container-page">
        <div className="relative isolate overflow-hidden border border-line bg-[radial-gradient(48rem_30rem_at_85%_50%,rgb(18_64_43),transparent_72%)] bg-ink-soft px-7 py-16 sm:px-14 sm:py-24 lg:px-20">
          <Gem
            animated={false}
            className="pointer-events-none absolute -right-28 top-1/2 -z-10 w-80 -translate-y-1/2 opacity-30 sm:-right-20 sm:w-[26rem] sm:opacity-45 lg:right-10 lg:w-[30rem] lg:opacity-90"
          />

          <div className="max-w-xl">
            <Reveal>
              <p className="eyebrow">Signature Collection</p>
              <h2
                id="demantoid-title"
                className="mt-5 text-balance font-display text-4xl font-medium leading-[1.08] text-ivory sm:text-5xl lg:text-6xl"
              >
                Discover Our Demantoid Collection
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 text-lg leading-relaxed text-ivory/85">
                Experience the extraordinary green brilliance of one of nature&rsquo;s most
                fascinating garnets.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <ButtonLink href="#demantoid-garnet" arrow className="w-full sm:w-auto">
                Explore Demantoid
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
