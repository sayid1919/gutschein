# Virelia Gemhouse

Landing page for Virelia Gemhouse — rare gems, Swiss standards.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4 and Framer Motion.

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the public origin of the deployed site (see `.env.example`). It is used for canonical URLs, the sitemap, social previews and the product images shown on Stripe's checkout page.

## Shop

- **Inventory** lives in `src/lib/products.ts`; the file explains how to list a stone. Photos and videos go in `public/products/<slug>/`.
- **Categories, currency (CHF) and shipping countries** are set in `src/lib/shop.ts`.
- **Payments** use Stripe Checkout. Set `STRIPE_SECRET_KEY` to switch them on; without it the shop works as a catalogue and checkout reports that online payment is off.
- Prices are always read from the server's catalogue, never from the browser.
- Every stone is unique. After a sale, set `sold: true` on its entry and redeploy; nothing marks it sold automatically.

## Structure

- `src/lib/site.ts` — all page copy, navigation and collection data
- `src/components` — page sections and shared UI. `GemStage` / `GemScene` render the interactive 3D demantoid (three.js via React Three Fiber); `Gem` is its static SVG fallback
- `src/assets/photos` — photography, registered in `src/lib/photos.ts`. The current files are AI-generated stand-ins: replace each file with a real photograph of the same name to swap it
- `src/app` — layout, metadata, sitemap, robots and the Open Graph image
