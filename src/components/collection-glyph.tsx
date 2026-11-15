import type { ReactNode } from "react";
import type { GlyphKind } from "@/lib/site";

function ring(radius: number, count: number, offset = 0): [number, number][] {
  return Array.from({ length: count }, (_, i) => {
    const angle = ((i + offset) / count) * Math.PI * 2 - Math.PI / 2;
    return [
      Math.round((32 + radius * Math.cos(angle)) * 100) / 100,
      Math.round((32 + radius * Math.sin(angle)) * 100) / 100,
    ];
  });
}

const join = (points: readonly (readonly [number, number])[]) =>
  points.map((p) => p.join(",")).join(" ");

function Brilliant() {
  const table = ring(11, 8);
  const stars = ring(18, 8, 0.5);
  const girdle = ring(27, 8);

  return (
    <>
      <circle cx="32" cy="32" r="27" />
      <polygon points={join(table)} />
      {table.map((corner, i) => {
        const star = stars[i];
        const previousStar = stars[(i + 7) % 8];
        const edge = girdle[i];
        if (!star || !previousStar || !edge) return null;
        return <polyline key={i} points={join([previousStar, corner, star, edge, previousStar])} />;
      })}
    </>
  );
}

const glyphs: Record<GlyphKind, () => ReactNode> = {
  brilliant: Brilliant,
  rough: () => (
    <>
      <polygon points="12,40 19,17 36,7 51,20 55,43 39,57 21,54" />
      <polyline points="19,17 30,31 51,20" />
      <polyline points="12,40 30,31 39,57" />
      <line x1="36" y1="7" x2="30" y2="31" />
    </>
  ),
  step: () => (
    <>
      <polygon points="18,7 46,7 55,16 55,48 46,57 18,57 9,48 9,16" />
      <polygon points="21,14 43,14 48,19 48,45 43,50 21,50 16,45 16,19" />
      <rect x="24" y="22" width="16" height="20" />
      <path d="M18 7 24 22M9 16 24 22M46 7 40 22M55 16 40 22M55 48 40 42M46 57 40 42M18 57 24 42M9 48 24 42" />
    </>
  ),
  trillion: () => (
    <>
      <polygon points="32,7 57,51 7,51" />
      <polygon points="32,24 42.5,42 21.5,42" />
      <path d="M32 7V24M57 51 42.5 42M7 51 21.5 42" />
      <path d="M32 24 44.5 29 42.5 42 32 51 21.5 42 19.5 29Z" />
    </>
  ),
  ring: () => (
    <>
      <circle cx="32" cy="43" r="15" />
      <circle cx="32" cy="43" r="11.5" />
      <polygon points="24,9 40,9 46,16 32,29 18,16" />
      <polyline points="18,16 46,16" />
      <polyline points="24,9 28,16 32,9 36,16 40,9" />
      <polyline points="28,16 32,29 36,16" />
    </>
  ),
};

/** Fine-line illustration of a gemstone cut. Decorative; inherits `currentColor`. */
export function CollectionGlyph({ kind, className }: { kind: GlyphKind; className?: string }) {
  const Shape = glyphs[kind];

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <Shape />
    </svg>
  );
}
