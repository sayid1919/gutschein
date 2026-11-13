import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { categories, productPath } from "@/lib/shop";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((category) => ({
      url: `${siteUrl}/shop/${category.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}${productPath(product)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
