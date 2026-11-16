import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Website Settings" };

export default function Page() {
  return <SettingsForm />;
}
