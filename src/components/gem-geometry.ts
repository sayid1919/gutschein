import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

const TABLE_RADIUS = 0.56;
const STAR_RADIUS = 0.8;
const CROWN_HEIGHT = 0.3;
const STAR_HEIGHT = 0.16;
const GIRDLE_HALF = 0.018;
const PAVILION_RADIUS = 0.5;
const PAVILION_DEPTH = 0.42;
const CULET_DEPTH = 0.86;

/** Point on a horizontal ring; `turn` is a fraction of a full rotation. */
function ring(radius: number, y: number, turn: number): Vector3 {
  const angle = turn * Math.PI * 2;
  return new Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle));
}

/**
 * Round brilliant cut built facet by facet: table, 8 stars, 8 bezels and 16 upper
 * girdle facets on the crown; 8 mains and 16 lower girdle facets on the pavilion.
 * Vertices are not shared between facets, so every facet shades flat.
 */
export function createBrilliantGeometry(): BufferGeometry {
  const centre = new Vector3(0, -0.2, 0);
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

  const tableCentre = new Vector3(0, CROWN_HEIGHT, 0);
  const culet = new Vector3(0, -CULET_DEPTH, 0);

  for (let i = 0; i < 8; i += 1) {
    const at = i / 8;
    const half = (i + 0.5) / 8;
    const next = (i + 1) / 8;
    const previousHalf = (i - 0.5) / 8;

    const table = ring(TABLE_RADIUS, CROWN_HEIGHT, at);
    const tableNext = ring(TABLE_RADIUS, CROWN_HEIGHT, next);
    const star = ring(STAR_RADIUS, STAR_HEIGHT, half);
    const starPrevious = ring(STAR_RADIUS, STAR_HEIGHT, previousHalf);

    const upperAt = ring(1, GIRDLE_HALF, at);
    const upperHalf = ring(1, GIRDLE_HALF, half);
    const upperNext = ring(1, GIRDLE_HALF, next);
    const lowerAt = ring(1, -GIRDLE_HALF, at);
    const lowerHalf = ring(1, -GIRDLE_HALF, half);
    const lowerNext = ring(1, -GIRDLE_HALF, next);

    const pavilion = ring(PAVILION_RADIUS, -PAVILION_DEPTH, half);
    const pavilionPrevious = ring(PAVILION_RADIUS, -PAVILION_DEPTH, previousHalf);

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

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}
