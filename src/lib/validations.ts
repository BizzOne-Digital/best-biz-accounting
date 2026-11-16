import { z } from "zod";

export const SERVICE_OPTIONS = [
  "Accounts Payable",
  "Accounts Receivable",
  "Bank Reconciliations",
  "Inventory Tracking",
  "Payroll",
  "GST Filing",
  "General Inquiry",
] as const;

const phoneRegex = /^[0-9+().\-\s]{7,25}$/;

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  businessName: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .max(25)
    .optional()
    .default("")
    .refine((v) => !v || phoneRegex.test(v), "Please enter a valid phone number"),
  service: z.enum(SERVICE_OPTIONS, { message: "Please choose a service" }),
  message: z.string().trim().min(10, "Please tell us a little more (10+ characters)").max(5000),
  // Spam protection fields
  website: z.string().max(0, "Invalid submission").optional().default(""),
  startedAt: z.number().optional(),
});
export type ContactInput = z.input<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(200),
  password: z.string().min(1, "Enter your password").max(200),
});

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "Must be an https:// URL or a site path")
  .optional()
  .default("");

export const settingsSchema = z.object({
  siteName: z.string().trim().min(2).max(120),
  ownerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid phone number"),
  email: z.string().trim().email().max(200),
  serviceArea: z.string().trim().max(120),
  logoUrl: optionalUrl,
  faviconUrl: optionalUrl,
  footerDescription: z.string().trim().max(600),
  seoTitle: z.string().trim().min(10).max(120),
  seoDescription: z.string().trim().min(30).max(320),
  ogImageUrl: optionalUrl,
  privacyPolicyUrl: optionalUrl,
  social: z.object({ facebook: optionalUrl, instagram: optionalUrl, linkedin: optionalUrl }),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens")
    .max(140)
    .optional(),
  shortTitle: z.string().trim().max(60).optional().default(""),
  summary: z.string().trim().max(400).optional().default(""),
  description: z.string().trim().max(2000).optional().default(""),
  bullets: z.array(z.string().trim().min(1).max(200)).max(12).default([]),
  icon: z.string().trim().max(40).default("file-text"),
  imageUrl: optionalUrl,
  published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  businessName: z.string().trim().max(160).optional().default(""),
  content: z.string().trim().min(10).max(2000),
  rating: z.number().int().min(1).max(5).nullable().optional().default(null),
  date: z.string().trim().nullable().optional().default(null),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const reorderSchema = z.object({ ids: z.array(z.string().regex(/^[a-f0-9]{24}$/)).max(200) });

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(12, "Use at least 12 characters")
      .max(200)
      .regex(/[A-Za-z]/, "Include a letter")
      .regex(/\d/, "Include a number"),
  })
  .refine((v) => v.currentPassword !== v.newPassword, { message: "New password must be different", path: ["newPassword"] });

export const objectId = z.string().regex(/^[a-f0-9]{24}$/);
