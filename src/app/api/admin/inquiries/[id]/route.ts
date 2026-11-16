import { z } from "zod";
import { adminRoute, fail, ok, readJson } from "@/lib/admin-api";
import { toPlain } from "@/lib/db";
import { objectId } from "@/lib/validations";
import { ContactInquiry } from "@/models";


const statusSchema = z.object({ status: z.enum(["new", "read", "responded"]) });

export const PATCH = adminRoute<{ id: string }>(async (req, _a, { id }) => {
  if (!objectId.safeParse(id).success) return fail("Not found", 404);
  const parsed = statusSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail("Invalid status", 422);
  const doc = await ContactInquiry.findByIdAndUpdate(id, { $set: parsed.data }, { new: true })
    .select("-fingerprint -ipHash")
    .lean();
  if (!doc) return fail("Not found", 404);
  return ok({ inquiry: toPlain(doc) });
});

export const DELETE = adminRoute<{ id: string }>(async (_req, _a, { id }) => {
  if (!objectId.safeParse(id).success) return fail("Not found", 404);
  const removed = await ContactInquiry.findByIdAndDelete(id);
  if (!removed) return fail("Not found", 404);
  return ok();
});
