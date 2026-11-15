import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ProductGrid } from "@/components/product-grid";
import { ShopHeader } from "@/components/shop-header";
import { productsIn } from "@/lib/products";
import { categories, getCategory } from "@/lib/shop";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return {
    title: category.name,
    description: category.summary,
    alternates: { canonical: `/shop/${category.id}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  return (
    <PageShell>
      <ShopHeader title={category.name} intro={category.summary} active={category.id} />
      <div className="mt-12 sm:mt-16">
        <ProductGrid products={productsIn(category.id)} emptyHref="/shop" />
      </div>
    </PageShell>
  );
}
