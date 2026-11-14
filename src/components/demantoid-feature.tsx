import { ButtonLink } from "@/components/button-link";
import { Reveal } from "@/components/reveal";
import { LoopVideo } from "@/components/loop-video";

export function DemantoidFeature() {
  return (
    <section id="demantoid" aria-labelledby="demantoid-title" className="pb-24 sm:pb-32">
      <div className="container-page">
        <div className="grid overflow-hidden border border-line bg-ink-soft lg:grid-cols-2">
          <div className="relative min-h-[20rem] sm:min-h-[26rem] lg:order-last lg:min-h-[36rem]">
            <LoopVideo
              className="absolute inset-0 size-full object-cover"
              poster="/media/demantoid-parcel-poster.jpg"
              label="A row of round faceted demantoid garnets in a stone tray"
              sources={[
                { src: "/media/demantoid-parcel.webm", type: "video/webm" },
                { src: "/media/demantoid-parcel.mp4", type: "video/mp4" },
              ]}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink-soft/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink-soft/70"
            />
          </div>

          <div className="flex flex-col justify-center px-7 py-14 sm:px-14 sm:py-20 lg:px-16">
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
              <p className="mt-7 max-w-md text-lg leading-relaxed text-ivory/85">
                Experience the extraordinary green brilliance of one of nature&rsquo;s most
                fascinating garnets.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <ButtonLink href="/shop/demantoid-garnet" arrow className="w-full sm:w-auto">
                Explore Demantoid
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
