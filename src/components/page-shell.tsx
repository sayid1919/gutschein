import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** Header, footer and page gutters for every page except the landing page. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="container-page min-h-[70dvh] pb-24 pt-28 sm:pb-32 sm:pt-36">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
