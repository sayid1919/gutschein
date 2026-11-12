"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";

const GemScene = dynamic(() => import("@/components/gem-scene"), { ssr: false });

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface GemStageProps {
  /** Static artwork shown until the 3D stone is ready, and kept if WebGL is unavailable. */
  fallback: ReactNode;
  className?: string;
}

/** Interactive 3D demantoid. Visitors can drag it to turn the stone. */
export function GemStage({ fallback, className = "" }: GemStageProps) {
  const container = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [spin, setSpin] = useState(true);

  useEffect(() => {
    setEnabled(supportsWebGL());

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setSpin(!motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);

    const node = container.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setActive(entry.isIntersecting);
    });
    if (node) observer.observe(node);

    return () => {
      motion.removeEventListener("change", onMotion);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // Give the scene a moment to compile shaders before the artwork cross-fades out.
    const timer = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  return (
    <div ref={container} className={`relative aspect-square ${className}`}>
      <div
        aria-hidden="true"
        className={`absolute inset-[9%] transition-opacity duration-1000 ease-luxe ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        {fallback}
      </div>

      {enabled ? (
        <SceneBoundary>
          <div
            role="img"
            aria-label="Interactive 3D model of a round brilliant-cut demantoid garnet. Drag to turn the stone."
            className={`absolute inset-0 transition-opacity duration-1000 ease-luxe ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          >
            <GemScene spin={spin} active={active} />
          </div>
        </SceneBoundary>
      ) : null}
    </div>
  );
}
