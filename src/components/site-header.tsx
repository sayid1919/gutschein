"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { useEffect, useId, useState } from "react";
import { navigation, site } from "@/lib/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ease-luxe ${
        solid ? "border-line bg-ink/85 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <a
          href="#top"
          aria-label={`${site.name} — back to top`}
          className="flex items-baseline gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-xl font-medium uppercase tracking-[0.3em] text-ivory sm:text-2xl">
            {site.wordmark}
          </span>
          <span className="text-[0.625rem] font-normal uppercase tracking-[0.34em] text-gold">
            {site.descriptor}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative py-2 text-xs font-normal uppercase tracking-[0.22em] text-mist transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 after:ease-luxe hover:text-ivory hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 flex size-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span
              className={`absolute inset-x-0 top-0 h-px bg-ivory transition-transform duration-500 ease-luxe ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-px bg-ivory transition-transform duration-500 ease-luxe ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <m.nav
            id={menuId}
            aria-label="Mobile"
            className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-ink sm:h-[calc(100dvh-5rem)] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="container-page flex flex-col py-6">
              {navigation.map((item, index) => (
                <m.li
                  key={item.href}
                  className="border-b border-line"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.06 * index, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={item.href}
                    className="block py-5 font-display text-3xl text-ivory"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <p className="container-page eyebrow pb-10">{site.locality}</p>
          </m.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
