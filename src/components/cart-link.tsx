"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartLink({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { items, ready } = useCart();
  const count = ready ? items.length : 0;

  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      aria-label={count === 1 ? "Cart, 1 item" : `Cart, ${count} items`}
      className={className}
    >
      Cart
      <span aria-hidden="true" className="ml-2 tabular-nums text-gold">
        {count}
      </span>
    </Link>
  );
}
