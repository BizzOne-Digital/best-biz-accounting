import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/cta-band";
import {
  AboutPreview,
  Faq,
  Process,
  Hero,
  Industries,
  ServicesPreview,
  TestimonialsPreview,
  TrustStrip,
  WhyChooseUs,
} from "@/components/home/sections";
import { getPage, getServices, getSettings, getTestimonials } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: { absolute: s.seoTitle }, description: s.seoDescription, alternates: { canonical: "/" } };
}

export default async function HomePage() {
  const [home, services, testimonials, settings] = await Promise.all([
    getPage("home"),
    getServices(),
    getTestimonials(),
    getSettings(),
  ]);

  const faqLd =
    home.faq.visible && home.faq.items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: home.faq.items.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
        />
      )}
      <Hero hero={home.hero} />
      <TrustStrip trust={home.trust} />
      <ServicesPreview data={home.servicesPreview} services={services} />
      <AboutPreview about={home.about} />
      <WhyChooseUs data={home.whyChoose} />
      <Process data={home.process} />
      <Industries data={home.industries} />
      <TestimonialsPreview data={home.testimonials} items={testimonials} />
      <Faq data={home.faq} />
      {home.cta.visible && (
        <CtaBand
          heading={home.cta.heading}
          text={home.cta.description}
          buttonLabel={home.cta.primaryLabel}
          phone={settings.phone}
        />
      )}
    </>
  );
}
