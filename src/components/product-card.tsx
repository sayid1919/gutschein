import Image from "next/image";
import Link from "next/link";
import { getCategory, priceLabel, type Product, productPath } from "@/lib/shop";

export function ProductCard({ product }: { product: Product }) {
  const [cover] = product.images;
  const category = getCategory(product.category);

  return (
    <article className="group relative flex h-full flex-col border border-line bg-ink-soft">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 100vw"
          className={`object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-105 ${
            product.sold ? "opacity-50" : ""
          }`}
        />
        {product.sold ? (
          <p className="absolute left-4 top-4 bg-ink/85 px-3 py-1.5 text-[0.6875rem] font-normal uppercase tracking-[0.24em] text-ivory">
            Sold
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {category ? <p className="eyebrow">{category.name}</p> : null}
        <h3 className="mt-3 font-display text-2xl font-medium leading-snug text-ivory">
          <Link href={productPath(product)} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        {product.specs?.weight ? <p className="mt-1 text-sm text-mist">{product.specs.weight}</p> : null}
        <p
          className={`mt-auto pt-5 text-base font-normal tabular-nums ${
            product.sold || product.price === undefined ? "text-mist" : "text-ivory"
          }`}
        >
          {priceLabel(product)}
        </p>
      </div>
    </article>
  );
}
