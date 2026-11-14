import Stripe from "stripe";

let client: Stripe | null | undefined;

/** The Stripe client, or null when no secret key is configured (payments are then switched off). */
export function getStripe(): Stripe | null {
  if (client === undefined) {
    const key = process.env.STRIPE_SECRET_KEY;
    client = key ? new Stripe(key) : null;
  }
  return client;
}
