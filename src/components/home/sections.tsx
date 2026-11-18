import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  Fuel,
  HeartHandshake,
  KeyRound,
  Laptop,
  MessagesSquare,
  MonitorSmartphone,
  ShieldCheck,
  Store,
  Truck,
  UsersRound,
} from "lucide-react";
import type { PagesData } from "@/content/defaults";
import type { ServiceItem, TestimonialItem } from "@/types";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ServiceIcon } from "@/components/ui/icons";
import { SmartImage } from "@/components/ui/smart-image";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { FaqAccordion } from "./faq-accordion";

type Home = PagesData["home"];

/* ---------------- Hero ---------------- */
export function Hero({ hero }: { hero: Home["hero"] }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-chocolate">
      <SmartImage
        src={hero.image}
        alt="Bookkeeping desk with a calculator, financial reports, pen, laptop and a Best Biz Accounting mug"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="animate-ken-burns -z-20 object-cover object-[70%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-chocolate/85 via-brand-chocolate/75 to-brand-chocolate/90 md:bg-gradient-to-r md:from-brand-chocolate md:via-brand-chocolate/80 md:to-brand-chocolate/10"
      />
      <Container className="flex min-h-[540px] items-center py-16 sm:min-h-[560px] lg:min-h-[600px] lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          <div className="animate-hero">
            <Eyebrow light>{hero.eyebrow}</Eyebrow>
          </div>
          <h1 style={{ animationDelay: "80ms" }} className="animate-hero mt-5 font-serif text-[2.6rem] leading-[1.08] font-bold text-white sm:text-6xl lg:text-7xl">
            {hero.heading}
          </h1>
          <svg aria-hidden="true" viewBox="0 0 300 14" className="mt-3 ml-12 h-3.5 w-56 text-brand-orange sm:ml-28 sm:w-72">
            <path className="animate-draw" d="M2 11 C 80 1, 200 1, 298 8" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <p style={{ animationDelay: "180ms" }} className="animate-hero mt-6 max-w-lg text-lg leading-relaxed text-white/90 sm:text-xl">{hero.description}</p>
          <div style={{ animationDelay: "280ms" }} className="animate-hero mt-9 flex flex-col gap-3 sm:flex-row sm:gap-5">
            <ButtonLink href="/services" size="lg" className="sm:min-w-52">
              {hero.primaryCta} <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="outlineLight" size="lg" className="sm:min-w-44">
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Trust strip ---------------- */
const TRUST_ICONS = [CalendarDays, UsersRound, Laptop, ShieldCheck];

export function TrustStrip({ trust }: { trust: Home["trust"] }) {
  if (!trust.visible) return null;
  return (
    <section aria-label="Why clients trust us" className="border-b border-brand-border bg-brand-cream">
      <Container>
        <ul className="grid grid-cols-2 gap-y-6 py-7 lg:grid-cols-4 lg:py-8">
          {trust.items.map((item, i) => {
            const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
            return (
              <li
                key={i}
                className="flex items-center gap-3 px-2 sm:gap-4 sm:px-4 lg:justify-center lg:border-l lg:border-brand-border lg:first:border-l-0"
              >
                <Icon className="size-9 shrink-0 text-brand-orange sm:size-11" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-sm leading-snug text-brand-dark sm:text-base">
                  <strong className="block font-semibold">{item.title}</strong>
                  <span className="font-medium">{item.text}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- Services preview ---------------- */
export function ServicesPreview({ data, services }: { data: Home["servicesPreview"]; services: ServiceItem[] }) {
  if (!data.visible) return null;
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <Reveal className="lg:pt-6">
          <SectionHeading eyebrow={data.eyebrow} title={data.heading} intro={data.description} />
          <Link
            href="/services"
            className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand-orange hover:text-brand-orange-hover"
          >
            <span className="link-underline">{data.ctaLabel}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-5">
          {services.map((svc, i) => (
            <Reveal key={svc._id} delay={i * 70} variant="zoom">
              <Link
                href={`/services#${svc.slug}`}
                className="group flex h-full min-h-40 flex-col items-center justify-center rounded-2xl border border-brand-border bg-brand-cream p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:bg-white hover:shadow-[0_16px_34px_-18px_rgba(230,91,0,0.45)]"
              >
                <span className="flex size-14 items-center justify-center rounded-xl bg-white text-brand-orange shadow-sm transition-colors group-hover:bg-brand-orange group-hover:text-white">
                  <ServiceIcon name={svc.icon} className="size-7" />
                </span>
                <h3 className="mt-4 text-[0.95rem] leading-snug font-semibold text-brand-dark">{svc.title}</h3>
              </Link>
            </Reveal>
          ))}
          <Reveal className="col-span-2 sm:col-span-3" delay={120}>
            <div className="flex flex-col gap-5 rounded-2xl border border-brand-orange/40 bg-gradient-to-br from-[#fff3e8] to-brand-cream p-6 sm:flex-row sm:items-center sm:p-7">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-brand-orange text-brand-orange">
                <MessagesSquare className="size-7" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-bold text-brand-orange">{data.offerTitle}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-muted sm:text-[0.95rem]">{data.offerText}</p>
              </div>
              <ButtonLink href="/contact" className="shrink-0">
                {data.offerCta}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- About preview ---------------- */
export function AboutPreview({ about }: { about: Home["about"] }) {
  if (!about.visible) return null;
  return (
    <section className="overflow-hidden bg-gradient-to-b from-white to-brand-cream py-16 sm:py-20 lg:py-24">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="left" className="relative mx-auto w-full max-w-xl">
          <div aria-hidden="true" className="absolute -top-4 -left-4 h-2/3 w-2/3 rounded-3xl bg-brand-beige" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <SmartImage
              src={about.image}
              alt="Bright, organized home-office workspace with laptop and plants"
              fill
              sizes="(min-width: 1024px) 560px, 92vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          {about.badge && (
            <div className="animate-float absolute -right-2 -bottom-6 rounded-2xl bg-brand-dark px-6 py-4 text-center text-white shadow-xl sm:-right-6">
              <p className="font-serif text-3xl font-bold text-brand-gold">{about.badge}</p>
              <p className="text-xs font-medium tracking-wider uppercase">Bookkeeping Experience</p>
            </div>
          )}
        </Reveal>
        <Reveal variant="right" delay={100}>
          <SectionHeading eyebrow={about.eyebrow} title={about.heading} />
          <p className="mt-5 leading-relaxed text-brand-muted sm:text-lg">{about.body}</p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {about.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-[0.95rem] text-brand-text">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-orange" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
          <ButtonLink href="/about" variant="dark" className="mt-9">
            {about.ctaLabel} <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------- Why choose us ---------------- */
const WHY_ICONS = [Award, ClipboardCheck, MonitorSmartphone, HeartHandshake];

export function WhyChooseUs({ data }: { data: Home["whyChoose"] }) {
  if (!data.visible) return null;
  return (
    <section className="bg-brand-cream py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={data.eyebrow} title={data.heading} center />
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item, i) => {
            const Icon = WHY_ICONS[i % WHY_ICONS.length];
            return (
              <Reveal as="li" key={i} delay={i * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-brand-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(50,25,15,0.45)]">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-orange transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <span className="flex size-14 items-center justify-center rounded-xl bg-brand-beige text-brand-orange">
                    <Icon className="size-7" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-brand-dark">{item.title}</h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-brand-muted">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- Industries ---------------- */
const INDUSTRY_ICONS = [Truck, Factory, KeyRound, Fuel, Store];

export function Industries({ data }: { data: Home["industries"] }) {
  if (!data.visible) return null;
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={data.eyebrow} title={data.heading} intro={data.intro} center />
        </Reveal>
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {data.items.map((item, i) => {
            const Icon = INDUSTRY_ICONS[i % INDUSTRY_ICONS.length];
            return (
              <Reveal as="li" key={i} delay={i * 60}>
                <div className="flex h-full items-start gap-4 rounded-2xl border border-brand-border bg-gradient-to-b from-white to-brand-cream p-6 lg:flex-col lg:items-center lg:text-center">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-dark text-brand-gold">
                    <Icon className="size-6" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-brand-dark">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- Testimonials preview ---------------- */
export function TestimonialsPreview({ data, items }: { data: Home["testimonials"]; items: TestimonialItem[] }) {
  // Hidden until real, approved testimonials are published.
  if (!data.visible || items.length === 0) return null;
  const shown = items.slice(0, 3);
  return (
    <section className="bg-brand-cream py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={data.eyebrow} title={data.heading} />
          <ButtonLink href="/testimonials" variant="outline">
            {data.ctaLabel} <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </Reveal>
        <ul
          className={
            shown.length === 1 ? "mx-auto mt-12 max-w-2xl" : "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {shown.map((t, i) => (
            <Reveal as="li" key={t._id} delay={i * 80}>
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- How it works ---------------- */
export function Process({ data }: { data: Home["process"] }) {
  if (!data.visible || data.items.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-brand-dark py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="absolute -top-40 -left-32 size-[28rem] rounded-full bg-brand-orange/15 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-32 -bottom-40 size-[28rem] rounded-full bg-brand-gold/10 blur-3xl" />
      <Container className="relative">
        <Reveal>
          <SectionHeading eyebrow={data.eyebrow} title={data.heading} intro={data.intro} center light />
        </Reveal>
        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {/* connecting line on desktop */}
          <span
            aria-hidden="true"
            className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent lg:block"
          />
          {data.items.map((step, i) => (
            <Reveal as="li" key={i} delay={i * 120} className="relative">
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-orange/50 hover:bg-white/[0.07]">
                <span className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-brand-orange font-serif text-2xl font-bold text-white shadow-lg shadow-brand-orange/30 ring-8 ring-brand-dark transition-transform duration-500 group-hover:scale-110">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-white/70">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq({ data }: { data: Home["faq"] }) {
  if (!data.visible || data.items.length === 0) return null;
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal variant="left" className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow={data.eyebrow} title={data.heading} intro={data.intro} />
          <ButtonLink href="/contact" variant="outline" className="mt-8">
            Ask a Question <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </Reveal>
        <Reveal variant="right" delay={100}>
          <FaqAccordion items={data.items} />
        </Reveal>
      </Container>
    </section>
  );
}
