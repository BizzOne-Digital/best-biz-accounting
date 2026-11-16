"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, Briefcase, Image as ImageIcon, Inbox, MailOpen, MessageSquareQuote, PenLine } from "lucide-react";
import { toast } from "sonner";
import { api, Badge, Card, LoadingBlock, PageTitle } from "./ui";
import { useAdmin } from "./admin-shell";

type Stats = {
  stats: {
    inquiries: number;
    newInquiries: number;
    publishedTestimonials: number;
    draftTestimonials: number;
    activeServices: number;
    uploads: number;
  };
  smtpConfigured: boolean;
  activity: Array<{ type: string; id: string; text: string; status: string; at: string }>;
};

export function Dashboard() {
  const { name } = useAdmin();
  const [data, setData] = useState<Stats | null>(null);

  useEffect(() => {
    api<Stats>("/api/admin/stats")
      .then(setData)
      .catch((e) => toast.error(e.message));
  }, []);

  const cards = data
    ? [
        { label: "New inquiries", value: data.stats.newInquiries, Icon: MailOpen, href: "/admin/inquiries", highlight: data.stats.newInquiries > 0 },
        { label: "Total inquiries", value: data.stats.inquiries, Icon: Inbox, href: "/admin/inquiries" },
        { label: "Published testimonials", value: data.stats.publishedTestimonials, Icon: MessageSquareQuote, href: "/admin/testimonials" },
        { label: "Draft testimonials", value: data.stats.draftTestimonials, Icon: PenLine, href: "/admin/testimonials" },
        { label: "Active services", value: data.stats.activeServices, Icon: Briefcase, href: "/admin/services" },
        { label: "Uploaded images", value: data.stats.uploads, Icon: ImageIcon, href: "/admin/media" },
      ]
    : [];

  return (
    <>
      <PageTitle title={`Welcome back, ${name.split(" ")[0]}`} description="Here's what's happening on your website." />
      {!data ? (
        <LoadingBlock />
      ) : (
        <div className="space-y-6">
          {!data.smtpConfigured && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p>
                Email notifications are not configured. Contact form inquiries are saved here, but no email alert is sent.
                Add SMTP settings to the environment variables to enable notifications.
              </p>
            </div>
          )}
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map(({ label, value, Icon, href, highlight }) => (
              <li key={label}>
                <Link href={href}>
                  <Card className={`flex items-center gap-4 p-5 transition hover:shadow-md ${highlight ? "border-brand-orange" : ""}`}>
                    <span className={`flex size-12 items-center justify-center rounded-xl ${highlight ? "bg-brand-orange text-white" : "bg-orange-50 text-brand-orange"}`}>
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-2xl font-semibold text-stone-900">{value}</p>
                      <p className="text-sm text-stone-600">{label}</p>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
          <Card>
            <h2 className="border-b border-stone-200 px-5 py-4 font-semibold">Recent activity</h2>
            {data.activity.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-stone-500">No activity yet.</p>
            ) : (
              <ul className="divide-y divide-stone-200">
                {data.activity.map((a) => (
                  <li key={`${a.type}-${a.id}`} className="flex flex-col gap-1 px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <Link href={a.type === "inquiry" ? "/admin/inquiries" : "/admin/testimonials"} className="text-stone-800 hover:text-brand-orange">
                      {a.text}
                    </Link>
                    <span className="flex items-center gap-3">
                      <Badge tone={a.status === "new" ? "orange" : a.status === "published" || a.status === "responded" ? "green" : "stone"}>{a.status}</Badge>
                      <time className="text-xs text-stone-500" dateTime={a.at}>
                        {new Date(a.at).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })}
                      </time>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
