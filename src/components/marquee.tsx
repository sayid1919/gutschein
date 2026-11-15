import { showcase } from "@/lib/showcase";

const names = [...new Set(showcase.map((gem) => gem.cut))];

/** A slow band of cut names between the hero and the stones. Decorative. */
export function Marquee() {
  const row = (
    <ul className="flex shrink-0 animate-marquee items-center gap-10 pr-10 sm:gap-16 sm:pr-16">
      {names.map((name) => (
        <li key={name} className="flex items-center gap-10 whitespace-nowrap sm:gap-16">
          <span className="font-display text-3xl italic text-ivory/25 sm:text-5xl">{name}</span>
          <span className="size-1.5 rotate-45 bg-gold/60" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      aria-hidden="true"
      className="flex overflow-hidden border-b border-line py-7 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:py-10"
    >
      {row}
      {row}
    </div>
  );
}
