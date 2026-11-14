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

/**
 * Step cut (emerald or square): an eight-sided outline with clipped corners, and facets
 * arranged in parallel tiers on both the crown and the pavilion.
 *
 * @param halfWidth Half the width of the outline (x axis).
 * @param halfLength Half the length of the outline (z axis).
 * @param corner How much of each corner is clipped, in the same units.
 */
export function createStepCutGeometry(halfWidth: number, halfLength: number, corner: number): BufferGeometry {
  const { triangle, quad, build } = createFacetBuilder(new Vector3(0, -0.2, 0));

  /** One tier: the outline scaled towards the centre, at height `y`. */
  const tier = (scale: number, y: number): Vector3[] => {
    const w = halfWidth * scale;
    const l = halfLength * scale;
    const c = corner * scale;
    return [
      new Vector3(w - c, y, l),
      new Vector3(w, y, l - c),
      new Vector3(w, y, -l + c),
      new Vector3(w - c, y, -l),
      new Vector3(-w + c, y, -l),
      new Vector3(-w, y, -l + c),
      new Vector3(-w, y, l - c),
      new Vector3(-w + c, y, l),
    ];
  };

  const tiers = [
    tier(0.62, 0.3), // table edge
    tier(0.8, 0.2),
    tier(0.93, 0.1),
    tier(1, 0.018), // girdle, upper edge
    tier(1, -0.018), // girdle, lower edge
    tier(0.76, -0.3),
    tier(0.46, -0.56),
    tier(0.12, -0.76), // culet
  ];

  for (let level = 0; level < tiers.length - 1; level += 1) {
    const upper = tiers[level];
    const lower = tiers[level + 1];
    if (!upper || !lower) continue;
    for (let i = 0; i < 8; i += 1) {
      const a = upper[i];
      const b = upper[(i + 1) % 8];
      const c = lower[(i + 1) % 8];
      const d = lower[i];
      if (a && b && c && d) quad(a, b, c, d);
    }
  }

  const cap = (outline: Vector3[] | undefined) => {
    const first = outline?.[0];
    if (!outline || !first) return;
    for (let i = 1; i < 7; i += 1) {
      const b = outline[i];
      const c = outline[i + 1];
      if (b && c) triangle(first, b, c);
    }
  };
  cap(tiers[0]);
  cap(tiers[tiers.length - 1]);

  return build();
}
