import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import {
  BackSide,
  BoxGeometry,
  Color,
  CubeCamera,
  type CubeTexture,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
  WebGLCubeRenderTarget,
} from "three";

/** Deterministic pseudo-random numbers, so the studio lighting is identical on every visit. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * Renders a small "light studio" (softboxes, dark flags and many pin lights) into a cube
 * map once. The gems refract and reflect this map, which is what gives them sparkle.
 */
export function useStudioEnvironment(): CubeTexture | null {
  const gl = useThree((state) => state.gl);
  const [texture, setTexture] = useState<CubeTexture | null>(null);

  useEffect(() => {
    const target = new WebGLCubeRenderTarget(512, { type: HalfFloatType });
    const studio = new Scene();
    const disposables: { dispose: () => void }[] = [target];

    const add = (
      geometry: BoxGeometry | SphereGeometry,
      color: string,
      intensity: number,
      position: [number, number, number],
      inside = false,
    ) => {
      const material = new MeshBasicMaterial({
        color: new Color(color).multiplyScalar(intensity),
        toneMapped: false,
      });
      if (inside) material.side = BackSide;
      const mesh = new Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.lookAt(0, 0, 0);
      studio.add(mesh);
      disposables.push(geometry, material);
    };

    // Neutral grey room, so each stone's own colour decides how it looks.
    add(new SphereGeometry(40, 32, 16), "#5a5f5c", 1, [0, 0, 0], true);

    const random = seeded(7);
    const onSphere = (distance: number): [number, number, number] => {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      return [
        distance * Math.sin(phi) * Math.cos(theta),
        distance * Math.cos(phi),
        distance * Math.sin(phi) * Math.sin(theta),
      ];
    };

    // Softboxes: large, moderately bright panels that give a stone its body colour
    for (let i = 0; i < 26; i += 1) {
      const width = 5 + random() * 7;
      const height = 5 + random() * 7;
      add(new BoxGeometry(width, height, 0.2), "#ffffff", 1.6 + random() * 2.4, onSphere(20));
    }

    // Dark flags: without contrast between neighbouring facets a gem looks like glass
    for (let i = 0; i < 14; i += 1) {
      const size = 5 + random() * 6;
      add(new BoxGeometry(size, size, 0.2), "#020503", 1, onSphere(17));
    }

    // Pin lights: small and very bright, they become the flashes of fire
    const pinTints = ["#ffffff", "#fff3c4", "#ffd9a0", "#e8f1ff", "#cfe8ff"];
    for (let i = 0; i < 80; i += 1) {
      const size = 0.4 + random() * 1.2;
      add(
        new BoxGeometry(size, size, 0.1),
        pinTints[Math.floor(random() * pinTints.length)] ?? "#ffffff",
        8 + random() * 14,
        onSphere(14),
      );
    }

    const camera = new CubeCamera(0.1, 100, target);
    camera.update(gl, studio);
    setTexture(target.texture);

    return () => {
      for (const item of disposables) item.dispose();
    };
  }, [gl]);

  return texture;
}
