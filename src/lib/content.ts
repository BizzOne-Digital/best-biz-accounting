import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectDB, isDbConfigured, toPlain } from "@/lib/db";
import { TAGS } from "@/lib/cache";
import { mergeDefaults } from "@/lib/utils";
import { DEFAULT_PAGES, DEFAULT_SERVICES, DEFAULT_SETTINGS, DEFAULT_TESTIMONIALS, RETIRED_SERVICE_SLUGS, type PageKey, type PagesData, type SiteSettingsData } from "@/content/defaults";
import { PageContent, Service, SiteSettings, Testimonial } from "@/models";
import { pendingDefaults } from "@/lib/seed";
import type { ServiceItem, TestimonialItem } from "@/types";

/*
 * Cached public reads. Each is tagged so admin mutations can expire it instantly.
 * If the database is unavailable the site still renders from verified defaults.
 */

export async function getSettings(): Promise<SiteSettingsData> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.settings);
  if (!isDbConfigured()) return DEFAULT_SETTINGS;
  try {
    await connectDB();
    const doc = await SiteSettings.findOne({ key: "site" }).lean();
    const merged = mergeDefaults(DEFAULT_SETTINGS, doc ? toPlain(doc) : {});
    if (!merged.logoUrl) merged.logoUrl = DEFAULT_SETTINGS.logoUrl;
    return merged;
  } catch (err) {
    console.error("[content] settings fallback", err);
    return DEFAULT_SETTINGS;
  }
}

export async function getPage<K extends PageKey>(key: K): Promise<PagesData[K]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.page(key));
  if (!isDbConfigured()) return DEFAULT_PAGES[key];
  try {
    await connectDB();
    const doc = await PageContent.findOne({ page: key }).lean<{ content?: unknown }>();
    return mergeDefaults(DEFAULT_PAGES[key], doc?.content ? toPlain(doc.content) : {});
  } catch (err) {
    console.error(`[content] page ${key} fallback`, err);
    return DEFAULT_PAGES[key];
  }
}

export function defaultServiceItems(): ServiceItem[] {
  return DEFAULT_SERVICES.map((s, i) => ({ ...s, _id: s.slug, order: i, published: true, imageUrl: "" }));
}

export async function getServices(): Promise<ServiceItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.services);
  if (!isDbConfigured()) return defaultServiceItems();
  try {
    await connectDB();
    const [docs, pending] = await Promise.all([
      Service.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean(),
      pendingDefaults(),
    ]);
    const extra = pending.services.map((svc, i) => ({ ...svc, _id: svc.slug, order: 1000 + i, published: true, imageUrl: "" }));
    const retired = new Set(
      RETIRED_SERVICE_SLUGS.filter((slug) => !pending.logged.has(`retired:service:${slug}`)),
    );
    return [...toPlain<ServiceItem[]>(docs).filter((svc) => !retired.has(svc.slug)), ...extra];
  } catch (err) {
    console.error("[content] services fallback", err);
    return defaultServiceItems();
  }
}

export function defaultTestimonialItems(): TestimonialItem[] {
  return DEFAULT_TESTIMONIALS.filter((t) => t.published).map((t, i) => ({ ...t, _id: `default-${t.seedKey}`, order: i }));
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.testimonials);
  if (!isDbConfigured()) return defaultTestimonialItems();
  try {
    await connectDB();
    const [docs, pending] = await Promise.all([
      Testimonial.find({ published: true }).sort({ featured: -1, order: 1, createdAt: -1 }).lean(),
      pendingDefaults(),
    ]);
    const extra = pending.testimonials
      .filter((t) => t.published)
      .map((t, i) => ({ ...t, _id: `default-${t.seedKey}`, order: 1000 + i }));
    return [...toPlain<TestimonialItem[]>(docs), ...extra];
  } catch (err) {
    console.error("[content] testimonials fallback", err);
    return defaultTestimonialItems();
  }
}

export async function getCopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
