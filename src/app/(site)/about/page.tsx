import type { Metadata } from "next";
import { Award, CheckCircle2, ClipboardList, MessagesSquare, ShieldCheck, Target, Briefcase } from "lucide-react";
import { CtaBand } from "@/components/layout/cta-band";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Container, SectionHeading } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";
import { getPage, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Angela Rotvik of Best Biz Accounting: over 20 years of bookkeeping experience supporting couriers, manufacturers, rental businesses, fuel supply companies and other small businesses.",
  alternates: { canonical: "/about" },
};

const APPROACH_ICONS = [Target, ShieldCheck, ClipboardList, MessagesSquare, Briefcase];

export default async function AboutPage() {
  const [page, settings] = await Promise.all([getPage("about"), getSettings()]);
  const paragraphs = page.intro.body.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={page.hero.eyebrow}
        heading={page.hero.heading}
        subtitle={page.hero.subtitle}
        image={page.hero.image}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-lg">
            <div aria-hidden="true" className="absolute -right-4 -bottom-4 h-2/3 w-2/3 rounded-3xl bg-brand-orange/15" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
              <SmartImage
                src={page.intro.image}
                alt="Organized bookkeeping workspace"
                fill
                sizes="(min-width: 1024px) 512px, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading eyebrow={page.intro.eyebrow} title={page.intro.heading} />
            <div className="mt-6 space-y-4 leading-relaxed text-brand-muted sm:text-lg">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {page.intro.industries.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold tracking-wider text-brand-dark uppercase">Industry experience includes</h3>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {page.intro.industries.map((ind) => (
                    <li
                      key={ind}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-beige px-4 py-2 text-sm font-medium text-brand-dark"
                    >
                      <CheckCircle2 className="size-4 text-brand-orange" aria-hidden="true" /> {ind}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </Container>
      </section>

      {page.highlight.visible && (
        <section className="relative isolate overflow-hidden bg-brand-dark py-14 sm:py-16">
          <div aria-hidden="true" className="absolute -top-24 left-1/3 -z-10 size-80 rounded-full bg-brand-orange/25 blur-3xl" />
          <Container>
            <Reveal className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <span className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-brand-gold text-brand-gold">
                <Award className="size-10" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">{page.highlight.heading}</h2>
                <p className="mt-2 text-lg text-white/80">{page.highlight.text}</p>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {page.approach.visible && (
        <section className="bg-brand-cream py-16 sm:py-20 lg:py-24">
          <Container>
            <Reveal>
              <SectionHeading eyebrow={page.approach.eyebrow} title={page.approach.heading} center />
            </Reveal>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {page.approach.items.map((item, i) => {
                const Icon = APPROACH_ICONS[i % APPROACH_ICONS.length];
                return (
                  <Reveal as="li" key={i} delay={i * 70}>
                    <div className="h-full rounded-2xl border border-brand-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(50,25,15,0.45)]">
                      <span className="flex size-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                        <Icon className="size-6" strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 text-lg font-semibold text-brand-dark">{item.title}</h3>
                      <p className="mt-2 leading-relaxed text-brand-muted">{item.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </Container>
        </section>
      )}

      {page.cta.visible && (
        <CtaBand heading={page.cta.heading} text={page.cta.text} buttonLabel={page.cta.buttonLabel} phone={settings.phone} />
      )}
    </>
  );
}
