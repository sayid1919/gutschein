import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import {
  BackSide,
  BoxGeometry,
  CanvasTexture,
  Color,
  CubeCamera,
  type CubeTexture,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
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

    // Soft-edged glow used for every light, so facets pick up gradients instead of hard patches.
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 128;
    const context = glowCanvas.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.45, "rgba(255,255,255,0.85)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
    }
    const glow = new CanvasTexture(glowCanvas);
    disposables.push(glow);

    const addLight = (
      width: number,
      height: number,
      color: string,
      intensity: number,
      position: [number, number, number],
    ) => {
      const geometry = new PlaneGeometry(width, height);
      const material = new MeshBasicMaterial({
        color: new Color(color).multiplyScalar(intensity),
        map: glow,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      });
      const mesh = new Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.lookAt(0, 0, 0);
      studio.add(mesh);
      disposables.push(geometry, material);
    };

    // The room: a neutral dark grey, so each stone's own colour decides how it looks.
    const roomGeometry = new SphereGeometry(40, 32, 16);
    const roomMaterial = new MeshBasicMaterial({ color: "#3b403d", side: BackSide, toneMapped: false });
    studio.add(new Mesh(roomGeometry, roomMaterial));
    disposables.push(roomGeometry, roomMaterial);

    const random = seeded(11);
    const onSphere = (distance: number): [number, number, number] => {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      return [
        distance * Math.sin(phi) * Math.cos(theta),
        distance * Math.cos(phi),
        distance * Math.sin(phi) * Math.sin(theta),
      ];
    };

    // Dark flags first (furthest out): contrast between neighbouring facets is what reads as "gem".
    for (let i = 0; i < 10; i += 1) {
      const size = 9 + random() * 8;
      const geometry = new BoxGeometry(size, size, 0.2);
      const material = new MeshBasicMaterial({ color: "#060807", toneMapped: false });
      const mesh = new Mesh(geometry, material);
      mesh.position.set(...onSphere(24));
      mesh.lookAt(0, 0, 0);
      studio.add(mesh);
      disposables.push(geometry, material);
    }

    // Softboxes: large, gentle lights that give a stone its body colour
    for (let i = 0; i < 22; i += 1) {
      addLight(9 + random() * 10, 9 + random() * 10, "#ffffff", 1.5 + random() * 2, onSphere(20));
    }

    // Pin lights: small and very bright, they become the flashes of fire
    const pinTints = ["#ffffff", "#fff3c4", "#ffe0b0", "#e8f1ff"];
    for (let i = 0; i < 60; i += 1) {
      const size = 1 + random() * 1.8;
      addLight(size, size, pinTints[Math.floor(random() * pinTints.length)] ?? "#ffffff", 7 + random() * 12, onSphere(14));
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
