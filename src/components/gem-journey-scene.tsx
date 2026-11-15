"use client";

import { MeshRefractionMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import type { BufferGeometry, CubeTexture, Group, PerspectiveCamera } from "three";
import { slotSelector, STAGE_SELECTOR } from "@/components/gem-anchors";
import { useStudioEnvironment } from "@/components/gem-environment";
import {
  clippedRectangle,
  createBrilliantGeometry,
  createFancyBrilliantGeometry,
  createStepCutGeometry,
  heartOutline,
  hexagonOutline,
  marquiseOutline,
  SHIELD_OUTLINE,
} from "@/components/gem-geometry";
import { type GemShape, showcase, type ShowcaseGem } from "@/lib/showcase";

const geometries: Record<GemShape, () => BufferGeometry> = {
  round: () => createBrilliantGeometry(),
  oval: () => createBrilliantGeometry(0.74),
  emerald: () => createStepCutGeometry(clippedRectangle(0.72, 1, 0.2)),
  square: () => createStepCutGeometry(clippedRectangle(0.9, 0.9, 0.24)),
  shield: () => createStepCutGeometry(SHIELD_OUTLINE),
  heart: () => createFancyBrilliantGeometry(heartOutline(), -0.12),
  marquise: () => createFancyBrilliantGeometry(marquiseOutline()),
  hexagon: () => createFancyBrilliantGeometry(hexagonOutline()),
};

const CAMERA_DISTANCE = 20;
const CAMERA_FOV = 18;
/** Later stones leave the hero slightly after earlier ones. */
const STAGGER = 0.05;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

export type HitTargets = RefObject<(HTMLButtonElement | null)[]>;

interface FlyingGemProps {
  gem: ShowcaseGem;
  index: number;
  environment: CubeTexture;
  /** False for visitors who prefer reduced motion: stones rest in their slots, without spinning. */
  animate: boolean;
  progress: { current: number };
  hits: HitTargets;
}

function FlyingGem({ gem, index, environment, animate, progress, hits }: FlyingGemProps) {
  const outer = useRef<Group>(null);
  const spinner = useRef<Group>(null);
  const geometry = useMemo(() => geometries[gem.shape](), [gem.shape]);
  const size = useThree((state) => state.size);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const group = outer.current;
    const stage = document.querySelector(STAGE_SELECTOR)?.getBoundingClientRect();
    const slot = document.querySelector(slotSelector(index))?.getBoundingClientRect();
    if (!group || !stage || !slot) return;

    const span = 1 - STAGGER * (showcase.length - 1);
    const t = animate ? smooth(clamp01((progress.current - STAGGER * index) / span)) : 1;

    // Both ends are measured on screen each frame, so the stone scrolls with whichever it is at.
    const bob = animate ? Math.sin(state.clock.elapsedTime * 0.8 + index * 1.7) * 6 * (1 - t) : 0;
    const homeX = stage.left + stage.width * gem.home.x;
    const homeY = stage.top + stage.height * gem.home.y + bob;
    const slotX = slot.left + slot.width / 2;
    const slotY = slot.top + slot.height / 2;
    const x = mix(homeX, slotX, t) + Math.sin(t * Math.PI) * gem.swing * size.width;
    const y = mix(homeY, slotY, t);
    const diameter = mix(stage.width * gem.home.size, Math.min(slot.width, slot.height) * 0.74, t);

    // Skip stones that are entirely off screen; the refraction shader is the expensive part.
    group.visible = y > -diameter && y < size.height + diameter;

    const worldPerPixel =
      (2 * CAMERA_DISTANCE * Math.tan((CAMERA_FOV * Math.PI) / 360)) / size.height;
    group.position.set((x - size.width / 2) * worldPerPixel, -(y - size.height / 2) * worldPerPixel, 0);
    group.scale.setScalar((diameter / 2) * worldPerPixel);
    // Tilted towards the viewer in the hero, tumbling in flight, nearly face-up at rest.
    group.rotation.set(mix(1.0, 1.3, t), 0, Math.sin(t * Math.PI) * 0.7 + (1 - t) * 0.12);

    if (animate && spinner.current) {
      spinner.current.rotation.y += Math.min(delta, 0.1) * mix(0.3, 0.16, t);
    }

    // Keep the invisible click target on top of the stone.
    const hit = hits.current[index];
    if (hit) {
      hit.style.width = hit.style.height = `${diameter}px`;
      hit.style.transform = `translate3d(${x - diameter / 2}px, ${y - diameter / 2}px, 0)`;
    }
  });

  return (
    <group ref={outer}>
      <group ref={spinner}>
        <mesh geometry={geometry}>
          <MeshRefractionMaterial
            envMap={environment}
            color={gem.tint}
            ior={gem.ior}
            bounces={4}
            fresnel={1}
            aberrationStrength={gem.fire}
            fastChroma
          />
        </mesh>
      </group>
    </group>
  );
}

function Journey({ animate, onReady, hits }: { animate: boolean; onReady: () => void; hits: HitTargets }) {
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
    // The flight ends when the first row of slots reaches the middle of the screen.
    const slotCentre = slot.top + slot.height / 2 + window.scrollY;
    const end = Math.max(240, slotCentre - window.innerHeight * 0.5);
    const target = clamp01(window.scrollY / end);
    // Ease towards the scroll position so wheel steps do not make the stones jump.
    progress.current += (target - progress.current) * Math.min(1, delta * 9);
  }, -1);

  if (!environment) return null;

  return showcase.map((gem, index) => (
    <FlyingGem
      key={gem.id}
      gem={gem}
      index={index}
      environment={environment}
      animate={animate}
      progress={progress}
      hits={hits}
    />
  ));
}

interface GemJourneySceneProps {
  animate: boolean;
  /** Render frames only while the stones can be on screen. */
  active: boolean;
  onReady: () => void;
  /** Buttons that the scene keeps positioned over each stone. */
  hits: HitTargets;
}

export default function GemJourneyScene({ animate, active, onReady, hits }: GemJourneySceneProps) {
  return (
    <Canvas
      // The canvas covers the whole viewport, so it must never take clicks from the page below.
      style={{ pointerEvents: "none" }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <Journey animate={animate} onReady={onReady} hits={hits} />
    </Canvas>
  );
}
