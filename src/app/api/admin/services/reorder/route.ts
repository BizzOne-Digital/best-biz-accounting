import { adminRoute, fail, ok, readJson } from "@/lib/admin-api";
import { invalidate, TAGS } from "@/lib/cache";
import { reorderSchema } from "@/lib/validations";
import { Service } from "@/models";


export const POST = adminRoute(async (req) => {
  const parsed = reorderSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail("Invalid order", 422);
  await Service.bulkWrite(parsed.data.ids.map((id, order) => ({ updateOne: { filter: { _id: id }, update: { $set: { order } } } })));
  invalidate(TAGS.services);
  return ok();
});
