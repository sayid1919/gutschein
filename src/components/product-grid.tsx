import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/shop";

export function ProductGrid({ products, emptyHref }: { products: readonly Product[]; emptyHref?: string }) {
  if (products.length === 0) {
    return (
      <div className="border border-line bg-ink-soft px-7 py-16 text-center sm:py-20">
        <p className="font-display text-3xl text-ivory">Nothing is listed here right now.</p>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-mist">
          Stones appear in the shop as soon as they have been photographed and described.
        </p>
        {emptyHref ? (
          <Link
            href={emptyHref}
            className="mt-8 inline-flex min-h-12 items-center border border-gold/50 px-7 text-xs font-normal uppercase tracking-[0.24em] text-ivory transition-colors duration-500 ease-luxe hover:border-gold-soft hover:bg-gold/10"
          >
            View the whole shop
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
