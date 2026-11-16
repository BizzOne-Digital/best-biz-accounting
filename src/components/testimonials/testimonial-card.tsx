import { Quote, Star } from "lucide-react";
import type { TestimonialItem } from "@/types";

export function TestimonialCard({ t }: { t: TestimonialItem }) {
  const date = t.date ? new Date(t.date) : null;
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-brand-border bg-white p-7 shadow-[0_10px_30px_-18px_rgba(50,25,15,0.35)] transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <Quote className="size-9 text-brand-orange/80" aria-hidden="true" />
        {t.rating ? (
          <div className="flex gap-0.5" role="img" aria-label={`Rated ${t.rating} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                aria-hidden="true"
                className={`size-4 ${i < (t.rating ?? 0) ? "fill-brand-gold text-brand-gold" : "text-brand-border"}`}
              />
            ))}
          </div>
        ) : null}
      </div>
      <blockquote className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-brand-text">
        <p>&ldquo;{t.content}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-6 border-t border-brand-border pt-5">
        <p className="font-semibold text-brand-dark">{t.clientName}</p>
        {(t.businessName || date) && (
          <p className="mt-0.5 text-sm text-brand-muted">
            {t.businessName}
            {t.businessName && date ? " · " : ""}
            {date && (
              <time dateTime={date.toISOString()}>
                {date.toLocaleDateString("en-CA", { year: "numeric", month: "long", timeZone: "UTC" })}
              </time>
            )}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
