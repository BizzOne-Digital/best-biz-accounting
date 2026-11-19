import "server-only";
import mongoose, { Schema, type Model, type Types } from "mongoose";

// Explicit interfaces keep TypeScript fast; schema inference on many models is very expensive.
function model<T>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] ?? mongoose.model(name, schema)) as unknown as Model<T>;
}

type Base = { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };

export interface IAdminUser extends Base {
  email: string;
  name: string;
  passwordHash: string;
  sessionVersion: number;
  failedLogins: number;
  lockUntil: Date | null;
  lastLoginAt: Date | null;
}
export interface IService extends Base {
  title: string;
  slug: string;
  shortTitle?: string;
  summary?: string;
  description?: string;
  bullets: string[];
  icon: string;
  imageUrl: string;
  order: number;
  published: boolean;
}
export interface ITestimonial extends Base {
  clientName: string;
  businessName: string;
  content: string;
  rating: number | null;
  date: Date | null;
  published: boolean;
  featured: boolean;
  order: number;
}
export interface IContactInquiry extends Base {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: "new" | "read" | "responded";
  emailStatus: "sent" | "failed" | "not_configured";
  fingerprint?: string;
  ipHash?: string;
}
export interface IStoredUpload extends Base {
  folder: "products" | "gallery" | "pages" | "misc";
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
}
export interface IPageContent extends Base {
  page: string;
  content: unknown;
}
export interface ISiteSettings extends Base {
  key: string;
  [k: string]: unknown;
}
export interface IRateLimit {
  _id: Types.ObjectId;
  key: string;
  count: number;
  expiresAt: Date;
}

/* ---------------- AdminUser ---------------- */
const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 200 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    passwordHash: { type: String, required: true },
    sessionVersion: { type: Number, default: 1 },
    failedLogins: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);
export const AdminUser = model<IAdminUser>("AdminUser", AdminUserSchema);

/* ---------------- SiteSettings (singleton) ---------------- */
const SiteSettingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true },
    siteName: { type: String, maxlength: 120 },
    ownerName: { type: String, maxlength: 120 },
    phone: { type: String, maxlength: 40 },
    email: { type: String, maxlength: 200 },
    serviceArea: { type: String, maxlength: 120 },
    logoUrl: { type: String, maxlength: 500 },
    faviconUrl: { type: String, maxlength: 500 },
    footerDescription: { type: String, maxlength: 600 },
    seoTitle: { type: String, maxlength: 120 },
    seoDescription: { type: String, maxlength: 320 },
    ogImageUrl: { type: String, maxlength: 500 },
    privacyPolicyUrl: { type: String, maxlength: 500 },
    social: {
      facebook: { type: String, maxlength: 300 },
      instagram: { type: String, maxlength: 300 },
      linkedin: { type: String, maxlength: 300 },
    },
  },
  { timestamps: true },
);
export const SiteSettings = model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

/* ---------------- PageContent ---------------- */
const PageContentSchema = new Schema(
  {
    page: { type: String, required: true, unique: true, enum: ["home", "services", "about", "testimonials", "contact"] },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
);
export const PageContent = model<IPageContent>("PageContent", PageContentSchema);

/* ---------------- Service ---------------- */
const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 140 },
    shortTitle: { type: String, trim: true, maxlength: 60 },
    summary: { type: String, trim: true, maxlength: 400 },
    description: { type: String, trim: true, maxlength: 2000 },
    bullets: { type: [String], default: [] },
    icon: { type: String, default: "file-text", maxlength: 40 },
    imageUrl: { type: String, default: "", maxlength: 500 },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);
export const Service = model<IService>("Service", ServiceSchema);

/* ---------------- Testimonial ---------------- */
const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true, trim: true, maxlength: 120 },
    businessName: { type: String, trim: true, maxlength: 160, default: "" },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    rating: { type: Number, min: 1, max: 5, default: null },
    date: { type: Date, default: null },
    published: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);
export const Testimonial = model<ITestimonial>("Testimonial", TestimonialSchema);

/* ---------------- ContactInquiry ---------------- */
const ContactInquirySchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    businessName: { type: String, trim: true, maxlength: 160, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 40, default: "" },
    service: { type: String, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ["new", "read", "responded"], default: "new", index: true },
    emailStatus: { type: String, enum: ["sent", "failed", "not_configured"], default: "not_configured" },
    fingerprint: { type: String, index: true },
    ipHash: { type: String, index: true },
  },
  { timestamps: true },
);
ContactInquirySchema.index({ createdAt: -1 });
export const ContactInquiry = model<IContactInquiry>("ContactInquiry", ContactInquirySchema);

/* ---------------- StoredUpload ---------------- */
const StoredUploadSchema = new Schema(
  {
    folder: { type: String, required: true, enum: ["products", "gallery", "pages", "misc"] },
    filename: { type: String, required: true, maxlength: 200 },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);
StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });
export const StoredUpload = model<IStoredUpload>("StoredUpload", StoredUploadSchema);

/* ---------------- RateLimit (shared across serverless instances) ---------------- */
const RateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RateLimit = model<IRateLimit>("RateLimit", RateLimitSchema);

/* ---------------- SeedLog: which built-in defaults were already imported ---------------- */
export interface ISeedLog {
  _id: Types.ObjectId;
  key: string;
  createdAt: Date;
}
const SeedLogSchema = new Schema({ key: { type: String, required: true, unique: true } }, { timestamps: { createdAt: true, updatedAt: false } });
export const SeedLog = model<ISeedLog>("SeedLog", SeedLogSchema);
