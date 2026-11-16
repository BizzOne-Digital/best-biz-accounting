"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Mail, Menu, Phone, Send, X } from "lucide-react";
import { NAV_LINKS } from "./nav-config";
import { cn, telHref } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Sticky header wrapper that adds a shadow once the page scrolls. */
export function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow duration-300",
        scrolled ? "border-brand-border shadow-[0_6px_24px_-12px_rgba(50,25,15,0.35)]" : "border-transparent",
      )}
    >
      {children}
    </header>
  );
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1 xl:gap-3">
        {NAV_LINKS.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative block px-3 py-2 text-[0.95rem] font-semibold transition-colors",
                  "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-brand-orange after:transition-transform after:duration-300",
                  active
                    ? "text-brand-orange after:scale-x-100"
                    : "text-brand-text after:scale-x-0 hover:text-brand-orange hover:after:scale-x-100",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileNav({ phone, email, logo }: { phone: string; email: string; logo: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // true on the client after hydration, false during SSR (avoids hydration mismatch)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on route change
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === "Tab" && panel) {
        const items = panel.querySelectorAll<HTMLElement>("a,button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        className="inline-flex size-11 items-center justify-center rounded-lg text-brand-dark hover:bg-brand-beige"
      >
        <Menu className="size-6" />
      </button>

      {/* Portal to <body>: the sticky header's backdrop-filter would otherwise trap these fixed elements */}
      {mounted &&
        createPortal(
          <div className="lg:hidden">
      <div
        className={cn(
          "fixed inset-0 z-50 bg-brand-chocolate/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-dvh w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-[transform,visibility] duration-300 ease-out",
          open ? "visible translate-x-0" : "invisible translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          {logo}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center rounded-lg text-brand-dark hover:bg-brand-beige"
          >
            <X className="size-6" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 text-base font-semibold transition-colors",
                      active ? "bg-brand-beige text-brand-orange" : "text-brand-text hover:bg-brand-cream",
                    )}
                  >
                    {active && <span className="mr-3 h-5 w-1 rounded-full bg-brand-orange" aria-hidden="true" />}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="space-y-3 border-t border-brand-border bg-brand-cream p-5">
          <a href={telHref(phone)} className="flex items-center gap-3 text-sm font-medium text-brand-text">
            <Phone className="size-4 text-brand-orange" aria-hidden="true" /> {phone}
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm font-medium break-all text-brand-text">
            <Mail className="size-4 shrink-0 text-brand-orange" aria-hidden="true" /> {email}
          </a>
          <Link
            href="/contact"
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-orange font-semibold text-white hover:bg-brand-orange-hover"
          >
            <Send className="size-4" aria-hidden="true" /> Get in Touch
          </Link>
        </div>
      </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
