import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, MessageSquareQuote } from "lucide-react";
import { CtaBand } from "@/components/layout/cta-band";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Container, SectionHeading } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";
import { getPage, getServices, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Bookkeeping Services",
  description:
    "Remote bookkeeping services for small businesses: accounts payable, accounts receivable, bank reconciliations, inventory tracking, payroll (T4, ROE, remittances) and GST filing support.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [page, services, settings] = await Promise.all([getPage("services"), getServices(), getSettings()]);

  return (
    <>
      <PageHero
        eyebrow={page.hero.eyebrow}
        heading={page.hero.heading}
        subtitle={page.hero.subtitle}
        image={page.hero.image}
      />

      {/* Quick index */}
      <section className="border-b border-brand-border bg-brand-cream">
        <Container className="py-6">
          <nav aria-label="Services on this page">
            <ul className="flex flex-wrap justify-center gap-2.5">
              {services.map((svc) => (
                <li key={svc._id}>
                  <a
                    href={`#${svc.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-dark transition-colors hover:border-brand-orange hover:text-brand-orange"
                  >
                    <ServiceIcon name={svc.icon} className="size-4 text-brand-orange" />
                    {svc.shortTitle || svc.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading title={page.intro.heading} intro={page.intro.text} center />
          </Reveal>

          <div className="mt-14 space-y-8 lg:space-y-10">
            {services.map((svc, i) => (
              <Reveal key={svc._id}>
                <article
                  id={svc.slug}
                  className="scroll-mt-32 overflow-hidden rounded-3xl border border-brand-border bg-gradient-to-br from-white to-brand-cream"
                >
                  <div className={`grid lg:grid-cols-2 ${svc.imageUrl ? "" : "lg:grid-cols-[1fr_1fr]"}`}>
                    <div className={`p-7 sm:p-10 ${i % 2 === 1 && svc.imageUrl ? "lg:order-2" : ""}`}>
                      <div className="flex items-center gap-4">
                        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-orange text-white shadow-md shadow-brand-orange/25">
                          <ServiceIcon name={svc.icon} className="size-7" />
                        </span>
                        <p className="text-xs font-semibold tracking-[0.18em] text-brand-orange uppercase">
                          Service {String(i + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <h2 className="mt-5 font-serif text-2xl font-bold text-brand-dark sm:text-3xl">{svc.title}</h2>
                      {svc.description && <p className="mt-4 leading-relaxed text-brand-muted">{svc.description}</p>}
                    </div>
                    {svc.imageUrl ? (
                      <div className="relative min-h-64">
                        <SmartImage
                          src={svc.imageUrl}
                          alt={`${svc.title} illustration`}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div
                      className={`border-t border-brand-border bg-white/70 p-7 sm:p-10 ${
                        svc.imageUrl ? "lg:col-span-2" : "lg:border-t-0 lg:border-l"
                      }`}
                    >
                      <h3 className="text-sm font-semibold tracking-wider text-brand-dark uppercase">What&apos;s included</h3>
                      <ul className="mt-5 grid gap-3.5">
                        {svc.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3 text-brand-text">
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-orange" aria-hidden="true" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-brand-muted">
            Services are bookkeeping and recordkeeping support. For tax planning or legal advice, please consult a
            qualified tax or legal professional.
          </p>
        </Container>
      </section>

      {page.pricing.visible && (
        <section className="bg-brand-cream py-16 sm:py-20">
          <Container>
            <Reveal className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_24px_60px_-35px_rgba(50,25,15,0.5)] sm:p-12 lg:flex lg:items-center lg:gap-12">
              <div aria-hidden="true" className="absolute -top-20 -right-20 size-60 rounded-full bg-brand-orange/10" />
              <span className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-dark text-brand-gold">
                <MessageSquareQuote className="size-8" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div className="relative mt-6 flex-1 lg:mt-0">
                <h2 className="font-serif text-2xl font-bold text-brand-dark sm:text-3xl">{page.pricing.heading}</h2>
                <p className="mt-3 leading-relaxed text-brand-muted sm:text-lg">{page.pricing.description}</p>
              </div>
              <ButtonLink href="/contact" size="lg" className="relative mt-7 w-full sm:w-auto lg:mt-0">
                {page.pricing.ctaLabel} <ArrowRight aria-hidden="true" />
              </ButtonLink>
            </Reveal>
          </Container>
        </section>
      )}

      {page.cta.visible && (
        <CtaBand heading={page.cta.heading} text={page.cta.text} buttonLabel={page.cta.buttonLabel} phone={settings.phone} />
      )}
    </>
  );
}
