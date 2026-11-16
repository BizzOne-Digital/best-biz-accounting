import type { Metadata } from "next";
import { Clock, Laptop, Mail, Phone, UserRound } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/section";
import { getPage, getSettings } from "@/lib/content";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Angela Rotvik at Best Biz Accounting for remote bookkeeping support. Call (403) 617-2677 or send a message to request a personalized quote.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [page, s] = await Promise.all([getPage("contact"), getSettings()]);

  const details = [
    { Icon: UserRound, label: "Owner", value: s.ownerName },
    { Icon: Phone, label: "Phone", value: s.phone, href: telHref(s.phone) },
    { Icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { Icon: Laptop, label: "Service", value: s.serviceArea },
  ];

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} subtitle={page.hero.subtitle} />

      <section className="bg-brand-cream py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <Reveal>
            <aside className="relative h-full overflow-hidden rounded-3xl bg-brand-dark p-8 text-white sm:p-10">
              <div aria-hidden="true" className="absolute -right-20 -bottom-20 size-64 rounded-full bg-brand-orange/25 blur-2xl" />
              <h2 className="relative font-serif text-2xl font-bold sm:text-3xl">Get in Touch With {s.ownerName.split(" ")[0]}</h2>
              <p className="relative mt-3 text-white/75">
                Prefer to talk it through? Call or email directly and we&apos;ll discuss what your business needs.
              </p>
              <ul className="relative mt-8 space-y-5">
                {details.map(({ Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-gold">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-wider text-white/60 uppercase">{label}</p>
                      {href ? (
                        <a href={href} className="font-medium break-words transition-colors hover:text-brand-gold">
                          {value}
                        </a>
                      ) : (
                        <p className="font-medium">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="relative mt-10 flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/80">
                <Clock className="mt-0.5 size-5 shrink-0 text-brand-gold" aria-hidden="true" />
                Pricing is personalized. Share a few details about your records and workload to request a quote.
              </div>
            </aside>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-3xl border border-brand-border bg-white p-7 shadow-[0_24px_60px_-40px_rgba(50,25,15,0.5)] sm:p-10">
              <h2 className="font-serif text-2xl font-bold text-brand-dark sm:text-3xl">{page.form.heading}</h2>
              <p className="mt-2 mb-8 text-brand-muted">{page.form.intro}</p>
              <ContactForm successMessage={page.form.successMessage} />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
