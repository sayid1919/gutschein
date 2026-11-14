"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart-provider";

/** Empties the cart once an order has been paid for. Renders nothing. */
export function ClearCart() {
  const { ready, clear } = useCart();

  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);

  return null;
}
