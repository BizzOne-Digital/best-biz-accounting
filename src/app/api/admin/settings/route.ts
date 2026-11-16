import { adminRoute, fail, ok, readJson } from "@/lib/admin-api";
import { invalidate, TAGS } from "@/lib/cache";
import { toPlain } from "@/lib/db";
import { mergeDefaults } from "@/lib/utils";
import { cleanupUnusedUploads, collectUploadUrls } from "@/lib/uploads";
import { settingsSchema } from "@/lib/validations";
import { DEFAULT_SETTINGS } from "@/content/defaults";
import { SiteSettings } from "@/models";


export const GET = adminRoute(async () => {
  const doc = await SiteSettings.findOne({ key: "site" }).lean();
  return ok({ settings: mergeDefaults(DEFAULT_SETTINGS, doc ? toPlain(doc) : {}) });
});

export const PUT = adminRoute(async (req) => {
  const parsed = settingsSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(`${issue.path.join(".")}: ${issue.message}`, 422);
  }
  const before = await SiteSettings.findOne({ key: "site" }).lean();
  await SiteSettings.updateOne({ key: "site" }, { $set: { ...parsed.data, key: "site" } }, { upsert: true });
  invalidate(TAGS.settings);
  await cleanupUnusedUploads(collectUploadUrls(before));
  return ok({ settings: parsed.data });
});
