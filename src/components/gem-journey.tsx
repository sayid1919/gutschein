"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { slotSelector } from "@/components/gem-anchors";
import { showcase, type ShowcaseGem } from "@/lib/showcase";

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
 * scrolls, each flies down into its own slot. Clicking a stone calls `onSelect`.
 *
 * The stones are drawn on one fixed, click-through canvas above the page, with an
 * invisible button kept over each stone to take the click. While they are showing,
 * `data-gems` on the root element hides the static artwork they replace: "flying" when
 * they start in the hero, "resting" when they stay in their slots (reduced motion).
 * Without WebGL nothing is set and the static artwork stays.
 */
export function GemJourney({ onSelect }: { onSelect: (gem: ShowcaseGem) => void }) {
  const [enabled, setEnabled] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const hits = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setEnabled(supportsWebGL());

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setAnimate(!motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);

    // Stop rendering once the last slot has scrolled well above the screen, or the tab is hidden.
    const update = () => {
      const last = document.querySelector(slotSelector(showcase.length - 1))?.getBoundingClientRect();
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
      className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-1000 ease-luxe ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <div aria-hidden="true" className="absolute inset-0">
        <SceneBoundary onError={onError}>
          <GemJourneyScene animate={animate} active={active} onReady={onReady} hits={hits} />
        </SceneBoundary>
      </div>

      {/* Mouse and touch targets only: keyboard and screen-reader users open the same details from the slot cards. */}
      {ready
        ? showcase.map((gem, index) => (
            <button
              key={gem.id}
              ref={(node) => {
                hits.current[index] = node;
              }}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              title={`${gem.name} — details`}
              onClick={() => onSelect(gem)}
              className="pointer-events-auto absolute left-0 top-0 cursor-pointer rounded-full"
              style={{ transform: "translate3d(-200px, -200px, 0)" }}
            />
          ))
        : null}
    </div>
  );
}
