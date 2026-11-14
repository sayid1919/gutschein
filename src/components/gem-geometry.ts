import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

/** Collects triangles for a convex faceted solid, winding each one to face outwards. */
function createFacetBuilder(centre: Vector3) {
  const positions: number[] = [];
  const edgeA = new Vector3();
  const edgeB = new Vector3();
  const normal = new Vector3();
  const middle = new Vector3();

  const triangle = (a: Vector3, b: Vector3, c: Vector3) => {
    normal.crossVectors(edgeA.subVectors(b, a), edgeB.subVectors(c, a));
    middle.copy(a).add(b).add(c).divideScalar(3).sub(centre);
    const ordered = normal.dot(middle) >= 0 ? [a, b, c] : [a, c, b];
    for (const point of ordered) positions.push(point.x, point.y, point.z);
  };
  const quad = (a: Vector3, b: Vector3, c: Vector3, d: Vector3) => {
    triangle(a, b, c);
    triangle(a, c, d);
  };
  const build = () => {
    // Vertices are not shared between facets, so every facet shades flat.
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    return geometry;
  };

  return { triangle, quad, build };
}

/** Point on a horizontal ring; `turn` is a fraction of a full rotation. */
function ring(radius: number, y: number, turn: number): Vector3 {
  const angle = turn * Math.PI * 2;
  return new Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle));
}

/**
 * Brilliant cut built facet by facet: table, 8 stars, 8 bezels and 16 upper girdle facets
 * on the crown; 8 mains and 16 lower girdle facets on the pavilion.
 *
 * @param elongation Width-to-length ratio of the outline. 1 is round; below 1 gives an oval.
 */
export function createBrilliantGeometry(elongation = 1): BufferGeometry {
  const { triangle, quad, build } = createFacetBuilder(new Vector3(0, -0.2, 0));
  const tableCentre = new Vector3(0, 0.3, 0);
  const culet = new Vector3(0, -0.86, 0);

  for (let i = 0; i < 8; i += 1) {
    const at = i / 8;
    const half = (i + 0.5) / 8;
    const next = (i + 1) / 8;
    const previousHalf = (i - 0.5) / 8;

    const table = ring(0.56, 0.3, at);
    const tableNext = ring(0.56, 0.3, next);
    const star = ring(0.8, 0.16, half);
    const starPrevious = ring(0.8, 0.16, previousHalf);

    const upperAt = ring(1, 0.018, at);
    const upperHalf = ring(1, 0.018, half);
    const upperNext = ring(1, 0.018, next);
    const lowerAt = ring(1, -0.018, at);
    const lowerHalf = ring(1, -0.018, half);
    const lowerNext = ring(1, -0.018, next);

    const pavilion = ring(0.5, -0.42, half);
    const pavilionPrevious = ring(0.5, -0.42, previousHalf);

    // Crown
    triangle(tableCentre, table, tableNext);
    triangle(table, tableNext, star);
    quad(table, star, upperAt, starPrevious);
    triangle(star, upperAt, upperHalf);
    triangle(star, upperHalf, upperNext);

    // Girdle
    quad(upperAt, upperHalf, lowerHalf, lowerAt);
    quad(upperHalf, upperNext, lowerNext, lowerHalf);

    // Pavilion
    quad(culet, pavilionPrevious, lowerAt, pavilion);
    triangle(pavilion, lowerAt, lowerHalf);
    triangle(pavilion, lowerHalf, lowerNext);
  }

  const geometry = build();
  if (elongation !== 1) geometry.scale(1, 1, elongation);
  return geometry;
}

export type Outline = readonly (readonly [number, number])[];

/** Eight-sided outline of an emerald or square cut: a rectangle with clipped corners. */
export function clippedRectangle(halfWidth: number, halfLength: number, corner: number): Outline {
  const w = halfWidth;
  const l = halfLength;
  const c = corner;
  return [
    [w - c, l],
    [w, l - c],
    [w, -l + c],
    [w - c, -l],
    [-w + c, -l],
    [-w, -l + c],
    [-w, l - c],
    [-w + c, l],
  ];
}

/** Heart outline, point downwards (towards +z), fitted to a radius of about 1. */
export function heartOutline(points = 32): Outline {
  return Array.from({ length: points }, (_, i) => {
    const t = (i / points) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const z = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return [x / 17, (z - 2.5) / 17] as const;
  });
}

/** Marquise (navette) outline: two arcs meeting in a point at each end. */
export function marquiseOutline(halfWidth = 0.52, points = 28): Outline {
  return Array.from({ length: points }, (_, i) => {
    const t = (i / points) * Math.PI * 2;
    const side = Math.cos(t);
    return [Math.sign(side) * halfWidth * Math.abs(side) ** 1.5, Math.sin(t)] as const;
  });
}

/** Elongated hexagon with a point at each side, every edge split once so the facets are finer. */
export function hexagonOutline(): Outline {
  const corners: Outline = [
    [1, 0],
    [0.52, 0.62],
    [-0.52, 0.62],
    [-1, 0],
    [-0.52, -0.62],
    [0.52, -0.62],
  ];
  return corners.flatMap((corner, i) => {
    const next = corners[(i + 1) % corners.length] ?? corner;
    return [corner, [(corner[0] + next[0]) / 2, (corner[1] + next[1]) / 2] as const];
  });
}

/** Shield (kite) outline: narrow at the top, widest at the shoulders, tapering to the bottom. */
export const SHIELD_OUTLINE: Outline = [
  [0.14, -1],
  [0.54, -0.46],
  [0.1, 1],
  [-0.1, 1],
  [-0.54, -0.46],
  [-0.14, -1],
];

const ringOf = (outline: Outline, scale: number, y: number, centreZ = 0): Vector3[] =>
  outline.map(([x, z]) => new Vector3(x * scale, y, centreZ + (z - centreZ) * scale));

/**
 * Step cut: facets arranged in parallel tiers on both the crown and the pavilion.
 * The outline must be convex.
 */
export function createStepCutGeometry(outline: Outline): BufferGeometry {
  const { triangle, quad, build } = createFacetBuilder(new Vector3(0, -0.2, 0));
  const count = outline.length;

  const tiers = [
    ringOf(outline, 0.62, 0.3), // table edge
    ringOf(outline, 0.8, 0.2),
    ringOf(outline, 0.93, 0.1),
    ringOf(outline, 1, 0.018), // girdle, upper edge
    ringOf(outline, 1, -0.018), // girdle, lower edge
    ringOf(outline, 0.76, -0.3),
    ringOf(outline, 0.46, -0.56),
    ringOf(outline, 0.12, -0.76), // culet
  ];

  for (let level = 0; level < tiers.length - 1; level += 1) {
    const upper = tiers[level];
    const lower = tiers[level + 1];
    if (!upper || !lower) continue;
    for (let i = 0; i < count; i += 1) {
      const a = upper[i];
      const b = upper[(i + 1) % count];
      const c = lower[(i + 1) % count];
      const d = lower[i];
      if (a && b && c && d) quad(a, b, c, d);
    }
  }

  const cap = (ringPoints: Vector3[] | undefined) => {
    const first = ringPoints?.[0];
    if (!ringPoints || !first) return;
    for (let i = 1; i < count - 1; i += 1) {
      const b = ringPoints[i];
      const c = ringPoints[i + 1];
      if (b && c) triangle(first, b, c);
    }
  };
  cap(tiers[0]);
  cap(tiers[tiers.length - 1]);

  return build();
}

/**
 * Brilliant-style cut for a fancy outline (heart, marquise, hexagon): triangular facets
 * between table, girdle and a pointed culet. The outline may be concave, as a heart is, as
 * long as every point is visible from `centreZ`; facets are therefore oriented by which
 * part of the stone they belong to, not by a shared centre.
 */
export function createFancyBrilliantGeometry(outline: Outline, centreZ = 0): BufferGeometry {
  const positions: number[] = [];
  const edgeA = new Vector3();
  const edgeB = new Vector3();
  const normal = new Vector3();
  const middle = new Vector3();

  /** Adds a triangle wound so that its normal satisfies `facesOut`. */
  const triangle = (a: Vector3, b: Vector3, c: Vector3, facesOut: (n: Vector3, m: Vector3) => boolean) => {
    normal.crossVectors(edgeA.subVectors(b, a), edgeB.subVectors(c, a));
    middle.copy(a).add(b).add(c).divideScalar(3);
    const ordered = facesOut(normal, middle) ? [a, b, c] : [a, c, b];
    for (const point of ordered) positions.push(point.x, point.y, point.z);
  };
  const up = (n: Vector3) => n.y >= 0;
  const down = (n: Vector3) => n.y <= 0;
  const sideways = (n: Vector3, m: Vector3) => n.x * m.x + n.z * (m.z - centreZ) >= 0;

  const count = outline.length;
  const table = ringOf(outline, 0.56, 0.3, centreZ);
  const crown = ringOf(outline, 0.82, 0.17, centreZ);
  const upper = ringOf(outline, 1, 0.018, centreZ);
  const lower = ringOf(outline, 1, -0.018, centreZ);
  const pavilion = ringOf(outline, 0.5, -0.44, centreZ);
  const tableCentre = new Vector3(0, 0.3, centreZ);
  const culet = new Vector3(0, -0.84, centreZ);

  for (let i = 0; i < count; i += 1) {
    const j = (i + 1) % count;
    const [t0, t1, c0, c1] = [table[i], table[j], crown[i], crown[j]];
    const [u0, u1, l0, l1] = [upper[i], upper[j], lower[i], lower[j]];
    const [p0, p1] = [pavilion[i], pavilion[j]];
    if (!t0 || !t1 || !c0 || !c1 || !u0 || !u1 || !l0 || !l1 || !p0 || !p1) continue;

    triangle(tableCentre, t0, t1, up);
    // Alternate the diagonal so neighbouring crown facets mirror each other.
    if (i % 2 === 0) {
      triangle(t0, t1, c0, up);
      triangle(t1, c1, c0, up);
      triangle(c0, c1, u0, up);
      triangle(c1, u1, u0, up);
    } else {
      triangle(t0, t1, c1, up);
      triangle(t0, c1, c0, up);
      triangle(c0, c1, u1, up);
      triangle(c0, u1, u0, up);
    }

    triangle(u0, u1, l1, sideways);
    triangle(u0, l1, l0, sideways);

    triangle(l0, l1, p0, down);
    triangle(l1, p1, p0, down);
    triangle(p0, p1, culet, down);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}
