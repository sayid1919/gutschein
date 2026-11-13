"use client";

import { useEffect, useRef, useState } from "react";

interface LoopVideoProps {
  /** Video sources in order of preference. */
  sources: readonly { src: string; type: string }[];
  poster: string;
  /** Describes what the footage shows, for assistive technology. */
  label: string;
  className?: string;
}

/**
 * Silent looping footage. Plays only while on screen, and for visitors who prefer
 * reduced motion it stays on the poster frame with native controls instead of autoplaying.
 */
export function LoopVideo({ sources, poster, label, className }: LoopVideoProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    if (reducedMotion) {
      node.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          // Autoplay can be refused (for example in low-power mode); the poster stays visible.
          node.play().catch(() => undefined);
        } else {
          node.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <video
      ref={video}
      className={className}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reducedMotion}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
