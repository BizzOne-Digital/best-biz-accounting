import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.seoTitle, template: `%s | ${s.siteName}` },
    description: s.seoDescription,
    applicationName: s.siteName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: s.siteName,
      title: s.seoTitle,
      description: s.seoDescription,
      url: "/",
      images: s.ogImageUrl ? [{ url: s.ogImageUrl, width: 1200, height: 630, alt: s.siteName }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: s.seoTitle,
      description: s.seoDescription,
      images: s.ogImageUrl ? [s.ogImageUrl] : undefined,
    },
    icons: s.faviconUrl ? { icon: s.faviconUrl, apple: s.faviconUrl } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#24130D",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-dvh bg-white">{children}</body>
    </html>
  );
}
