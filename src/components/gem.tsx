import { useId } from "react";

type Point = readonly [number, number];

const CENTER = 100;
const TABLE_RADIUS = 40;
const STAR_RADIUS = 61;
const GIRDLE_RADIUS = 94;
const LIGHT_TURN = -0.14;

/** Point on a circle around the gem centre; `turn` is a fraction of a full rotation from 12 o'clock. */
function polar(radius: number, turn: number): Point {
  const angle = turn * Math.PI * 2 - Math.PI / 2;
  return [
    Math.round((CENTER + radius * Math.cos(angle)) * 100) / 100,
    Math.round((CENTER + radius * Math.sin(angle)) * 100) / 100,
  ];
}

interface Facet {
  points: readonly Point[];
  /** Angular position of the facet, used for shading. */
  turn: number;
  /** Base lightness of the facet family. */
  tone: number;
}

function buildFacets(): Facet[] {
  const facets: Facet[] = [];

  for (let i = 0; i < 8; i += 1) {
    const at = i / 8;
    const half = (i + 0.5) / 8;
    const next = (i + 1) / 8;
    const prevHalf = (i - 0.5) / 8;

    // Star facet, between two table corners.
    facets.push({
      points: [polar(TABLE_RADIUS, at), polar(TABLE_RADIUS, next), polar(STAR_RADIUS, half)],
      turn: half,
      tone: 46,
    });
    // Bezel (kite) facet, from a table corner out to the girdle.
    facets.push({
      points: [
        polar(TABLE_RADIUS, at),
        polar(STAR_RADIUS, half),
        polar(GIRDLE_RADIUS, at),
        polar(STAR_RADIUS, prevHalf),
      ],
      turn: at,
      tone: 34,
    });
    // Upper girdle facets, a pair either side of each star point.
    facets.push({
      points: [polar(STAR_RADIUS, half), polar(GIRDLE_RADIUS, at), polar(GIRDLE_RADIUS, half)],
      turn: at + 1 / 32,
      tone: 26,
    });
    facets.push({
      points: [polar(STAR_RADIUS, half), polar(GIRDLE_RADIUS, half), polar(GIRDLE_RADIUS, next)],
      turn: next - 1 / 32,
      tone: 40,
    });
  }

  return facets;
}

function facetFill({ turn, tone }: Facet): string {
  const facing = Math.cos((turn - LIGHT_TURN) * Math.PI * 2);
  const lightness = Math.round(tone + facing * 17);
  const hue = Math.round(134 - facing * 22);
  const saturation = Math.round(58 + facing * 10);
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

const toPath = (points: readonly Point[]) => points.map((p) => p.join(",")).join(" ");

const FACETS = buildFacets();
const TABLE = Array.from({ length: 8 }, (_, i) => polar(TABLE_RADIUS, i / 8));
const GIRDLE = Array.from({ length: 16 }, (_, i) => polar(GIRDLE_RADIUS, i / 16));

/** Facets that catch the light, with the colour of the flash and its animation delay. */
const GLINTS: readonly { facet: number; color: string; delay: string }[] = [
  { facet: 1, color: "#fff7d6", delay: "0s" },
  { facet: 6, color: "#ffd98a", delay: "1.4s" },
  { facet: 12, color: "#eaffef", delay: "2.6s" },
  { facet: 19, color: "#ffc48a", delay: "0.8s" },
  { facet: 24, color: "#f1ffd8", delay: "3.6s" },
  { facet: 29, color: "#fff7d6", delay: "4.4s" },
];

interface GemProps {
  className?: string;
  /** Slowly rotates the stone and lets individual facets glint. */
  animated?: boolean;
}

/** Top-down view of a round brilliant-cut demantoid, drawn facet by facet. Decorative. */
export function Gem({ className, animated = true }: GemProps) {
  const id = useId();
  const tableGradient = `${id}-table`;
  const sheenGradient = `${id}-sheen`;

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={tableGradient} cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#c9f5b8" />
          <stop offset="45%" stopColor="#4fbf6a" />
          <stop offset="100%" stopColor="#14613a" />
        </radialGradient>
        <linearGradient id={sheenGradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <g
        className={animated ? "origin-center animate-gem-turn" : undefined}
        style={{ transformBox: "fill-box" }}
      >
        <g stroke="rgb(236 255 240 / 0.22)" strokeWidth="0.35" strokeLinejoin="round">
          {FACETS.map((facet, index) => (
            <polygon key={index} points={toPath(facet.points)} fill={facetFill(facet)} />
          ))}
          <polygon points={toPath(TABLE)} fill={`url(#${tableGradient})`} />
        </g>

        {animated
          ? GLINTS.map(({ facet, color, delay }) => {
              const target = FACETS[facet];
              return target ? (
                <polygon
                  key={facet}
                  points={toPath(target.points)}
                  fill={color}
                  className="animate-facet-glint opacity-0"
                  style={{ animationDelay: delay }}
                />
              ) : null;
            })
          : null}
      </g>

      {/* Fixed light: stays put while the stone turns beneath it. */}
      <polygon points={toPath(GIRDLE)} fill={`url(#${sheenGradient})`} />
      <polygon
        points={toPath(GIRDLE)}
        fill="none"
        stroke="rgb(227 203 151 / 0.55)"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
