"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Phone, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { InquiryItem } from "@/types";
import { cn, telHref } from "@/lib/utils";
import { AdminButton, api, Badge, Card, Input, LoadingBlock, Modal, PageTitle, Select } from "./ui";

const STATUS_TONE = { new: "orange", read: "blue", responded: "green" } as const;
const EMAIL_LABEL = { sent: "Email sent", failed: "Email failed", not_configured: "Email not configured" } as const;

type ListResponse = { inquiries: InquiryItem[]; total: number; page: number; pages: number };

export function InquiriesManager() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<InquiryItem | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page) });
    if (query) params.set("q", query);
    if (status) params.set("status", status);
    return api<ListResponse>(`/api/admin/inquiries?${params}`)
      .then(setData)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"));
  }, [page, query, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function setInquiryStatus(item: InquiryItem, next: InquiryItem["status"]) {
    try {
      await api(`/api/admin/inquiries/${item._id}`, { method: "PATCH", json: { status: next } });
      setData((d) => d && { ...d, inquiries: d.inquiries.map((x) => (x._id === item._id ? { ...x, status: next } : x)) });
      setSelected((s) => (s && s._id === item._id ? { ...s, status: next } : s));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function open(item: InquiryItem) {
    setSelected(item);
    if (item.status === "new") setInquiryStatus(item, "read");
  }

  async function remove(item: InquiryItem) {
    if (!confirm(`Delete the inquiry from ${item.fullName}? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/inquiries/${item._id}`, { method: "DELETE" });
      setSelected(null);
      toast.success("Inquiry deleted");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <>
      <PageTitle title="Contact Inquiries" description="Messages submitted through the website contact form." />

      <Card className="mb-4 p-4">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setQuery(q.trim());
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
            <Input
              aria-label="Search inquiries"
              placeholder="Search name, email, business, message..."
              className="pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select
            aria-label="Filter by status"
            className="sm:w-44"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </Select>
          <AdminButton type="submit" variant="secondary">
            Search
          </AdminButton>
        </form>
      </Card>

      {!data ? (
        <LoadingBlock />
      ) : data.inquiries.length === 0 ? (
        <Card className="p-10 text-center text-sm text-stone-600">No inquiries found.</Card>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-stone-200">
            {data.inquiries.map((item) => (
              <li key={item._id}>
                <button
                  type="button"
                  onClick={() => open(item)}
                  className={cn(
                    "flex w-full flex-col gap-1 px-4 py-3.5 text-left transition hover:bg-stone-50 sm:flex-row sm:items-center sm:gap-4",
                    item.status === "new" && "bg-orange-50/50",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-stone-900", item.status === "new" ? "font-semibold" : "font-medium")}>
                      {item.fullName}
                      {item.businessName && <span className="font-normal text-stone-500"> · {item.businessName}</span>}
                    </p>
                    <p className="truncate text-sm text-stone-600">
                      <span className="font-medium">{item.service}</span> — {item.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={STATUS_TONE[item.status]}>{item.status}</Badge>
                    <time className="text-xs whitespace-nowrap text-stone-500" dateTime={item.createdAt}>
                      {new Date(item.createdAt).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })}
                    </time>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {data.pages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3 text-sm">
              <span className="text-stone-600">
                Page {data.page} of {data.pages} · {data.total} total
              </span>
              <div className="flex gap-2">
                <AdminButton size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </AdminButton>
                <AdminButton size="sm" variant="secondary" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
                  Next
                </AdminButton>
              </div>
            </div>
          )}
        </Card>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Inquiry from ${selected.fullName}` : ""}
        footer={
          selected && (
            <>
              <AdminButton variant="ghost" className="mr-auto text-red-600 hover:bg-red-50" onClick={() => remove(selected)}>
                <Trash2 /> Delete
              </AdminButton>
              <Select
                aria-label="Status"
                className="w-40"
                value={selected.status}
                onChange={(e) => setInquiryStatus(selected, e.target.value as InquiryItem["status"])}
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
              </Select>
            </>
          )
        }
      >
        {selected && (
          <dl className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-stone-500">Business</dt>
                <dd className="font-medium">{selected.businessName || "—"}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Service</dt>
                <dd className="font-medium">{selected.service}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Email</dt>
                <dd>
                  <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 font-medium text-brand-orange hover:underline">
                    <Mail className="size-4" /> {selected.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Phone</dt>
                <dd>
                  {selected.phone ? (
                    <a href={telHref(selected.phone)} className="inline-flex items-center gap-1.5 font-medium text-brand-orange hover:underline">
                      <Phone className="size-4" /> {selected.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Received</dt>
                <dd className="font-medium">{new Date(selected.createdAt).toLocaleString("en-CA")}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Notification</dt>
                <dd>
                  <Badge tone={selected.emailStatus === "sent" ? "green" : selected.emailStatus === "failed" ? "red" : "stone"}>
                    {EMAIL_LABEL[selected.emailStatus]}
                  </Badge>
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-stone-500">Message</dt>
              <dd className="mt-1 rounded-lg bg-stone-50 p-4 whitespace-pre-wrap text-stone-800">{selected.message}</dd>
            </div>
          </dl>
        )}
      </Modal>
    </>
  );
}
