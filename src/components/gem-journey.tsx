"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useCallback, useEffect, useState } from "react";
import { GEM_COUNT, slotSelector } from "@/components/gem-anchors";

const GemJourneyScene = dynamic(() => import("@/components/gem-journey-scene"), { ssr: false });

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The 3D gemstones of the landing page. They float in the hero and, as the visitor
 * scrolls, each flies down into its own slot in the section below.
 *
 * The stones are drawn on one fixed, click-through canvas above the page. While they are
 * showing, `data-gems` on the root element hides the static artwork they replace:
 * "flying" when they start in the hero, "resting" when they stay in their slots
 * (reduced motion). Without WebGL nothing is set and the static artwork stays.
 */
export function GemJourney() {
  const [enabled, setEnabled] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEnabled(supportsWebGL());

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setAnimate(!motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);

    // Stop rendering once the last slot has scrolled well above the screen, or the tab is hidden.
    const update = () => {
      const last = document.querySelector(slotSelector(GEM_COUNT - 1))?.getBoundingClientRect();
      setActive(!document.hidden && (!last || last.bottom > -200));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", update);

    return () => {
      motion.removeEventListener("change", onMotion);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (enabled && ready) root.dataset.gems = animate ? "flying" : "resting";
    else delete root.dataset.gems;
    return () => {
      delete root.dataset.gems;
    };
  }, [enabled, ready, animate]);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setEnabled(false), []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-1000 ease-luxe ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <SceneBoundary onError={onError}>
        <GemJourneyScene animate={animate} active={active} onReady={onReady} />
      </SceneBoundary>
    </div>
  );
}
