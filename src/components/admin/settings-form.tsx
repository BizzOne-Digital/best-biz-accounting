"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import type { SiteSettingsData } from "@/content/defaults";
import { LocalImageField } from "./local-image-field";
import { AdminButton, api, Card, Input, Label, LoadingBlock, PageTitle, Textarea } from "./ui";

type TextKey = Exclude<keyof SiteSettingsData, "social" | "logoUrl" | "faviconUrl" | "ogImageUrl">;

export function SettingsForm() {
  const [s, setS] = useState<SiteSettingsData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ settings: SiteSettingsData }>("/api/admin/settings")
      .then((d) => setS(d.settings))
      .catch((e) => toast.error(e.message));
  }, []);

  if (!s) return <LoadingBlock />;

  const text = (key: TextKey, label: string, opts: { long?: boolean; hint?: string; type?: string } = {}) => (
    <div>
      <Label htmlFor={key} hint={opts.hint}>
        {label}
      </Label>
      {opts.long ? (
        <Textarea id={key} rows={3} value={s[key]} onChange={(e) => setS({ ...s, [key]: e.target.value })} />
      ) : (
        <Input id={key} type={opts.type} value={s[key]} onChange={(e) => setS({ ...s, [key]: e.target.value })} />
      )}
    </div>
  );

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api("/api/admin/settings", { method: "PUT", json: s });
      toast.success("Settings saved. Changes are live on the website.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save}>
      <PageTitle
        title="Website Settings"
        description="Business details, branding and search engine settings."
        actions={
          <AdminButton type="submit" loading={saving}>
            <Save /> Save settings
          </AdminButton>
        }
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="space-y-4 p-5 sm:p-6">
          <h2 className="font-semibold">Business details</h2>
          {text("siteName", "Website name")}
          {text("ownerName", "Team name", { hint: "(shown in footer and contact page)" })}
          {text("phone", "Contact phone", { type: "tel" })}
          {text("email", "Contact email", { type: "email" })}
          {text("serviceArea", "Service description", { hint: "(shown in header and footer)" })}
          {text("footerDescription", "Footer description", { long: true })}
          {text("privacyPolicyUrl", "Privacy policy URL", { hint: "(leave blank to hide the link)" })}
        </Card>

        <Card className="space-y-5 p-5 sm:p-6">
          <h2 className="font-semibold">Branding</h2>
          <LocalImageField
            label="Logo"
            hint="(use the original BBA logo file)"
            value={s.logoUrl}
            folder="misc"
            aspect="aspect-square"
            onChange={(url) => setS({ ...s, logoUrl: url || "/brand/bba-logo.png" })}
          />
          <LocalImageField
            label="Favicon"
            hint="(optional, square PNG; defaults to the logo)"
            value={s.faviconUrl}
            folder="misc"
            aspect="aspect-square"
            onChange={(url) => setS({ ...s, faviconUrl: url })}
          />
        </Card>

        <Card className="space-y-4 p-5 sm:p-6">
          <h2 className="font-semibold">Search engine (SEO)</h2>
          {text("seoTitle", "Default SEO title", { hint: `(${s.seoTitle.length}/60 recommended)` })}
          {text("seoDescription", "Default meta description", { long: true, hint: `(${s.seoDescription.length}/160 recommended)` })}
          <LocalImageField
            label="Social sharing image"
            hint="(1200×630 recommended)"
            value={s.ogImageUrl}
            folder="misc"
            onChange={(url) => setS({ ...s, ogImageUrl: url })}
          />
        </Card>

        <Card className="space-y-4 p-5 sm:p-6">
          <h2 className="font-semibold">Social links</h2>
          <p className="text-sm text-stone-600">Only add accounts that exist. Empty links are hidden.</p>
          {(["facebook", "instagram", "linkedin"] as const).map((k) => (
            <div key={k}>
              <Label htmlFor={`social-${k}`}>{k[0].toUpperCase() + k.slice(1)}</Label>
              <Input
                id={`social-${k}`}
                type="url"
                placeholder="https://"
                value={s.social[k]}
                onChange={(e) => setS({ ...s, social: { ...s.social, [k]: e.target.value } })}
              />
            </div>
          ))}
        </Card>
      </div>
    </form>
  );
}
