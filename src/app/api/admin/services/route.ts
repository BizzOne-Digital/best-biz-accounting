import { adminRoute, ensureServicesSeeded, fail, ok, readJson, uniqueServiceSlug } from "@/lib/admin-api";
import { invalidate, TAGS } from "@/lib/cache";
import { toPlain } from "@/lib/db";
import { serviceSchema } from "@/lib/validations";
import { Service } from "@/models";


export const GET = adminRoute(async () => {
  await ensureServicesSeeded();
  const services = await Service.find().sort({ order: 1, createdAt: 1 }).lean();
  return ok({ services: toPlain(services) });
});

export const POST = adminRoute(async (req) => {
  const parsed = serviceSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid service", 422);
  await ensureServicesSeeded();
  const last = await Service.findOne().sort({ order: -1 }).select("order").lean();
  const slug = await uniqueServiceSlug(parsed.data.slug || parsed.data.title);
  const service = await Service.create({ ...parsed.data, slug, order: (last?.order ?? -1) + 1 });
  invalidate(TAGS.services);
  return ok({ service: toPlain(service.toObject()) });
});
