"use client";

import * as m from "framer-motion/m";
import type { ReactNode } from "react";

const tags = {
  div: m.div,
  li: m.li,
  p: m.p,
  span: m.span,
} as const;

interface RevealProps {
  children: ReactNode;
  as?: keyof typeof tags;
  className?: string;
  delay?: number;
  /** Vertical travel in pixels. */
  offset?: number;
}

export function Reveal({ children, as = "div", className, delay = 0, offset = 24 }: RevealProps) {
  const Tag = tags[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
