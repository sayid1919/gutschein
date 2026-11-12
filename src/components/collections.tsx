import { CollectionGlyph } from "@/components/collection-glyph";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { collections } from "@/lib/site";

export function Collections() {
  return (
    <section id="collections" aria-labelledby="collections-title" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading id="collections-title" eyebrow="The House" title="Our Collections" />

        <ul className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <Reveal
              as="li"
              key={collection.id}
              delay={0.06 * index}
              className={collection.featured ? "sm:col-span-2" : undefined}
            >
              <article
                id={collection.id}
                className={`group relative flex h-full min-h-64 scroll-mt-28 flex-col justify-between gap-12 overflow-hidden p-7 transition-colors duration-700 ease-luxe sm:p-9 ${
                  collection.featured
                    ? "bg-[radial-gradient(40rem_22rem_at_100%_0%,rgb(18_64_43/0.9),transparent_70%)] bg-ink-soft hover:bg-surface"
                    : "bg-ink hover:bg-ink-soft"
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="text-xs font-normal tracking-[0.28em] text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <CollectionGlyph
                    kind={collection.glyph}
                    className={`shrink-0 transition-[color,transform] duration-700 ease-luxe group-hover:rotate-6 group-hover:scale-105 ${
                      collection.featured
                        ? "size-24 text-demantoid sm:size-28"
                        : "size-16 text-gold/70 group-hover:text-gold-soft"
                    }`}
                  />
                </div>

                <div>
                  {collection.featured ? <p className="eyebrow mb-4">Signature Collection</p> : null}
                  <h3
                    className={`font-display font-medium leading-tight text-ivory ${
                      collection.featured ? "text-4xl sm:text-5xl" : "text-3xl"
                    }`}
                  >
                    {collection.name}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-mist">{collection.summary}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
