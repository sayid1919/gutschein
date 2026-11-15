import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/clear-cart";
import { PageShell } from "@/components/page-shell";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string | string[] }>;
}

async function wasPaid(sessionId: string | undefined): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe || !sessionId) return false;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid";
  } catch {
    return false;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const paid = await wasPaid(typeof sessionId === "string" ? sessionId : undefined);

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl text-center">
        {paid ? (
          <>
            <ClearCart />
            <p className="eyebrow">Order confirmed</p>
            <h1 className="mt-5 font-display text-5xl font-medium leading-[1.05] text-ivory sm:text-6xl">
              Thank you.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-mist">
              Your payment has been received.
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">Order</p>
            <h1 className="mt-5 font-display text-5xl font-medium leading-[1.05] text-ivory sm:text-6xl">
              We could not confirm this payment.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-mist">
              Nothing has been removed from your cart, so you can return to it and try again.
            </p>
          </>
        )}
        <Link
          href={paid ? "/shop" : "/cart"}
          className="mt-10 inline-flex min-h-12 items-center bg-ivory px-7 text-xs font-normal uppercase tracking-[0.24em] text-ink transition-colors duration-500 ease-luxe hover:bg-gold-soft"
        >
          {paid ? "Back to the shop" : "Return to cart"}
        </Link>
      </div>
    </PageShell>
  );
}
