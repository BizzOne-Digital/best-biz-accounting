"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminButton, api, Card, Input, Label, PageTitle } from "./ui";
import { useAdmin } from "./admin-shell";

export function AccountForm() {
  const admin = useAdmin();
  const email = admin.email;
  const [name, setName] = useState(admin.name);
  const [savingName, setSavingName] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    try {
      await api("/api/admin/account", { method: "PATCH", json: { name } });
      toast.success("Name updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingName(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) return toast.error("New passwords do not match");
    setSavingPw(true);
    try {
      await api("/api/admin/account", {
        method: "PUT",
        json: { currentPassword: pw.currentPassword, newPassword: pw.newPassword },
      });
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      toast.success("Password changed. Other sessions have been signed out.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <>
      <PageTitle title="Account Settings" description={`Signed in as ${email}`} />
      <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <form onSubmit={saveName} className="space-y-4">
            <h2 className="font-semibold">Profile</h2>
            <div>
              <Label htmlFor="name">Display name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <AdminButton type="submit" loading={savingName}>
              Save name
            </AdminButton>
          </form>
        </Card>
        <Card className="p-5 sm:p-6">
          <form onSubmit={savePassword} className="space-y-4">
            <h2 className="font-semibold">Change password</h2>
            <div>
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="new" hint="(12+ characters, letters and numbers)">
                New password
              </Label>
              <Input id="new" type="password" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input id="confirm" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            </div>
            <AdminButton type="submit" loading={savingPw} disabled={!pw.currentPassword || !pw.newPassword}>
              Update password
            </AdminButton>
          </form>
        </Card>
      </div>
    </>
  );
}
