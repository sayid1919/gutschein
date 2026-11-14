import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { isPurchasable, productPath, shop } from "@/lib/shop";
import { siteUrl } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return fail(503, "Online payment is not switched on yet.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "The request could not be read.");
  }

  const requested = (body as { items?: unknown } | null)?.items;
  if (
    !Array.isArray(requested) ||
    requested.length === 0 ||
    requested.length > shop.maxItemsPerOrder ||
    !requested.every((entry): entry is string => typeof entry === "string")
  ) {
    return fail(400, "Your cart could not be read. Please reload the page and try again.");
  }

  // Prices and availability always come from the server's catalogue, never from the browser.
  const slugs = [...new Set(requested)];
  const items = slugs.map((slug) => getProduct(slug));
  if (items.some((product) => !product)) {
    return fail(400, "An item in your cart is no longer listed. Please remove it and try again.");
  }
  const products = items.filter((product) => product !== undefined);
  const unavailable = products.find((product) => !isPurchasable(product));
  if (unavailable) {
    return fail(409, `${unavailable.name} cannot be ordered online. Please remove it from your cart.`);
  }

  const origin = request.headers.get("origin") ?? siteUrl;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: products.map((product) => ({
        quantity: 1,
        price_data: {
          currency: shop.currency,
          unit_amount: Math.round((product.price ?? 0) * 100),
          product_data: {
            name: product.name,
            images: [`${siteUrl}${product.images[0].src}`],
            metadata: { slug: product.slug, path: productPath(product) },
          },
        },
      })),
      metadata: { items: products.map((product) => product.slug).join(",").slice(0, 500) },
      shipping_address_collection: { allowed_countries: [...shop.shippingCountries] },
      phone_number_collection: { enabled: true },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    if (!session.url) throw new Error("Stripe returned a session without a URL.");
    return NextResponse.json({ url: session.url });
  } catch (cause) {
    console.error("Stripe checkout session could not be created", cause);
    return fail(502, "Checkout could not be started. Please try again in a moment.");
  }
}
