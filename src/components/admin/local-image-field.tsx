"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";
const MAX_BYTES = 8 * 1024 * 1024;

type Folder = "products" | "gallery" | "pages" | "misc";

/**
 * Reusable image upload field. Uploads to POST /api/upload (stored in MongoDB)
 * and reports the resulting URL. Old images are cleaned up server-side when the
 * owning content is saved and the image is no longer referenced.
 */
export function LocalImageField({
  label,
  value,
  onChange,
  folder = "pages",
  hint,
  aspect = "aspect-video",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: Folder;
  hint?: string;
  aspect?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    if (!ACCEPT.split(",").includes(file.type)) return toast.error("Please choose a PNG, JPEG, WEBP or GIF image.");
    if (file.size > MAX_BYTES) return toast.error("Image must be 8MB or smaller.");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");
      onChange(data.url);
      toast.success("Image uploaded. Remember to save your changes.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p id={`${id}-label`} className="mb-1.5 text-sm font-medium text-stone-800">
        {label}
        {hint && <span className="ml-1.5 font-normal text-stone-500">{hint}</span>}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div
          className={cn(
            "relative w-full max-w-60 overflow-hidden rounded-lg border border-dashed border-stone-300 bg-stone-50",
            aspect,
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={`${label} preview`} className="absolute inset-0 size-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-stone-400">No image</div>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="size-6 animate-spin text-brand-orange" aria-label="Uploading" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            aria-labelledby={`${id}-label`}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-800 hover:bg-stone-50 disabled:opacity-60"
          >
            {value ? <RefreshCw className="size-4" aria-hidden="true" /> : <ImagePlus className="size-4" aria-hidden="true" />}
            {value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onChange("")}
              className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="size-4" aria-hidden="true" /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
