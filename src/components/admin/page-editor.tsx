"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LocalImageField } from "./local-image-field";
import { AdminButton, api, Card, Input, Label, LoadingBlock, PageTitle, Switch, Textarea } from "./ui";

type Json = string | number | boolean | Json[] | { [k: string]: Json };
type Obj = { [k: string]: Json };

const PAGES = [
  { key: "home", label: "Home", href: "/" },
  { key: "services", label: "Services", href: "/services" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "testimonials", label: "Testimonials", href: "/testimonials" },
  { key: "contact", label: "Contact", href: "/contact" },
] as const;

const LABELS: Record<string, string> = {
  hero: "Hero Banner",
  trust: "Trust / Experience Strip",
  servicesPreview: "Services Preview",
  about: "About Preview",
  whyChoose: "Why Choose Us",
  industries: "Industries Served",
  testimonials: "Testimonials Section",
  process: "How It Works",
  faq: "FAQ",
  cta: "Call to Action",
  primaryCta: "Primary button label",
  secondaryCta: "Secondary button label",
  ctaLabel: "Button label",
  offerTitle: "Consultation card title",
  offerText: "Consultation card text",
  offerCta: "Consultation card button",
  primaryLabel: "Button label",
  buttonLabel: "Button label",
  visible: "Show this section on the website",
  intro: "Introduction",
  approach: "Our Approach",
  highlight: "Experience Highlight",
  pricing: "Pricing / Quote Section",
  empty: "Empty State (shown when no testimonials are published)",
  form: "Contact Form",
  successMessage: "Success message",
  highlights: "Highlight points",
  items: "Items",
  industries_list: "Industries",
};

const LONG_KEYS = new Set(["body", "description", "text", "intro", "subtitle", "offerText", "successMessage", "answer"]);

const humanize = (key: string) =>
  LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

function blankLike(shape: Json): Json {
  if (typeof shape === "string") return "";
  if (typeof shape === "boolean") return false;
  if (typeof shape === "number") return 0;
  if (Array.isArray(shape)) return [];
  return Object.fromEntries(Object.entries(shape).map(([k, v]) => [k, blankLike(v)]));
}

function FieldEditor({
  name,
  path,
  value,
  shape,
  onChange,
}: {
  name: string;
  path: string;
  value: Json;
  shape: Json;
  onChange: (v: Json) => void;
}) {
  const id = path.replace(/[^\w]/g, "-");

  if (typeof shape === "boolean") {
    return <Switch id={id} checked={Boolean(value)} onChange={onChange} label={humanize(name)} />;
  }

  if (typeof shape === "string") {
    if (name === "image") {
      return <LocalImageField label="Image" value={String(value ?? "")} onChange={onChange} folder="pages" />;
    }
    const long = LONG_KEYS.has(name) || shape.length > 110;
    return (
      <div>
        <Label htmlFor={id}>{humanize(name)}</Label>
        {long ? (
          <Textarea id={id} rows={name === "body" ? 7 : 3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <Input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>
    );
  }

  if (Array.isArray(shape)) {
    const list = Array.isArray(value) ? value : [];
    const itemShape = shape[0] ?? "";
    const move = (i: number, dir: -1 | 1) => {
      const next = [...list];
      const j = i + dir;
      if (j < 0 || j >= next.length) return;
      [next[i], next[j]] = [next[j], next[i]];
      onChange(next);
    };
    return (
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-stone-800">{humanize(name)}</legend>
        <ol className="space-y-3">
          {list.map((item, i) => (
            <li key={i} className="flex gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="flex-1 space-y-3">
                {typeof itemShape === "object" && !Array.isArray(itemShape) ? (
                  Object.keys(itemShape).map((k) => (
                    <FieldEditor
                      key={k}
                      name={k}
                      path={`${path}.${i}.${k}`}
                      value={(item as Obj)?.[k] ?? ""}
                      shape={(itemShape as Obj)[k]}
                      onChange={(v) => {
                        const next = [...list];
                        next[i] = { ...(item as Obj), [k]: v };
                        onChange(next);
                      }}
                    />
                  ))
                ) : (
                  <Input
                    aria-label={`${humanize(name)} ${i + 1}`}
                    value={String(item ?? "")}
                    onChange={(e) => {
                      const next = [...list];
                      next[i] = e.target.value;
                      onChange(next);
                    }}
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1.5 hover:bg-stone-200 disabled:opacity-30" aria-label="Move up">
                  <ArrowUp className="size-4" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="rounded p-1.5 hover:bg-stone-200 disabled:opacity-30" aria-label="Move down">
                  <ArrowDown className="size-4" />
                </button>
                <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))} className="rounded p-1.5 text-red-600 hover:bg-red-50" aria-label="Remove item">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>
        <AdminButton type="button" variant="secondary" size="sm" className="mt-3" onClick={() => onChange([...list, blankLike(itemShape)])}>
          <Plus /> Add item
        </AdminButton>
      </fieldset>
    );
  }

  // Nested object
  const obj = (value ?? {}) as Obj;
  return (
    <div className="space-y-4">
      {Object.keys(shape).map((k) => (
        <FieldEditor
          key={k}
          name={k}
          path={`${path}.${k}`}
          value={obj[k]}
          shape={(shape as Obj)[k]}
          onChange={(v) => onChange({ ...obj, [k]: v })}
        />
      ))}
    </div>
  );
}

export function PageEditor() {
  const [page, setPage] = useState<(typeof PAGES)[number]["key"]>("home");
  const [content, setContent] = useState<Obj | null>(null);
  const [defaults, setDefaults] = useState<Obj | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ content: Obj; defaults: Obj }>(`/api/admin/pages/${page}`)
      .then((data) => {
        setContent(data.content);
        setDefaults(data.defaults);
        setDirty(false);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load page"));
  }, [page]);

  async function save() {
    if (!content) return;
    setSaving(true);
    try {
      const data = await api<{ content: Obj }>(`/api/admin/pages/${page}`, { method: "PUT", json: { content } });
      setContent(data.content);
      setDirty(false);
      toast.success("Page saved. Changes are live on the website.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!confirm("Reset this page to its original default content? This cannot be undone.")) return;
    try {
      const data = await api<{ content: Obj }>(`/api/admin/pages/${page}`, { method: "DELETE" });
      setContent(data.content);
      setDirty(false);
      toast.success("Page reset to defaults.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reset failed");
    }
  }

  const current = PAGES.find((p) => p.key === page)!;

  return (
    <>
      <PageTitle
        title="Page Content"
        description="Edit headings, text, images and section visibility for each public page."
        actions={
          <>
            <a
              href={current.href}
              target="_blank"
              rel="noopener"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 text-sm font-medium hover:bg-stone-50"
            >
              <ExternalLink className="size-4" /> Preview
            </a>
            <AdminButton variant="secondary" onClick={reset}>
              <RotateCcw /> Reset
            </AdminButton>
            <AdminButton onClick={save} loading={saving} disabled={!dirty || !content}>
              <Save /> Save changes
            </AdminButton>
          </>
        }
      />

      <div role="tablist" aria-label="Pages" className="mb-6 flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button
            key={p.key}
            role="tab"
            aria-selected={page === p.key}
            onClick={() => {
              if (dirty && !confirm("You have unsaved changes. Discard them?")) return;
              if (p.key === page) return;
              setContent(null);
              setPage(p.key);
            }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              page === p.key ? "bg-brand-dark text-white" : "bg-white text-stone-700 hover:bg-stone-50",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {!content || !defaults ? (
        <LoadingBlock />
      ) : (
        <div className="space-y-5">
          {Object.keys(defaults).map((section) => (
            <Card key={section} className="p-5 sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-stone-900">{humanize(section)}</h2>
              <FieldEditor
                name={section}
                path={section}
                value={content[section]}
                shape={defaults[section]}
                onChange={(v) => {
                  setContent({ ...content, [section]: v });
                  setDirty(true);
                }}
              />
            </Card>
          ))}
          <div className="sticky bottom-4 flex justify-end">
            <AdminButton onClick={save} loading={saving} disabled={!dirty} className="shadow-lg">
              <Save /> Save changes
            </AdminButton>
          </div>
        </div>
      )}
    </>
  );
}
