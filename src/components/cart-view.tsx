"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { products } from "@/lib/products";
import { formatPrice, isPurchasable, priceLabel, productPath } from "@/lib/shop";

export function CartView() {
  const { items, ready, remove } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) {
    return <p className="text-mist">Loading your cart…</p>;
  }

  const lines = items.flatMap((slug) => products.filter((product) => product.slug === slug));
  const available = lines.filter(isPurchasable);
  const total = available.reduce((sum, product) => sum + (product.price ?? 0), 0);

  if (lines.length === 0) {
    return (
      <div className="border border-line bg-ink-soft px-7 py-16 text-center">
        <p className="font-display text-3xl text-ivory">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-12 items-center bg-ivory px-7 text-xs font-normal uppercase tracking-[0.24em] text-ink transition-colors duration-500 ease-luxe hover:bg-gold-soft"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  async function checkout() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: available.map((product) => product.slug) }),
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Checkout could not be started. Please try again.");
      }
      window.location.assign(result.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Checkout could not be started. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-14">
      <ul className="border-t border-line">
        {lines.map((product) => {
          const [cover] = product.images;
          return (
            <li key={product.slug} className="flex gap-5 border-b border-line py-6">
              <div className="relative size-24 shrink-0 overflow-hidden bg-surface sm:size-28">
                <Image src={cover.src} alt={cover.alt} fill sizes="112px" className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h2 className="font-display text-2xl leading-snug text-ivory">
                  <Link href={productPath(product)} className="hover:text-gold-soft">
                    {product.name}
                  </Link>
                </h2>
                {product.specs?.weight ? <p className="mt-1 text-sm text-mist">{product.specs.weight}</p> : null}
                <p className={`mt-2 tabular-nums ${isPurchasable(product) ? "text-ivory" : "text-mist"}`}>
                  {priceLabel(product)}
                  {isPurchasable(product) ? null : " — cannot be ordered online"}
                </p>
                <button
                  type="button"
                  onClick={() => remove(product.slug)}
                  aria-label={`Remove ${product.name} from cart`}
                  className="mt-auto self-start pt-3 text-xs font-normal uppercase tracking-[0.2em] text-mist underline-offset-4 hover:text-ivory hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="summary-title" className="border border-line bg-ink-soft p-7">
        <h2 id="summary-title" className="eyebrow">
          Order summary
        </h2>
        <dl className="mt-6 space-y-3">
          <div className="flex justify-between gap-4">
            <dt className="text-mist">Subtotal</dt>
            <dd className="tabular-nums text-ivory">{formatPrice(total)}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={checkout}
          disabled={pending || available.length === 0}
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center bg-ivory px-7 text-xs font-normal uppercase tracking-[0.24em] text-ink transition-colors duration-500 ease-luxe hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Opening secure checkout…" : "Checkout"}
        </button>
        {error ? (
          <p role="alert" className="mt-4 text-sm leading-relaxed text-[#f0a79a]">
            {error}
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-mist">
          Payment is handled on a secure page by Stripe.
        </p>
      </section>
    </div>
  );
}
