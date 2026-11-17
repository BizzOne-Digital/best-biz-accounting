import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getServices, getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/utils";

async function StructuredData() {
  const [s, services] = await Promise.all([getSettings(), getServices()]);
  const data = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": `${SITE_URL}/#business`,
    name: s.siteName,
    url: SITE_URL,
    logo: `${SITE_URL}${s.logoUrl.startsWith("/") ? s.logoUrl : ""}`,
    image: `${SITE_URL}/images/hero-desk.webp`,
    description: s.seoDescription,
    telephone: s.phone,
    email: s.email,
    slogan: "You can count on us!!!",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bookkeeping Services",
      itemListElement: services.map((svc) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: svc.title, description: svc.summary },
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-brand-orange px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <StructuredData />
    </>
  );
}
