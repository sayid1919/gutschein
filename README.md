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

Set `NEXT_PUBLIC_SITE_URL` to the public origin of the deployed site (see `.env.example`). It is used for canonical URLs, the sitemap and social previews.

## Structure

- `src/lib/site.ts` — all page copy, navigation and collection data
- `src/components` — page sections and shared UI. `GemStage` / `GemScene` render the interactive 3D demantoid (three.js via React Three Fiber); `Gem` is its static SVG fallback
- `src/assets/photos` — photography, registered in `src/lib/photos.ts`. The current files are AI-generated stand-ins: replace each file with a real photograph of the same name to swap it
- `src/app` — layout, metadata, sitemap, robots and the Open Graph image
