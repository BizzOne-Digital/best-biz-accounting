import { ArrowRight, Phone } from "lucide-react";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { telHref } from "@/lib/utils";

/** Dark conversion band used at the bottom of public pages. */
export function CtaBand({
  heading,
  text,
  buttonLabel,
  phone,
  href = "/contact",
}: {
  heading: string;
  text?: string;
  buttonLabel: string;
  phone?: string;
  href?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark">
      <div aria-hidden="true" className="absolute -top-32 -right-24 -z-10 size-96 rounded-full bg-brand-orange/25 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-40 -left-20 -z-10 size-96 rounded-full bg-brand-gold/10 blur-3xl" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <Container className="py-16 sm:py-20">
        <Reveal className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl leading-tight font-bold text-white sm:text-4xl">{heading}</h2>
            {text && <p className="mt-4 text-lg text-white/80">{text}</p>}
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href={href} size="lg">
              {buttonLabel} <ArrowRight aria-hidden="true" />
            </ButtonLink>
            {phone && (
              <ButtonAnchor href={telHref(phone)} variant="outlineLight" size="lg">
                <Phone aria-hidden="true" /> Call {phone}
              </ButtonAnchor>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
