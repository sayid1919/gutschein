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
- `src/components` — page sections and shared UI (`Gem` and `CollectionGlyph` are procedural SVG artwork)
- `src/app` — layout, metadata, sitemap, robots and the Open Graph image
