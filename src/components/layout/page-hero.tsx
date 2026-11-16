import { Container, Eyebrow } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";

/** Inner-page banner: dark brown with optional photo on the right. */
export function PageHero({
  eyebrow,
  heading,
  subtitle,
  image,
  imageAlt = "",
}: {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-chocolate">
      {image && (
        <SmartImage
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-60"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-chocolate via-brand-chocolate/90 to-brand-dark/40"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 -z-10 size-72 rounded-full bg-brand-orange/20 blur-3xl"
      />
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}
          <h1 className="mt-4 font-serif text-4xl leading-tight font-bold text-white sm:text-5xl">{heading}</h1>
          <svg aria-hidden="true" viewBox="0 0 300 14" className="mt-3 h-3 w-48 text-brand-orange sm:w-64">
            <path d="M2 11 C 80 1, 200 1, 298 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {subtitle && <p className="mt-5 text-lg leading-relaxed text-white/85">{subtitle}</p>}
        </div>
      </Container>
    </section>
  );
}
