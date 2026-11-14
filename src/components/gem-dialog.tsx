"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getCategory } from "@/lib/shop";
import type { ShowcaseGem } from "@/lib/showcase";

interface GemDialogProps {
  /** The stone to describe, or null to keep the panel closed. */
  gem: ShowcaseGem | null;
  onClose: () => void;
}

/** Side panel (bottom sheet on phones) with the details of one stone. */
export function GemDialog({ gem, onClose }: GemDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (gem && !node.open) node.showModal();
    if (!gem && node.open) node.close();
  }, [gem]);

  const category = gem ? getCategory(gem.category) : undefined;
  const facts = gem
    ? [{ label: "Cut", value: gem.cut }, { label: "Colour", value: gem.colour }, ...(gem.facts ?? [])]
    : [];

  return (
    <dialog
      ref={dialog}
      aria-labelledby="gem-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) onClose();
      }}
      className="gem-dialog fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto border-t border-line bg-ink-soft p-0 text-ivory backdrop:bg-ink/70 backdrop:backdrop-blur-sm md:inset-y-0 md:left-auto md:right-0 md:h-dvh md:max-h-none md:w-[26rem] md:border-l md:border-t-0"
    >
      {gem ? (
        <div className="flex min-h-full flex-col px-7 pb-9 pt-7 sm:px-9">
          <div className="flex items-start justify-between gap-6">
            <p className="eyebrow pt-2">{gem.cut}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="-mr-2 -mt-1 flex size-11 items-center justify-center text-2xl leading-none text-mist transition-colors hover:text-ivory"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div
            aria-hidden="true"
            className="mt-6 h-1 w-16 rounded-full"
            style={{ backgroundColor: gem.tint, boxShadow: `0 0 24px 2px ${gem.tint}` }}
          />
          <h2
            id="gem-dialog-title"
            className="mt-6 text-balance font-display text-4xl font-medium leading-[1.08] sm:text-5xl"
          >
            {gem.name}
          </h2>
          {gem.intro ? <p className="mt-5 leading-relaxed text-ivory/85">{gem.intro}</p> : null}

          <dl className="mt-8 border-t border-line">
            {facts.map((fact) => (
              <div key={fact.label} className="flex justify-between gap-6 border-b border-line py-4">
                <dt className="text-xs font-normal uppercase tracking-[0.2em] text-mist">{fact.label}</dt>
                <dd className="text-right">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {category ? (
            <Link
              href={`/shop/${category.id}`}
              className="btn-shine mt-10 inline-flex min-h-12 items-center justify-center bg-ivory px-7 text-center text-xs font-normal uppercase tracking-[0.24em] text-ink transition-colors duration-500 ease-luxe hover:bg-gold-soft md:mt-auto"
            >
              View in the shop
            </Link>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
