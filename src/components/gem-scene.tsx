"use client";

import { MeshRefractionMaterial, PresentationControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BackSide,
  BoxGeometry,
  Color,
  CubeCamera,
  type CubeTexture,
  type Group,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
  WebGLCubeRenderTarget,
} from "three";
import { createBrilliantGeometry } from "@/components/gem-geometry";

/** Deterministic pseudo-random numbers, so the studio lighting is identical on every visit. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * Renders a small "light studio" (dark room, a few softboxes and many pin lights) into a
 * cube map once. The gem refracts and reflects this map, which is what gives it sparkle.
 */
function useStudioEnvironment(): CubeTexture | null {
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
      side?: typeof BackSide,
    ) => {
      const material = new MeshBasicMaterial({
        color: new Color(color).multiplyScalar(intensity),
        toneMapped: false,
      });
      if (side !== undefined) material.side = side;
      const mesh = new Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.lookAt(0, 0, 0);
      studio.add(mesh);
      disposables.push(geometry, material);
    };

    add(new SphereGeometry(40, 32, 16), "#2a6b3c", 1, [0, 0, 0], BackSide);

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

    // Softboxes: large, moderately bright panels that give the stone its body colour
    const softTints = ["#ffffff", "#f3ffe6", "#fff6dc", "#d8ffd9"];
    for (let i = 0; i < 26; i += 1) {
      const width = 5 + random() * 7;
      const height = 5 + random() * 7;
      add(
        new BoxGeometry(width, height, 0.2),
        softTints[Math.floor(random() * softTints.length)] ?? "#ffffff",
        1.6 + random() * 2.4,
        onSphere(20),
      );
    }

    // Dark flags: without contrast between neighbouring facets a gem looks like glass
    for (let i = 0; i < 14; i += 1) {
      const size = 5 + random() * 6;
      add(new BoxGeometry(size, size, 0.2), "#020503", 1, onSphere(17));
    }

    // Pin lights: small and very bright, they become the flashes of fire
    const pinTints = ["#ffffff", "#fff3c4", "#ffd9a0", "#e4ffe9", "#cfe8ff"];
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

function Demantoid({ spin }: { spin: boolean }) {
  const group = useRef<Group>(null);
  const geometry = useMemo(() => createBrilliantGeometry(), []);
  const environment = useStudioEnvironment();

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (spin && group.current) group.current.rotation.y += Math.min(delta, 0.1) * 0.35;
  });

  if (!environment) return null;

  return (
    <group rotation={[0.95, 0, 0.12]}>
      <group ref={group}>
        <mesh geometry={geometry} scale={1.45}>
          <MeshRefractionMaterial
            envMap={environment}
            color="#6fe060"
            ior={1.89}
            bounces={3}
            fresnel={0.9}
            aberrationStrength={0.02}
            fastChroma
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

interface GemSceneProps {
  /** Rotate the stone continuously. Turned off for visitors who prefer reduced motion. */
  spin: boolean;
  /** Render frames only while the stone is on screen. */
  active: boolean;
}

export default function GemScene({ spin, active }: GemSceneProps) {
  return (
    <Canvas
      className="!absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      camera={{ position: [0, 0, 6.2], fov: 32 }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <PresentationControls
        global={false}
        cursor={false}
        snap
        speed={1.4}
        polar={[-0.5, 0.5]}
        azimuth={[-Math.PI / 2, Math.PI / 2]}
      >
        <Demantoid spin={spin} />
      </PresentationControls>
    </Canvas>
  );
}
