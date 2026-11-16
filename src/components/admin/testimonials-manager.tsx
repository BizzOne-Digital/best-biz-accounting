"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { TestimonialItem } from "@/types";
import { AdminButton, api, Badge, Card, Input, Label, LoadingBlock, Modal, PageTitle, Select, Switch, Textarea } from "./ui";

type Draft = {
  _id?: string;
  clientName: string;
  businessName: string;
  content: string;
  rating: string;
  date: string;
  published: boolean;
  featured: boolean;
};

const empty: Draft = { clientName: "", businessName: "", content: "", rating: "", date: "", published: false, featured: false };

export function TestimonialsManager() {
  const [items, setItems] = useState<TestimonialItem[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api<{ testimonials: TestimonialItem[] }>("/api/admin/testimonials")
      .then((d) => setItems(d.testimonials))
      .catch((e) => toast.error(e.message));

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!draft) return;
    setSaving(true);
    const { _id, rating, date, ...rest } = draft;
    const payload = { ...rest, rating: rating ? Number(rating) : null, date: date || null };
    try {
      if (_id) await api(`/api/admin/testimonials/${_id}`, { method: "PUT", json: payload });
      else await api("/api/admin/testimonials", { method: "POST", json: payload });
      toast.success(_id ? "Testimonial updated" : "Testimonial added");
      setDraft(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function patch(t: TestimonialItem, data: Partial<TestimonialItem>, msg: string) {
    try {
      await api(`/api/admin/testimonials/${t._id}`, { method: "PUT", json: data });
      setItems((prev) => prev?.map((x) => (x._id === t._id ? { ...x, ...data } : x)) ?? null);
      toast.success(msg);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(t: TestimonialItem) {
    if (!confirm(`Delete the testimonial from ${t.clientName}?`)) return;
    try {
      await api(`/api/admin/testimonials/${t._id}`, { method: "DELETE" });
      setItems((prev) => prev?.filter((x) => x._id !== t._id) ?? null);
      toast.success("Testimonial deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function move(i: number, dir: -1 | 1) {
    if (!items) return;
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    try {
      await api("/api/admin/testimonials/reorder", { method: "POST", json: { ids: next.map((t) => t._id) } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reorder failed");
      load();
    }
  }

  return (
    <>
      <PageTitle
        title="Testimonials"
        description="Only real, client-approved testimonials should be published. Drafts stay hidden from the website."
        actions={
          <AdminButton onClick={() => setDraft({ ...empty })}>
            <Plus /> Add testimonial
          </AdminButton>
        }
      />
      {!items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <Card className="p-10 text-center text-sm text-stone-600">
          No testimonials yet. While none are published, the homepage hides the testimonials section and the
          Testimonials page shows a professional &ldquo;coming soon&rdquo; message.
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-stone-200">
            {items.map((t, i) => (
              <li key={t._id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-stone-900">
                    {t.clientName}
                    {t.businessName && <span className="font-normal text-stone-500"> · {t.businessName}</span>}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-stone-600">{t.content}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={t.published ? "green" : "stone"}>{t.published ? "Published" : "Draft"}</Badge>
                  {t.featured && <Badge tone="orange">Featured</Badge>}
                  <AdminButton variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    <ArrowUp />
                  </AdminButton>
                  <AdminButton variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                    <ArrowDown />
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() => patch(t, { published: !t.published }, t.published ? "Unpublished" : "Published")}
                  >
                    {t.published ? "Unpublish" : "Publish"}
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() => patch(t, { featured: !t.featured }, t.featured ? "Removed from featured" : "Marked as featured")}
                  >
                    <Star className={t.featured ? "fill-brand-gold text-brand-gold" : ""} /> Feature
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setDraft({
                        _id: t._id,
                        clientName: t.clientName,
                        businessName: t.businessName ?? "",
                        content: t.content,
                        rating: t.rating ? String(t.rating) : "",
                        date: t.date ? t.date.slice(0, 10) : "",
                        published: t.published,
                        featured: t.featured,
                      })
                    }
                  >
                    <Pencil /> Edit
                  </AdminButton>
                  <AdminButton variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => remove(t)} aria-label="Delete">
                    <Trash2 />
                  </AdminButton>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft?._id ? "Edit testimonial" : "Add testimonial"}
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setDraft(null)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={save} loading={saving} disabled={!draft?.clientName.trim() || (draft?.content.trim().length ?? 0) < 10}>
              Save testimonial
            </AdminButton>
          </>
        }
      >
        {draft && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="t-name">Client name</Label>
                <Input id="t-name" value={draft.clientName} onChange={(e) => setDraft({ ...draft, clientName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="t-biz" hint="(optional)">
                  Business name
                </Label>
                <Input id="t-biz" value={draft.businessName} onChange={(e) => setDraft({ ...draft, businessName: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="t-content">Review text</Label>
              <Textarea id="t-content" rows={5} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="t-rating" hint="(optional)">
                  Rating
                </Label>
                <Select id="t-rating" value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: e.target.value })}>
                  <option value="">No rating</option>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} star{r > 1 ? "s" : ""}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="t-date" hint="(optional)">
                  Date
                </Label>
                <Input id="t-date" type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <Switch checked={draft.published} onChange={(v) => setDraft({ ...draft, published: v })} label="Published" />
              <Switch checked={draft.featured} onChange={(v) => setDraft({ ...draft, featured: v })} label="Featured" />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
