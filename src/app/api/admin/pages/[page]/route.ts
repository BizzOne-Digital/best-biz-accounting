import { adminRoute, fail, ok, readJson } from "@/lib/admin-api";
import { invalidate, TAGS } from "@/lib/cache";
import { toPlain } from "@/lib/db";
import { validateAgainstShape } from "@/lib/page-schema";
import { cleanupUnusedUploads, collectUploadUrls } from "@/lib/uploads";
import { mergeDefaults } from "@/lib/utils";
import { DEFAULT_PAGES, PAGE_KEYS, type PageKey } from "@/content/defaults";
import { PageContent } from "@/models";


const isPageKey = (v: string): v is PageKey => (PAGE_KEYS as string[]).includes(v);

export const GET = adminRoute<{ page: string }>(async (_req, _admin, { page }) => {
  if (!isPageKey(page)) return fail("Unknown page", 404);
  const doc = await PageContent.findOne({ page }).lean<{ content?: unknown }>();
  return ok({ content: mergeDefaults(DEFAULT_PAGES[page], doc?.content ? toPlain(doc.content) : {}), defaults: DEFAULT_PAGES[page] });
});

export const PUT = adminRoute<{ page: string }>(async (req, _admin, { page }) => {
  if (!isPageKey(page)) return fail("Unknown page", 404);
  const body = await readJson(req);
  const result = validateAgainstShape(DEFAULT_PAGES[page], body?.content);
  if (!result.ok) return fail(result.error, 422);

  const before = await PageContent.findOne({ page }).lean();
  await PageContent.updateOne({ page }, { $set: { content: result.value } }, { upsert: true });
  invalidate(TAGS.page(page));
  await cleanupUnusedUploads(collectUploadUrls(before));
  return ok({ content: mergeDefaults(DEFAULT_PAGES[page], result.value) });
});

/** Reset a page to its default content. */
export const DELETE = adminRoute<{ page: string }>(async (_req, _admin, { page }) => {
  if (!isPageKey(page)) return fail("Unknown page", 404);
  const before = await PageContent.findOneAndDelete({ page }).lean();
  invalidate(TAGS.page(page));
  await cleanupUnusedUploads(collectUploadUrls(before));
  return ok({ content: DEFAULT_PAGES[page] });
});
