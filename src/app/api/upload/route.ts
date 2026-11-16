import { connectDB } from "@/lib/db";
import { getAdmin, isSameOrigin, unauthorized } from "@/lib/auth";
import {
  generateFilename,
  isUploadFolder,
  MAX_UPLOAD_BYTES,
  MIME_EXT,
  sniffImageType,
  uploadUrl,
} from "@/lib/uploads";
import { StoredUpload } from "@/models";


const fail = (error: string, status = 400) => Response.json({ success: false, error }, { status });

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return fail("Invalid origin", 403);
  if (!(await getAdmin())) return unauthorized();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Expected multipart form data");
  }

  const file = form.get("file");
  const folder = form.get("folder") ?? "misc";
  if (!isUploadFolder(folder)) return fail("Invalid folder");
  if (!(file instanceof File)) return fail("No file provided");
  if (file.size === 0) return fail("File is empty");
  if (file.size > MAX_UPLOAD_BYTES) return fail("File is larger than 8MB", 413);
  if (!MIME_EXT[file.type]) return fail("Only PNG, JPEG, WEBP or GIF images are allowed", 415);

  const data = Buffer.from(await file.arrayBuffer());
  const realType = sniffImageType(data);
  if (!realType || !MIME_EXT[realType]) return fail("File content is not a supported image", 415);

  const filename = generateFilename(file.name, realType);
  try {
    await connectDB();
    await StoredUpload.create({ folder, filename, mimeType: realType, size: data.length, data });
  } catch (err) {
    console.error("[upload] failed", err);
    return fail("Upload failed. Please try again.", 500);
  }

  return Response.json({ success: true, url: uploadUrl(folder, filename), filename, size: data.length, folder });
}
