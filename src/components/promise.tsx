import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { promises } from "@/lib/site";

export function Promise() {
  return (
    <section id="promise" aria-labelledby="promise-title" className="py-24 sm:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <SectionHeading
          id="promise-title"
          eyebrow="Swiss Standards"
          title="Our Promise"
          className="lg:sticky lg:top-32 lg:self-start"
        />

        <ol className="border-t border-line">
          {promises.map((promise, index) => (
            <Reveal
              as="li"
              key={promise}
              delay={0.05 * index}
              className="flex items-baseline gap-6 border-b border-line py-7 sm:gap-10 sm:py-9"
            >
              <span aria-hidden="true" className="w-8 shrink-0 text-xs font-normal tracking-[0.28em] text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-balance font-display text-2xl leading-snug text-ivory sm:text-3xl">
                {promise}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
