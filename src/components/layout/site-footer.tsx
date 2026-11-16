import Link from "next/link";
import { Mail, MapPin, Phone, UserRound } from "lucide-react";
import { getCopyrightYear, getServices, getSettings } from "@/lib/content";
import { telHref } from "@/lib/utils";
import { Container } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";
import { NAV_LINKS } from "./nav-config";

const FOOTER_NAV = [NAV_LINKS[0], NAV_LINKS[2], NAV_LINKS[1], NAV_LINKS[3], NAV_LINKS[4]];

export async function SiteFooter() {
  const [s, services, year] = await Promise.all([getSettings(), getServices(), getCopyrightYear()]);
  const social = Object.entries(s.social).filter(([, url]) => url) as Array<[string, string]>;

  return (
    <footer className="relative overflow-hidden bg-brand-chocolate text-white/80">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-orange via-brand-gold to-brand-orange" />
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr] lg:gap-12 lg:py-16">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <SmartImage src={s.logoUrl} alt={`${s.siteName} logo`} width={60} height={60} className="rounded-full" />
            <span className="font-serif text-xl font-bold text-white">{s.siteName}</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{s.footerDescription}</p>
          {social.length > 0 && (
            <ul className="mt-5 flex gap-4 text-sm">
              {social.map(([name, url]) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-brand-gold">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold tracking-widest text-brand-gold uppercase">Quick Links</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {FOOTER_NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-brand-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold tracking-widest text-brand-gold uppercase">Services</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((svc) => (
              <li key={svc._id}>
                <Link href={`/services#${svc.slug}`} className="transition-colors hover:text-brand-gold">
                  {svc.shortTitle || svc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-widest text-brand-gold uppercase">Contact</h2>
          <ul className="mt-5 space-y-3.5 text-sm">
            <li className="flex items-center gap-3">
              <UserRound className="size-4 text-brand-orange" aria-hidden="true" /> {s.ownerName}
            </li>
            <li>
              <a href={telHref(s.phone)} className="flex items-center gap-3 hover:text-brand-gold">
                <Phone className="size-4 text-brand-orange" aria-hidden="true" /> {s.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`} className="flex items-center gap-3 break-all hover:text-brand-gold">
                <Mail className="size-4 shrink-0 text-brand-orange" aria-hidden="true" /> {s.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-brand-orange" aria-hidden="true" /> {s.serviceArea}
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>
            &copy; {year} {s.siteName}. All rights reserved.
          </p>
          {s.privacyPolicyUrl && (
            <a href={s.privacyPolicyUrl} className="hover:text-brand-gold">
              Privacy Policy
            </a>
          )}
        </Container>
      </div>
    </footer>
  );
}
