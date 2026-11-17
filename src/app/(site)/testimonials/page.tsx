import type { Metadata } from "next";
import { MessagesSquare, Phone } from "lucide-react";
import { CtaBand } from "@/components/layout/cta-band";
import { PageHero } from "@/components/layout/page-hero";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/section";
import { getPage, getSettings, getTestimonials } from "@/lib/content";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description: "Read feedback from businesses supported by Best Biz Accounting's bookkeeping services.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const [page, items, settings] = await Promise.all([getPage("testimonials"), getTestimonials(), getSettings()]);

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} subtitle={page.hero.subtitle} />

      <section className="bg-brand-cream py-16 sm:py-20 lg:py-24">
        <Container>
          {items.length > 0 ? (
            <ul className="columns-1 gap-6 md:columns-2 lg:columns-3 [&>li]:mb-6 [&>li]:break-inside-avoid">
              {items.map((t, i) => (
                <Reveal as="li" key={t._id} delay={(i % 3) * 80}>
                  <TestimonialCard t={t} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal className="mx-auto max-w-2xl rounded-3xl border border-brand-border bg-white p-10 text-center shadow-sm sm:p-14">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-beige text-brand-orange">
                <MessagesSquare className="size-8" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-serif text-2xl font-bold text-brand-dark sm:text-3xl">{page.empty.title}</h2>
              <p className="mt-4 leading-relaxed text-brand-muted">{page.empty.text}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/contact">Get in Touch</ButtonLink>
                <ButtonAnchor href={telHref(settings.phone)} variant="outline">
                  <Phone aria-hidden="true" /> {settings.phone}
                </ButtonAnchor>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {page.cta.visible && (
        <CtaBand heading={page.cta.heading} text={page.cta.text} buttonLabel={page.cta.buttonLabel} phone={settings.phone} />
      )}
    </>
  );
}
