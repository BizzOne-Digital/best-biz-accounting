import { adminRoute, fail, ok, readJson } from "@/lib/admin-api";
import { invalidate, TAGS } from "@/lib/cache";
import { toPlain } from "@/lib/db";
import { objectId, testimonialSchema } from "@/lib/validations";
import { Testimonial } from "@/models";


export const PUT = adminRoute<{ id: string }>(async (req, _a, { id }) => {
  if (!objectId.safeParse(id).success) return fail("Not found", 404);
  const parsed = testimonialSchema.partial().safeParse(await readJson(req));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid testimonial", 422);
  const { date, ...rest } = parsed.data;
  const update: Record<string, unknown> = { ...rest };
  if (date !== undefined) update.date = date ? new Date(date) : null;
  const t = await Testimonial.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).lean();
  if (!t) return fail("Not found", 404);
  invalidate(TAGS.testimonials);
  return ok({ testimonial: toPlain(t) });
});

export const DELETE = adminRoute<{ id: string }>(async (_req, _a, { id }) => {
  if (!objectId.safeParse(id).success) return fail("Not found", 404);
  const removed = await Testimonial.findByIdAndDelete(id);
  if (!removed) return fail("Not found", 404);
  invalidate(TAGS.testimonials);
  return ok();
});
