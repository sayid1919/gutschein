import Image from "next/image";
import Link from "next/link";
import { CollectionGlyph } from "@/components/collection-glyph";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { collectionPhotos } from "@/lib/photos";
import { collections } from "@/lib/site";

export function Collections() {
  return (
    <section id="collections" aria-labelledby="collections-title" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading id="collections-title" eyebrow="The House" title="Our Collections" />

        <ul className="mt-14 grid gap-5 sm:mt-20 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {collections.map((collection, index) => {
            const photo = collectionPhotos[collection.id];
            const featured = Boolean(collection.featured);

            return (
              <Reveal
                as="li"
                key={collection.id}
                delay={0.06 * index}
                className={featured ? "sm:col-span-2" : undefined}
              >
                <article
                  id={collection.id}
                  className="group relative isolate flex h-full min-h-[22rem] scroll-mt-28 flex-col justify-end overflow-hidden border border-line bg-ink-soft sm:min-h-[26rem]"
                >
                  {photo ? (
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      placeholder="blur"
                      sizes={
                        featured
                          ? "(min-width: 1024px) 800px, (min-width: 640px) 92vw, 100vw"
                          : "(min-width: 1024px) 400px, (min-width: 640px) 46vw, 100vw"
                      }
                      className="-z-20 object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-105"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 -z-20 flex items-start justify-center bg-[radial-gradient(22rem_16rem_at_50%_30%,rgb(203_171_108/0.16),transparent_70%)] pt-14"
                    >
                      <CollectionGlyph
                        kind={collection.glyph}
                        className="size-32 text-gold/70 transition-transform duration-[1400ms] ease-luxe group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-transparent"
                  />

                  <div className="p-7 sm:p-9">
                    <p className="text-xs font-normal uppercase tracking-[0.28em] text-gold">
                      {featured ? "Signature Collection" : "Collection"}
                    </p>
                    <h3
                      className={`mt-3 font-display font-medium leading-tight text-ivory ${
                        featured ? "text-4xl sm:text-5xl" : "text-3xl"
                      }`}
                    >
                      <Link href={collection.href} className="after:absolute after:inset-0">
                        {collection.name}
                      </Link>
                    </h3>
                    <p className="mt-3 max-w-md leading-relaxed text-ivory/80">{collection.summary}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
