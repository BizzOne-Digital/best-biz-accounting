import { adminRoute, ok } from "@/lib/admin-api";
import { uploadUrl } from "@/lib/uploads";
import { PageContent, Service, SiteSettings, StoredUpload } from "@/models";


export const GET = adminRoute(async () => {
  const [files, settings, pages, services] = await Promise.all([
    StoredUpload.find().sort({ createdAt: -1 }).select("folder filename mimeType size createdAt").lean(),
    SiteSettings.find().lean(),
    PageContent.find().lean(),
    Service.find().select("imageUrl").lean(),
  ]);
  const haystack = JSON.stringify([settings, pages, services]);
  return ok({
    files: files.map((f) => {
      const url = uploadUrl(f.folder, f.filename);
      return {
        _id: String(f._id),
        folder: f.folder,
        filename: f.filename,
        mimeType: f.mimeType,
        size: f.size,
        createdAt: f.createdAt,
        url,
        inUse: haystack.includes(`"${url}"`),
      };
    }),
  });
});
