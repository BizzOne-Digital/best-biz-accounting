"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Accessible accordion with smooth height animation. First item opens by default. */
export function FaqAccordion({ items }: { items: Array<{ question: string; answer: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="divide-y divide-brand-border overflow-hidden rounded-2xl border border-brand-border bg-white shadow-[0_18px_40px_-30px_rgba(50,25,15,0.45)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <li key={i}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-semibold transition-colors duration-300 sm:px-7",
                  isOpen ? "text-brand-orange" : "text-brand-dark hover:text-brand-orange",
                )}
              >
                <span className="text-[1.02rem] leading-snug">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "rotate-45 border-brand-orange bg-brand-orange text-white" : "border-brand-border text-brand-orange",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="accordion-panel"
              data-open={isOpen}
              inert={!isOpen}
            >
              <div>
                <p
                  className={cn(
                    "px-5 pb-6 leading-relaxed text-brand-muted transition-opacity duration-500 sm:px-7",
                    isOpen ? "opacity-100" : "opacity-0",
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
