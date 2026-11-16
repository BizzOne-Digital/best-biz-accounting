import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-brand-chocolate p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <Image src="/brand/bba-logo.png" alt="Best Biz Accounting logo" width={72} height={72} className="rounded-full" priority />
          <h1 className="mt-4 font-serif text-2xl font-bold text-brand-dark">Admin Portal</h1>
          <p className="mt-1 text-sm text-stone-600">Sign in to manage your website.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
