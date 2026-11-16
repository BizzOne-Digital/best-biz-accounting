import "server-only";
import { randomBytes } from "node:crypto";
import { PageContent, Service, SiteSettings, StoredUpload } from "@/models";

export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const FILENAME_RE = /^[a-z0-9][a-z0-9-]{0,150}\.(png|jpg|webp|gif)$/;
export const UPLOAD_URL_RE = /^\/api\/uploads\/(products|gallery|pages|misc)\/([a-z0-9][a-z0-9-]{0,150}\.(?:png|jpg|webp|gif))$/;

export function isUploadFolder(v: unknown): v is UploadFolder {
  return typeof v === "string" && (UPLOAD_FOLDERS as readonly string[]).includes(v);
}

/** Detects the real image type from magic bytes, ignoring the client-declared type. */
export function sniffImageType(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.toString("ascii", 0, 4) === "GIF8") return "image/gif";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

export function generateFilename(originalName: string, mime: string) {
  const base =
    originalName
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image";
  return `${base}-${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${MIME_EXT[mime]}`;
}

export function uploadUrl(folder: string, filename: string) {
  return `/api/uploads/${folder}/${filename}`;
}

/** True when any content document still points at this managed upload URL. */
export async function isUploadReferenced(url: string) {
  const [settings, pages, services] = await Promise.all([
    SiteSettings.find({}).lean(),
    PageContent.find({}).lean(),
    Service.find({ imageUrl: url }).select("_id").lean(),
  ]);
  if (services.length) return true;
  const haystack = JSON.stringify(settings) + JSON.stringify(pages);
  return haystack.includes(`"${url}"`);
}

/** Deletes managed uploads that are no longer referenced anywhere. Safe to call with any URLs. */
export async function cleanupUnusedUploads(urls: Array<string | undefined | null>) {
  const unique = [...new Set(urls.filter((u): u is string => typeof u === "string" && UPLOAD_URL_RE.test(u)))];
  for (const url of unique) {
    try {
      if (await isUploadReferenced(url)) continue;
      const [, folder, filename] = url.match(UPLOAD_URL_RE)! as unknown as [string, UploadFolder, string];
      await StoredUpload.deleteOne({ folder, filename });
    } catch (err) {
      console.error("[uploads] cleanup failed", url, err);
    }
  }
}

/** Collects every managed upload URL found anywhere in a value. */
export function collectUploadUrls(value: unknown): string[] {
  const json = JSON.stringify(value ?? null);
  return [...json.matchAll(/\/api\/uploads\/(?:products|gallery|pages|misc)\/[a-z0-9-]+\.(?:png|jpg|webp|gif)/g)].map((m) => m[0]);
}
