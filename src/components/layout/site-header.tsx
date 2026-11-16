import Link from "next/link";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { getSettings } from "@/lib/content";
import { telHref } from "@/lib/utils";
import { Container } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { DesktopNav, MobileNav, StickyHeader } from "./header-client";

export function BrandMark({ logoUrl, siteName, size = "md" }: { logoUrl: string; siteName: string; size?: "sm" | "md" }) {
  const px = size === "sm" ? 48 : 64;
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={`${siteName} home`}>
      <SmartImage
        src={logoUrl}
        alt={`${siteName} logo`}
        width={px}
        height={px}
        priority
        className="shrink-0 rounded-full"
        style={{ width: px, height: px }}
      />
      <span className="font-serif text-xl leading-tight font-bold text-brand-dark sm:text-2xl xl:text-[1.75rem]">
        {siteName}
      </span>
    </Link>
  );
}

export async function SiteHeader() {
  const s = await getSettings();
  return (
    <>
      <div className="bg-brand-chocolate text-white">
        <Container className="flex h-10 items-center justify-center gap-5 text-[0.8rem] sm:justify-end sm:gap-8 sm:text-sm">
          <a href={telHref(s.phone)} className="flex items-center gap-2 transition-colors hover:text-brand-gold">
            <Phone className="size-3.5 text-brand-orange" aria-hidden="true" />
            {s.phone}
          </a>
          <a
            href={`mailto:${s.email}`}
            className="hidden items-center gap-2 transition-colors hover:text-brand-gold sm:flex"
          >
            <Mail className="size-3.5 text-brand-orange" aria-hidden="true" />
            {s.email}
          </a>
          <span className="hidden items-center gap-2 md:flex">
            <MapPin className="size-3.5 text-brand-orange" aria-hidden="true" />
            {s.serviceArea}
          </span>
        </Container>
      </div>
      <StickyHeader>
        <Container className="flex h-[76px] items-center justify-between gap-4 lg:h-[84px]">
          <BrandMark logoUrl={s.logoUrl} siteName={s.siteName} />
          <div className="flex items-center gap-4 xl:gap-8">
            <DesktopNav />
            <ButtonLink href="/contact" className="hidden lg:inline-flex">
              <Send aria-hidden="true" /> Get in Touch
            </ButtonLink>
            <MobileNav
              phone={s.phone}
              email={s.email}
              logo={<BrandMark logoUrl={s.logoUrl} siteName={s.siteName} size="sm" />}
            />
          </div>
        </Container>
      </StickyHeader>
    </>
  );
}
