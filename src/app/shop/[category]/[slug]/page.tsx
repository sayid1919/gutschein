import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { LoopVideo } from "@/components/loop-video";
import { PageShell } from "@/components/page-shell";
import { getProduct, products } from "@/lib/products";
import { formatPrice, getCategory, productPath, shop, type SpecKey, specLabels } from "@/lib/shop";
import { siteUrl } from "@/lib/site";

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ category: product.category, slug: product.slug }));
}

async function resolve(params: ProductPageProps["params"]) {
  const { category, slug } = await params;
  const product = getProduct(slug);
  return product && product.category === category ? product : undefined;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await resolve(params);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: productPath(product) },
    openGraph: { images: product.images.map((image) => ({ url: image.src, alt: image.alt })) },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await resolve(params);
  if (!product) notFound();

  const category = getCategory(product.category);
  const specs = (Object.keys(specLabels) as SpecKey[]).flatMap((key) => {
    const value = product.specs?.[key];
    return value ? [{ label: specLabels[key], value }] : [];
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `${siteUrl}${image.src}`),
    category: category?.name,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}${productPath(product)}`,
      price: (product.price / 100).toFixed(2),
      priceCurrency: shop.currency.toUpperCase(),
      availability: product.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
  };

  return (
    <PageShell>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs font-normal uppercase tracking-[0.2em] text-mist">
          <li>
            <Link href="/shop" className="hover:text-ivory">
              Shop
            </Link>
          </li>
          {category ? (
            <li className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              <Link href={`/shop/${category.id}`} className="hover:text-ivory">
                {category.name}
              </Link>
            </li>
          ) : null}
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {product.video ? (
            <div className="relative aspect-[4/5] overflow-hidden border border-line bg-surface sm:col-span-2">
              <LoopVideo
                className="absolute inset-0 size-full object-cover"
                poster={product.video.poster}
                label={`Video of ${product.name}`}
                sources={[{ src: product.video.src, type: "video/mp4" }]}
              />
            </div>
          ) : null}
          {product.images.map((image, index) => (
            <div
              key={image.src}
              className={`relative aspect-[4/5] overflow-hidden border border-line bg-surface ${
                index === 0 && !product.video ? "sm:col-span-2" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0 && !product.video}
                sizes={
                  index === 0 && !product.video
                    ? "(min-width: 1024px) 640px, 100vw"
                    : "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                }
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          {category ? <p className="eyebrow">{category.name}</p> : null}
          <h1 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.08] text-ivory sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-6 text-2xl tabular-nums text-ivory">
            {product.sold ? <span className="text-mist">Sold</span> : formatPrice(product.price)}
          </p>
          <p className="mt-6 max-w-prose leading-relaxed text-ivory/85">{product.description}</p>

          <div className="mt-8">
            {product.sold ? (
              <p className="border border-line px-5 py-4 text-sm text-mist">
                This piece has been sold and is shown for reference.
              </p>
            ) : (
              <AddToCartButton slug={product.slug} name={product.name} />
            )}
          </div>

          {specs.length > 0 ? (
            <dl className="mt-10 border-t border-line">
              {specs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-6 border-b border-line py-4">
                  <dt className="text-xs font-normal uppercase tracking-[0.2em] text-mist">{spec.label}</dt>
                  <dd className="text-right text-ivory">{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </PageShell>
  );
}
