import { adminRoute, fail, ok, readJson } from "@/lib/admin-api";
import { invalidate, TAGS } from "@/lib/cache";
import { toPlain } from "@/lib/db";
import { testimonialSchema } from "@/lib/validations";
import { Testimonial } from "@/models";


export const GET = adminRoute(async () => {
  const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
  return ok({ testimonials: toPlain(testimonials) });
});

export const POST = adminRoute(async (req) => {
  const parsed = testimonialSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid testimonial", 422);
  const { date, ...rest } = parsed.data;
  const last = await Testimonial.findOne().sort({ order: -1 }).select("order").lean();
  const t = await Testimonial.create({ ...rest, date: date ? new Date(date) : null, order: (last?.order ?? -1) + 1 });
  invalidate(TAGS.testimonials);
  return ok({ testimonial: toPlain(t.toObject()) });
});
