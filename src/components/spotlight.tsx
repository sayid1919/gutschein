"use client";

import type { PointerEvent, ReactNode } from "react";

/**
 * A surface that is softly lit wherever the pointer is. The light is drawn by the
 * `.spotlight` rule in globals.css from the two custom properties set here.
 */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const track = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <div onPointerMove={track} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}
