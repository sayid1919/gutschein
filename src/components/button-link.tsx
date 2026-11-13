import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  arrow?: boolean;
  className?: string;
}

const base =
  "group inline-flex min-h-12 items-center justify-center gap-3 px-7 py-3 text-xs font-normal uppercase tracking-[0.24em] transition-colors duration-500 ease-luxe";

const variants = {
  solid: "bg-ivory text-ink hover:bg-gold-soft",
  outline: "border border-gold/50 text-ivory hover:border-gold-soft hover:bg-gold/10",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "solid",
  arrow = false,
  className = "",
}: ButtonLinkProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {arrow ? (
        <span
          aria-hidden="true"
          className="transition-transform duration-500 ease-luxe group-hover:translate-x-1"
        >
          →
        </span>
      ) : null}
    </Link>
  );
}
