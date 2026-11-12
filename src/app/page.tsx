import { Collections } from "@/components/collections";
import { DemantoidFeature } from "@/components/demantoid-feature";
import { Hero } from "@/components/hero";
import { Philosophy } from "@/components/philosophy";
import { Promise as PromiseSection } from "@/components/promise";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { collections, site, siteUrl } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: site.name,
      url: siteUrl,
      slogan: site.tagline,
      description: site.description,
      areaServed: "Worldwide",
      address: { "@type": "PostalAddress", addressCountry: "CH" },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "ItemList",
      name: "Our Collections",
      itemListElement: collections.map((collection, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: collection.name,
        url: `${siteUrl}/#${collection.id}`,
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Collections />
        <Philosophy />
        <PromiseSection />
        <DemantoidFeature />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
