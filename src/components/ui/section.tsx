import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children, className, light }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase sm:text-sm",
        light ? "text-brand-gold" : "text-brand-orange",
        className,
      )}
    >
      <span>{children}</span>
      <span aria-hidden="true" className="h-px w-12 bg-current opacity-80 sm:w-16" />
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center,
  light,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
  light?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center [&>p:first-child]:justify-center")}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          "mt-3 font-serif text-3xl leading-tight font-bold sm:text-4xl lg:text-[2.6rem]",
          light ? "text-white" : "text-brand-dark",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", light ? "text-white/80" : "text-brand-muted")}>
          {intro}
        </p>
      )}
    </div>
  );
}
