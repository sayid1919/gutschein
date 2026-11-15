import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <PageShell>
      <h1 className="font-display text-5xl font-medium leading-[1.05] text-ivory sm:text-6xl">Your Cart</h1>
      <div className="mt-10 sm:mt-14">
        <CartView />
      </div>
    </PageShell>
  );
}
