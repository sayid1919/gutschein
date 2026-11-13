import Link from "next/link";
import { categories, type CategoryId } from "@/lib/shop";

interface ShopHeaderProps {
  title: string;
  intro: string;
  /** The category being viewed, or undefined on the page that lists everything. */
  active?: CategoryId;
}

const tab =
  "inline-flex min-h-11 items-center whitespace-nowrap border px-5 text-xs font-normal uppercase tracking-[0.2em] transition-colors duration-300";
const tabIdle = "border-line text-mist hover:border-gold/50 hover:text-ivory";
const tabActive = "border-gold bg-gold/10 text-ivory";

export function ShopHeader({ title, intro, active }: ShopHeaderProps) {
  return (
    <header>
      <p className="eyebrow">Shop</p>
      <h1 className="mt-5 text-balance font-display text-5xl font-medium leading-[1.05] text-ivory sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist">{intro}</p>

      <nav aria-label="Shop categories" className="-mx-5 mt-10 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ul className="flex gap-3 pb-2">
          <li>
            <Link
              href="/shop"
              aria-current={active ? undefined : "page"}
              className={`${tab} ${active ? tabIdle : tabActive}`}
            >
              All
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/shop/${category.id}`}
                aria-current={active === category.id ? "page" : undefined}
                className={`${tab} ${active === category.id ? tabActive : tabIdle}`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
