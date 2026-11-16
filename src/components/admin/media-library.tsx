"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, api, Badge, Card, LoadingBlock, PageTitle, Select } from "./ui";

type MediaFile = {
  _id: string;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
  url: string;
  inUse: boolean;
};

const formatSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

export function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[] | null>(null);
  const [folder, setFolder] = useState("gallery");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    api<{ files: MediaFile[] }>("/api/admin/media")
      .then((d) => setFiles(d.files))
      .catch((e) => toast.error(e.message));

  useEffect(() => {
    load();
  }, []);

  async function upload(list: FileList) {
    setUploading(true);
    let okCount = 0;
    for (const file of Array.from(list)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) okCount++;
      else toast.error(`${file.name}: ${data.error || "upload failed"}`);
    }
    if (okCount) toast.success(`${okCount} image${okCount > 1 ? "s" : ""} uploaded`);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    load();
  }

  async function remove(f: MediaFile) {
    if (!confirm(`Delete ${f.filename}?`)) return;
    try {
      await api(`/api/admin/media/${f._id}`, { method: "DELETE" });
      setFiles((prev) => prev?.filter((x) => x._id !== f._id) ?? null);
      toast.success("Image deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <>
      <PageTitle
        title="Images & Media"
        description="Images are stored in the database, so they persist across deployments. Images in use cannot be deleted."
        actions={
          <>
            <Select aria-label="Upload folder" value={folder} onChange={(e) => setFolder(e.target.value)} className="w-36">
              <option value="gallery">Gallery</option>
              <option value="pages">Pages</option>
              <option value="misc">Misc</option>
            </Select>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              aria-label="Choose images to upload"
              onChange={(e) => e.target.files?.length && upload(e.target.files)}
            />
            <AdminButton loading={uploading} onClick={() => inputRef.current?.click()}>
              <Upload /> Upload images
            </AdminButton>
          </>
        }
      />
      {!files ? (
        <LoadingBlock />
      ) : files.length === 0 ? (
        <Card className="p-10 text-center text-sm text-stone-600">No uploaded images yet.</Card>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {files.map((f) => (
            <li key={f._id}>
              <Card className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={f.filename} loading="lazy" className="aspect-[4/3] w-full bg-stone-100 object-cover" />
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs font-medium text-stone-800" title={f.filename}>
                    {f.filename}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                    <Badge>{f.folder}</Badge>
                    {f.inUse ? <Badge tone="green">In use</Badge> : <Badge tone="stone">Unused</Badge>}
                    <span>{formatSize(f.size)}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <AdminButton
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(f.url);
                        toast.success("Image URL copied");
                      }}
                    >
                      <Copy /> Copy URL
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      disabled={f.inUse}
                      title={f.inUse ? "Used on the website" : "Delete"}
                      aria-label={`Delete ${f.filename}`}
                      onClick={() => remove(f)}
                    >
                      <Trash2 />
                    </AdminButton>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
