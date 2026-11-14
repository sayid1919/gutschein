import { Reveal } from "@/components/reveal";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  return (
    <Reveal className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2
        id={id}
        className="mt-5 text-balance font-display text-4xl font-medium leading-[1.08] text-ivory sm:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
    </Reveal>
  );
}
