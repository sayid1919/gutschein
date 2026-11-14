"use client";

import { MeshRefractionMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { BufferGeometry, CubeTexture, Group, PerspectiveCamera } from "three";
import { GEM_COUNT, STAGE_SELECTOR, slotSelector } from "@/components/gem-anchors";
import { useStudioEnvironment } from "@/components/gem-environment";
import { createBrilliantGeometry, createStepCutGeometry } from "@/components/gem-geometry";

interface GemSpec {
  geometry: () => BufferGeometry;
  color: string;
  ior: number;
  /** Strength of the rainbow "fire". */
  fire: number;
  /** Where the stone floats in the hero, as fractions of the stage's width and height. */
  home: { x: number; y: number; size: number };
  /** Sideways swing during the flight, as a fraction of the viewport width. */
  swing: number;
}

/** One stone per shop category, in the same order as the slots on the page (`GEM_COUNT` entries). */
const GEMS: readonly GemSpec[] = [
  {
    geometry: () => createBrilliantGeometry(),
    color: "#93f27c",
    ior: 1.89,
    fire: 0.02,
    home: { x: 0.52, y: 0.5, size: 0.6 },
    swing: -0.05,
  },
  {
    geometry: () => createStepCutGeometry(0.72, 1, 0.2),
    color: "#19c279",
    ior: 1.58,
    fire: 0.008,
    home: { x: 0.14, y: 0.2, size: 0.27 },
    swing: 0.07,
  },
  {
    geometry: () => createStepCutGeometry(0.9, 0.9, 0.24),
    color: "#3fa9ff",
    ior: 1.62,
    fire: 0.01,
    home: { x: 0.88, y: 0.17, size: 0.24 },
    swing: -0.08,
  },
  {
    geometry: () => createBrilliantGeometry(0.74),
    color: "#ff6f9f",
    ior: 1.72,
    fire: 0.014,
    home: { x: 0.2, y: 0.86, size: 0.25 },
    swing: 0.06,
  },
];

const CAMERA_DISTANCE = 20;
const CAMERA_FOV = 18;
/** Later stones leave the hero slightly after earlier ones. */
const STAGGER = 0.09;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

interface FlyingGemProps {
  spec: GemSpec;
  index: number;
  environment: CubeTexture;
  /** False for visitors who prefer reduced motion: stones rest in their slots, without spinning. */
  animate: boolean;
  progress: { current: number };
}

function FlyingGem({ spec, index, environment, animate, progress }: FlyingGemProps) {
  const outer = useRef<Group>(null);
  const spinner = useRef<Group>(null);
  const geometry = useMemo(() => spec.geometry(), [spec]);
  const size = useThree((state) => state.size);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const group = outer.current;
    const stage = document.querySelector(STAGE_SELECTOR)?.getBoundingClientRect();
    const slot = document.querySelector(slotSelector(index))?.getBoundingClientRect();
    if (!group || !stage || !slot) return;

    const span = 1 - STAGGER * (GEM_COUNT - 1);
    const t = animate ? smooth(clamp01((progress.current - STAGGER * index) / span)) : 1;

    // Both ends are measured on screen each frame, so the stone scrolls with whichever it is at.
    const bob = animate ? Math.sin(state.clock.elapsedTime * 0.8 + index * 1.7) * 6 * (1 - t) : 0;
    const homeX = stage.left + stage.width * spec.home.x;
    const homeY = stage.top + stage.height * spec.home.y + bob;
    const slotX = slot.left + slot.width / 2;
    const slotY = slot.top + slot.height / 2;
    const x = mix(homeX, slotX, t) + Math.sin(t * Math.PI) * spec.swing * size.width;
    const y = mix(homeY, slotY, t);
    const diameter = mix(stage.width * spec.home.size, Math.min(slot.width, slot.height) * 0.72, t);

    const worldPerPixel =
      (2 * CAMERA_DISTANCE * Math.tan((CAMERA_FOV * Math.PI) / 360)) / size.height;
    group.position.set((x - size.width / 2) * worldPerPixel, -(y - size.height / 2) * worldPerPixel, 0);
    group.scale.setScalar((diameter / 2) * worldPerPixel);
    // Tilted towards the viewer in the hero, tumbling in flight, nearly face-up at rest.
    group.rotation.set(mix(0.95, 1.22, t), 0, Math.sin(t * Math.PI) * 0.7 + (1 - t) * 0.12);

    if (animate && spinner.current) {
      spinner.current.rotation.y += Math.min(delta, 0.1) * mix(0.35, 0.18, t);
    }
  });

  return (
    <group ref={outer}>
      <group ref={spinner}>
        <mesh geometry={geometry}>
          <MeshRefractionMaterial
            envMap={environment}
            color={spec.color}
            ior={spec.ior}
            bounces={3}
            fresnel={0.9}
            aberrationStrength={spec.fire}
            fastChroma
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function Journey({ animate, onReady }: { animate: boolean; onReady: () => void }) {
  const environment = useStudioEnvironment();
  const progress = useRef(0);
  const camera = useThree((state) => state.camera) as PerspectiveCamera;

  useEffect(() => {
    camera.position.set(0, 0, CAMERA_DISTANCE);
    camera.fov = CAMERA_FOV;
    camera.near = 1;
    camera.far = 60;
    camera.updateProjectionMatrix();
  }, [camera]);

  useEffect(() => {
    if (environment) onReady();
  }, [environment, onReady]);

  // Priority -1 runs this before the stones read `progress` in the same frame.
  useFrame((_, delta) => {
    const slot = document.querySelector(slotSelector(0))?.getBoundingClientRect();
    if (!slot) return;
    // The flight ends when the slots reach the middle of the screen.
    const slotCentre = slot.top + slot.height / 2 + window.scrollY;
    const end = Math.max(240, slotCentre - window.innerHeight * 0.55);
    const target = clamp01(window.scrollY / end);
    // Ease towards the scroll position so wheel steps do not make the stones jump.
    progress.current += (target - progress.current) * Math.min(1, delta * 9);
  }, -1);

  if (!environment) return null;

  return GEMS.map((spec, index) => (
    <FlyingGem
      key={index}
      spec={spec}
      index={index}
      environment={environment}
      animate={animate}
      progress={progress}
    />
  ));
}

interface GemJourneySceneProps {
  animate: boolean;
  /** Render frames only while the stones can be on screen. */
  active: boolean;
  onReady: () => void;
}

export default function GemJourneyScene({ animate, active, onReady }: GemJourneySceneProps) {
  return (
    <Canvas
      // The canvas covers the whole viewport, so it must never take clicks from the page below.
      style={{ pointerEvents: "none" }}
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <Journey animate={animate} onReady={onReady} />
    </Canvas>
  );
}
