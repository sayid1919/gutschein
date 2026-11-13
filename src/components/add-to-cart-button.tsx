"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

const buttonClass =
  "inline-flex min-h-12 w-full items-center justify-center px-7 py-3 text-xs font-normal uppercase tracking-[0.24em] transition-colors duration-500 ease-luxe sm:w-auto";

export function AddToCartButton({ slug, name }: { slug: string; name: string }) {
  const { has, add, ready } = useCart();

  if (ready && has(slug)) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/cart" className={`${buttonClass} bg-ivory text-ink hover:bg-gold-soft`}>
          View cart
        </Link>
        <p role="status" className="text-sm text-mist">
          {name} is in your cart.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => add(slug)}
      className={`${buttonClass} bg-ivory text-ink hover:bg-gold-soft disabled:opacity-60`}
    >
      Add to cart
    </button>
  );
}
