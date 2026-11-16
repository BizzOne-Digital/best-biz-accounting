import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import { FILENAME_RE, isUploadFolder } from "@/lib/uploads";
import { StoredUpload } from "@/models";


/** Lean reads return BSON Binary rather than Buffer; normalize to exact-length bytes. */
function toBytes(data: unknown): Uint8Array<ArrayBuffer> {
  const src = Buffer.isBuffer(data)
    ? data
    : (() => {
        const bin = data as { buffer: Uint8Array; position?: number };
        const len = typeof bin.position === "number" ? bin.position : bin.buffer.byteLength;
        return bin.buffer.subarray(0, len);
      })();
  const out = new Uint8Array(new ArrayBuffer(src.byteLength));
  out.set(src);
  return out;
}

export async function GET(_req: Request, ctx: { params: Promise<{ folder: string; filename: string }> }) {
  await connection();
  const { folder, filename } = await ctx.params;

  if (!isUploadFolder(folder) || typeof filename !== "string" || !FILENAME_RE.test(filename)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    await connectDB();
    const doc = await StoredUpload.findOne({ folder, filename }).select("mimeType size data").lean();
    if (!doc) return new Response("Not found", { status: 404 });

    const bytes = toBytes(doc.data);
    return new Response(bytes, {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(bytes.byteLength),
        // Filenames are unique per upload, so content never changes for a URL.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
      },
    });
  } catch (err) {
    console.error("[uploads] read failed", err);
    return new Response("Server error", { status: 500 });
  }
}
