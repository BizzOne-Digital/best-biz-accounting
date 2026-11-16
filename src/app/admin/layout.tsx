import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin | Best Biz Accounting" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-stone-100 font-sans text-stone-900">
      {children}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
