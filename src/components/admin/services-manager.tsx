"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ServiceItem } from "@/types";
import { SERVICE_ICONS, ServiceIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { LocalImageField } from "./local-image-field";
import { AdminButton, api, Badge, Card, Input, Label, LoadingBlock, Modal, PageTitle, Switch, Textarea } from "./ui";

type Draft = Omit<ServiceItem, "_id" | "order" | "bullets"> & { _id?: string; bulletsText: string };

const empty: Draft = {
  title: "",
  slug: "",
  shortTitle: "",
  summary: "",
  description: "",
  bulletsText: "",
  icon: "file-text",
  imageUrl: "",
  published: true,
};

export function ServicesManager() {
  const [items, setItems] = useState<ServiceItem[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api<{ services: ServiceItem[] }>("/api/admin/services")
      .then((d) => setItems(d.services))
      .catch((e) => toast.error(e.message));

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!draft) return;
    setSaving(true);
    const { _id, bulletsText, ...rest } = draft;
    const payload = {
      ...rest,
      slug: rest.slug || undefined,
      bullets: bulletsText.split("\n").map((b) => b.trim()).filter(Boolean),
    };
    try {
      if (_id) await api(`/api/admin/services/${_id}`, { method: "PUT", json: payload });
      else await api("/api/admin/services", { method: "POST", json: payload });
      toast.success(_id ? "Service updated" : "Service added");
      setDraft(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(s: ServiceItem) {
    try {
      await api(`/api/admin/services/${s._id}`, { method: "PUT", json: { published: !s.published } });
      setItems((prev) => prev?.map((x) => (x._id === s._id ? { ...x, published: !s.published } : x)) ?? null);
      toast.success(s.published ? "Service hidden from website" : "Service published");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(s: ServiceItem) {
    if (!confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/services/${s._id}`, { method: "DELETE" });
      setItems((prev) => prev?.filter((x) => x._id !== s._id) ?? null);
      toast.success("Service deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function move(index: number, dir: -1 | 1) {
    if (!items) return;
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    try {
      await api("/api/admin/services/reorder", { method: "POST", json: { ids: next.map((s) => s._id) } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reorder failed");
      load();
    }
  }

  return (
    <>
      <PageTitle
        title="Services"
        description="Add, edit, reorder and publish the services shown on the website."
        actions={
          <AdminButton onClick={() => setDraft({ ...empty })}>
            <Plus /> Add service
          </AdminButton>
        }
      />
      {!items ? (
        <LoadingBlock />
      ) : (
        <Card>
          <ul className="divide-y divide-stone-200">
            {items.map((s, i) => (
              <li key={s._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-brand-orange">
                    <ServiceIcon name={s.icon} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900">{s.title}</p>
                    <p className="truncate text-sm text-stone-500">{s.summary || "/services#" + s.slug}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={s.published ? "green" : "stone"}>{s.published ? "Published" : "Hidden"}</Badge>
                  <AdminButton variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    <ArrowUp />
                  </AdminButton>
                  <AdminButton variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                    <ArrowDown />
                  </AdminButton>
                  <AdminButton variant="secondary" size="sm" onClick={() => togglePublished(s)}>
                    {s.published ? "Unpublish" : "Publish"}
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setDraft({
                        _id: s._id,
                        title: s.title,
                        slug: s.slug,
                        shortTitle: s.shortTitle ?? "",
                        summary: s.summary ?? "",
                        description: s.description ?? "",
                        bulletsText: s.bullets.join("\n"),
                        icon: s.icon,
                        imageUrl: s.imageUrl ?? "",
                        published: s.published,
                      })
                    }
                  >
                    <Pencil /> Edit
                  </AdminButton>
                  <AdminButton variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => remove(s)} aria-label={`Delete ${s.title}`}>
                    <Trash2 />
                  </AdminButton>
                </div>
              </li>
            ))}
            {items.length === 0 && <li className="p-8 text-center text-sm text-stone-500">No services yet.</li>}
          </ul>
        </Card>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft?._id ? "Edit service" : "Add service"}
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setDraft(null)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={save} loading={saving} disabled={!draft?.title.trim()}>
              Save service
            </AdminButton>
          </>
        }
      >
        {draft && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="svc-title">Title</Label>
                <Input id="svc-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="svc-short" hint="(footer & menus)">
                  Short title
                </Label>
                <Input id="svc-short" value={draft.shortTitle} onChange={(e) => setDraft({ ...draft, shortTitle: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="svc-slug" hint="(page anchor; leave blank to generate)">
                Slug
              </Label>
              <Input id="svc-slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="svc-summary">Summary</Label>
              <Textarea id="svc-summary" rows={2} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="svc-desc">Description</Label>
              <Textarea id="svc-desc" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="svc-bullets" hint="(one per line)">
                What&apos;s included
              </Label>
              <Textarea id="svc-bullets" rows={4} value={draft.bulletsText} onChange={(e) => setDraft({ ...draft, bulletsText: e.target.value })} />
            </div>
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-stone-800">Icon</legend>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
                {Object.entries(SERVICE_ICONS).map(([key, { label }]) => (
                  <button
                    key={key}
                    type="button"
                    title={label}
                    aria-label={label}
                    aria-pressed={draft.icon === key}
                    onClick={() => setDraft({ ...draft, icon: key })}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-lg border transition",
                      draft.icon === key ? "border-brand-orange bg-orange-50 text-brand-orange" : "border-stone-200 text-stone-600 hover:bg-stone-50",
                    )}
                  >
                    <ServiceIcon name={key} className="size-5" />
                  </button>
                ))}
              </div>
            </fieldset>
            <LocalImageField
              label="Service image"
              hint="(optional)"
              value={draft.imageUrl ?? ""}
              folder="gallery"
              onChange={(url) => setDraft({ ...draft, imageUrl: url })}
            />
            <Switch checked={draft.published} onChange={(v) => setDraft({ ...draft, published: v })} label="Published on website" />
          </div>
        )}
      </Modal>
    </>
  );
}
