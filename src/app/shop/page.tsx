import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ProductGrid } from "@/components/product-grid";
import { ShopHeader } from "@/components/shop-header";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Natural gemstones and fine jewelry from Virelia Gemhouse: demantoid garnet, emerald and other remarkable stones.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <PageShell>
      <ShopHeader
        title="The Shop"
        intro="Every stone is one of a kind. What you see here is what is available today."
      />
      <div className="mt-12 sm:mt-16">
        <ProductGrid products={products} />
      </div>
    </PageShell>
  );
}
