import { adminRoute, fail, ok } from "@/lib/admin-api";
import { isUploadReferenced, uploadUrl } from "@/lib/uploads";
import { objectId } from "@/lib/validations";
import { StoredUpload } from "@/models";


export const DELETE = adminRoute<{ id: string }>(async (_req, _a, { id }) => {
  if (!objectId.safeParse(id).success) return fail("Not found", 404);
  const file = await StoredUpload.findById(id).select("folder filename").lean();
  if (!file) return fail("Not found", 404);
  if (await isUploadReferenced(uploadUrl(file.folder, file.filename))) {
    return fail("This image is still used on the website. Replace it there first.", 409);
  }
  await StoredUpload.deleteOne({ _id: id });
  return ok();
});
