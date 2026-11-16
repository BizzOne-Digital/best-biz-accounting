import bcrypt from "bcryptjs";
import { z } from "zod";
import { adminRoute, fail, ok, readJson } from "@/lib/admin-api";
import { setSessionCookie } from "@/lib/auth";
import { passwordSchema } from "@/lib/validations";
import { AdminUser } from "@/models";


export const GET = adminRoute(async (_req, admin) => ok({ admin }));

const profileSchema = z.object({ name: z.string().trim().min(2).max(120) });

/** Update display name. */
export const PATCH = adminRoute(async (req, admin) => {
  const parsed = profileSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail("Enter a valid name", 422);
  await AdminUser.updateOne({ _id: admin.id }, { $set: { name: parsed.data.name } });
  return ok();
});

/** Change password. Bumps the session version so other sessions are signed out. */
export const PUT = adminRoute(async (req, admin) => {
  const parsed = passwordSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid password", 422);
  const user = await AdminUser.findById(admin.id);
  if (!user) return fail("Not found", 404);
  if (!(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
    return fail("Current password is incorrect", 400);
  }
  user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  user.sessionVersion = (user.sessionVersion ?? 1) + 1;
  await user.save();
  await setSessionCookie(String(user._id), user.sessionVersion);
  return ok();
});
