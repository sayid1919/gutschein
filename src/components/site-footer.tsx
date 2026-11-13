import Link from "next/link";
import { navigation, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink-soft">
      <div className="container-page flex flex-col items-center py-16 text-center sm:py-20">
        <p className="font-display text-2xl font-medium uppercase tracking-[0.3em] text-ivory sm:text-3xl">
          {site.name}
        </p>
        <p className="eyebrow mt-5">{site.locality}</p>
        <p className="mt-8 font-display text-2xl italic text-gold-soft">{site.headline}</p>

        <nav aria-label="Footer" className="mt-12">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-2 text-xs font-normal uppercase tracking-[0.22em] text-mist transition-colors duration-300 hover:text-ivory"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div aria-hidden="true" className="hairline mt-12 w-full max-w-md" />
        <p className="mt-8 text-xs tracking-[0.12em] text-mist">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
