import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { LoadingBlock } from "@/components/admin/ui";

// Authenticated area: navigations may wait on the session check.
export const instant = false;

async function AdminGuard({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin().catch(() => null);
  if (!admin) redirect("/admin/login");
  return <AdminShell admin={admin}>{children}</AdminShell>;
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <AdminGuard>{children}</AdminGuard>
    </Suspense>
  );
}
