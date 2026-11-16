import type { Metadata } from "next";
import { AccountForm } from "@/components/admin/account-form";

export const metadata: Metadata = { title: "Account Settings" };

export default function Page() {
  return <AccountForm />;
}
