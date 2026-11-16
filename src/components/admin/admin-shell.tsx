"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";
import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  Briefcase,
  UserCog,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", Icon: FileText },
  { href: "/admin/services", label: "Services", Icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/admin/inquiries", label: "Contact Inquiries", Icon: Inbox },
  { href: "/admin/media", label: "Images & Media", Icon: ImageIcon },
  { href: "/admin/settings", label: "Website Settings", Icon: Settings },
  { href: "/admin/account", label: "Account Settings", Icon: UserCog },
];

type AdminInfo = { name: string; email: string };
const AdminContext = createContext<AdminInfo>({ name: "Admin", email: "" });
export const useAdmin = () => useContext(AdminContext);

export function AdminShell({ admin, children }: { admin: AdminInfo; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-brand-chocolate text-white/80">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Image src="/brand/bba-logo.png" alt="" width={40} height={40} className="rounded-full" />
        <div>
          <p className="font-serif text-base font-bold text-white">Best Biz Accounting</p>
          <p className="text-xs text-white/60">Admin Portal</p>
        </div>
      </div>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV.map(({ href, label, Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-brand-orange text-white" : "hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="size-4.5" aria-hidden="true" /> {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="size-4.5" aria-hidden="true" /> View website
        </a>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4.5" aria-hidden="true" /> Logout
        </button>
        <p className="truncate px-3 pt-2 text-xs text-white/50" title={admin.email}>
          Signed in as {admin.name}
        </p>
      </div>
    </div>
  );

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-dvh lg:block">{sidebar}</aside>

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
        <p className="font-serif font-bold text-brand-dark">BBA Admin</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          className="rounded-lg p-2 hover:bg-stone-100"
        >
          <Menu className="size-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-72 shadow-xl">
            {sidebar}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close admin menu"
              className="absolute top-4 right-3 rounded-lg p-1.5 text-white/80 hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <AdminContext.Provider value={{ name: admin.name, email: admin.email }}>{children}</AdminContext.Provider>
      </main>
    </div>
  );
}
