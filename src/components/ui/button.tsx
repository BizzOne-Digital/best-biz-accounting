import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0 [&>svg:last-child]:transition-transform [&>svg:last-child]:duration-300 hover:[&>svg.lucide-arrow-right]:translate-x-1",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-orange text-white shadow-sm shadow-brand-orange/20 hover:bg-brand-orange-hover hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-orange/25",
        outlineLight: "border border-white/80 bg-black/10 text-white backdrop-blur-sm hover:bg-white hover:text-brand-dark",
        outline: "border border-brand-dark/20 bg-white text-brand-dark hover:border-brand-orange hover:text-brand-orange",
        dark: "bg-brand-dark text-white hover:bg-brand-warm",
        ghost: "text-brand-dark hover:bg-brand-beige",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-13 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ComponentProps<"button"> & Variants) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function ButtonLink({ className, variant, size, ...props }: ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function ButtonAnchor({ className, variant, size, ...props }: ComponentProps<"a"> & Variants) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
