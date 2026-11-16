import { adminRoute, fail, ok, readJson, uniqueServiceSlug } from "@/lib/admin-api";
import { invalidate, TAGS } from "@/lib/cache";
import { toPlain } from "@/lib/db";
import { cleanupUnusedUploads } from "@/lib/uploads";
import { objectId, serviceSchema } from "@/lib/validations";
import { Service } from "@/models";


export const PUT = adminRoute<{ id: string }>(async (req, _a, { id }) => {
  if (!objectId.safeParse(id).success) return fail("Not found", 404);
  const parsed = serviceSchema.partial().safeParse(await readJson(req));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid service", 422);

  const existing = await Service.findById(id).lean();
  if (!existing) return fail("Not found", 404);

  const update = { ...parsed.data };
  if (update.slug !== undefined && update.slug !== existing.slug) {
    update.slug = await uniqueServiceSlug(update.slug || update.title || existing.title, id);
  }
  const service = await Service.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).lean();
  invalidate(TAGS.services);
  if (existing.imageUrl && existing.imageUrl !== service?.imageUrl) await cleanupUnusedUploads([existing.imageUrl]);
  return ok({ service: toPlain(service) });
});

export const DELETE = adminRoute<{ id: string }>(async (_req, _a, { id }) => {
  if (!objectId.safeParse(id).success) return fail("Not found", 404);
  const removed = await Service.findByIdAndDelete(id).lean();
  if (!removed) return fail("Not found", 404);
  invalidate(TAGS.services);
  await cleanupUnusedUploads([removed.imageUrl]);
  return ok();
});
