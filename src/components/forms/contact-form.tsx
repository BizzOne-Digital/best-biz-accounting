"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { contactSchema, SERVICE_OPTIONS, type ContactInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const field =
  "mt-1.5 block w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-[0.95rem] text-brand-text shadow-sm transition-colors placeholder:text-brand-muted/60 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 focus:outline-none aria-[invalid=true]:border-red-500";

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-brand-dark">
        {label} {required ? <span className="text-brand-orange">*</span> : <span className="font-normal text-brand-muted">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ successMessage }: { successMessage: string }) {
  const [startedAt, setStartedAt] = useState(0);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullName: "", businessName: "", email: "", phone: "", message: "", website: "" },
  });

  const onFocus = () => {
    if (!startedAt) setStartedAt(Date.now());
  };

  const onSubmit = async (values: ContactInput) => {
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt: startedAt || undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || "Something went wrong. Please try again.");
      setStatus({ type: "success", message: successMessage });
      reset();
      setStartedAt(0);
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  const err = (k: keyof ContactInput) => errors[k]?.message as string | undefined;
  const aria = (k: keyof ContactInput) => ({
    "aria-invalid": Boolean(errors[k]),
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={onFocus} noValidate className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="Full Name" required error={err("fullName")}>
          <input id="fullName" autoComplete="name" className={field} {...aria("fullName")} {...register("fullName")} />
        </Field>
        <Field id="businessName" label="Business Name" error={err("businessName")}>
          <input id="businessName" autoComplete="organization" className={field} {...register("businessName")} />
        </Field>
        <Field id="email" label="Email Address" required error={err("email")}>
          <input id="email" type="email" autoComplete="email" className={field} {...aria("email")} {...register("email")} />
        </Field>
        <Field id="phone" label="Phone Number" error={err("phone")}>
          <input id="phone" type="tel" autoComplete="tel" className={field} {...aria("phone")} {...register("phone")} />
        </Field>
      </div>
      <Field id="service" label="Service Interested In" required error={err("service")}>
        <select id="service" defaultValue="" className={cn(field, "appearance-none")} {...aria("service")} {...register("service")}>
          <option value="" disabled>
            Select a service
          </option>
          {SERVICE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>
      <Field id="message" label="Message" required error={err("message")}>
        <textarea
          id="message"
          rows={5}
          className={cn(field, "resize-y")}
          placeholder="Tell us a little about your business and what you need help with."
          {...aria("message")}
          {...register("message")}
        />
      </Field>

      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div aria-live="polite">
        {status && (
          <div
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 text-sm",
              status.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-700",
            )}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            )}
            <p>{status.message}</p>
          </div>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" /> Sending...
          </>
        ) : (
          <>
            <Send aria-hidden="true" /> Send Message
          </>
        )}
      </Button>
      <p className="text-xs text-brand-muted">
        Your information is used only to respond to your inquiry.
      </p>
    </form>
  );
}
