import "server-only";
import { DEFAULT_SERVICES, DEFAULT_TESTIMONIALS } from "@/content/defaults";
import { SeedLog, Service, Testimonial } from "@/models";

/*
 * Built-in defaults (services, client testimonials) are imported into MongoDB once each,
 * tracked by key in SeedLog. New defaults added in code later are picked up automatically,
 * and anything an admin deletes stays deleted (its key remains logged).
 */

const serviceKey = (slug: string) => `service:${slug}`;
const testimonialKey = (key: string) => `testimonial:${key}`;

async function loggedKeys() {
  const docs = await SeedLog.find().select("key").lean();
  return new Set(docs.map((d) => d.key));
}

/** Defaults that are neither imported yet nor already present in the database. Read-only. */
export async function pendingDefaults() {
  const logged = await loggedKeys();
  const [slugs, names] = await Promise.all([
    Service.find().select("slug").lean(),
    Testimonial.find().select("clientName").lean(),
  ]);
  const slugSet = new Set(slugs.map((s) => s.slug));
  const nameSet = new Set(names.map((t) => t.clientName));
  return {
    services: DEFAULT_SERVICES.filter((s) => !logged.has(serviceKey(s.slug)) && !slugSet.has(s.slug)),
    testimonials: DEFAULT_TESTIMONIALS.filter((t) => !logged.has(testimonialKey(t.seedKey)) && !nameSet.has(t.clientName)),
    logged,
  };
}

async function markLogged(keys: string[]) {
  if (!keys.length) return;
  await SeedLog.bulkWrite(keys.map((key) => ({ updateOne: { filter: { key }, update: { $setOnInsert: { key } }, upsert: true } })));
}

/** Imports any pending default services. Called from admin routes. */
export async function syncDefaultServices() {
  const { services, logged } = await pendingDefaults();
  if (services.length) {
    const last = await Service.findOne().sort({ order: -1 }).select("order").lean();
    const base = (last?.order ?? -1) + 1;
    await Service.insertMany(
      services.map((s, i) => ({ ...s, order: base + i, published: true })),
      { ordered: false },
    ).catch(() => undefined);
  }
  await markLogged(DEFAULT_SERVICES.map((s) => serviceKey(s.slug)).filter((k) => !logged.has(k)));
}

/** Imports any pending default testimonials. Called from admin routes. */
export async function syncDefaultTestimonials() {
  const { testimonials, logged } = await pendingDefaults();
  if (testimonials.length) {
    const last = await Testimonial.findOne().sort({ order: -1 }).select("order").lean();
    const base = (last?.order ?? -1) + 1;
    await Testimonial.insertMany(
      testimonials.map(({ date, ...t }, i) => ({ ...t, date: date ? new Date(date) : null, order: base + i })),
      { ordered: false },
    ).catch(() => undefined);
  }
  await markLogged(DEFAULT_TESTIMONIALS.map((t) => testimonialKey(t.seedKey)).filter((k) => !logged.has(k)));
}
