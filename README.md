# Best Biz Accounting — Website & Admin Portal

Website for Best Biz Accounting (remote bookkeeping for small businesses), with a MongoDB-backed admin portal.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · MongoDB Atlas + Mongoose · Zod · React Hook Form · Lucide icons. Deploys to Vercel.

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill in MONGODB_URI and SESSION_SECRET
npm run create-admin -- --email angela@bestbizaccounting.ca --name "Angela Rotvik"
npm run dev                     # http://localhost:3000  ·  admin at /admin
```

`create-admin` prompts for the password (12+ characters, letters and numbers). Run it again to reset a password; doing so signs out existing sessions.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `SESSION_SECRET` | Yes | 32+ char secret that signs admin session cookies |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical URL for SEO, sitemap, social previews |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Optional | Email alerts for new inquiries |
| `SMTP_FROM` | Optional | Sender address (defaults to `SMTP_USER`) |
| `CONTACT_NOTIFICATION_EMAIL` | Optional | Recipient (defaults to angela@bestbizaccounting.ca) |

Without SMTP, inquiries are still saved and shown in **Admin → Contact Inquiries**, and the dashboard shows a warning. Each inquiry records whether its email was `sent`, `failed`, or `not_configured`. It is only marked `sent` when the mail server accepts it.

## Public pages

`/` Home · `/services` · `/about` · `/testimonials` · `/contact`. Also `sitemap.xml`, `robots.txt`, and JSON-LD `AccountingService` structured data.

Content rules this build follows:
- No prices, promotions, testimonials, addresses, certifications, or social accounts are invented.
- The consultation card replaces the unapproved "free GST / ROE / T4 / 50% off" offer from the mockup. If the owner approves an offer, edit it in **Admin → Pages → Home → Services Preview**.
- The homepage testimonials section stays hidden until at least one real testimonial is published.

## Admin portal (`/admin`)

| Section | What it does |
|---|---|
| Dashboard | Inquiry and testimonial counts, active services, recent activity, SMTP warning |
| Pages | Edit every heading, paragraph, button label, image, and list on all 5 pages; show or hide sections; reset to defaults |
| Services | Add, edit, delete, reorder, publish or unpublish; choose an icon; optional image |
| Testimonials | Add, edit, delete, reorder, publish or unpublish, mark as featured |
| Contact Inquiries | Search, filter by status, view details, mark new/read/responded, delete |
| Images & Media | Upload and browse images; images still in use can't be deleted |
| Website Settings | Name, phone, email, logo, favicon, footer text, SEO title and description, social image, social links |
| Account Settings | Change display name and password |

**Security:** HMAC-signed HttpOnly session cookie (8h) checked against a per-user session version; bcrypt password hashes; login rate limiting (10 per 15 min per IP, stored in MongoDB) plus a 15-minute lockout after 5 failed attempts; same-origin checks on mutations; Zod validation on every write; `proxy.ts` redirects signed-out visitors and sets `noindex` on admin pages.

## Image uploads (stored in MongoDB)

- `POST /api/upload` (admin only), multipart `file` + `folder` (`products|gallery|pages|misc`). Accepts PNG, JPEG, WEBP, or GIF up to 8MB. The file type is verified from the file's bytes, not just its declared type. Each file gets a unique name.
- `GET /api/uploads/[folder]/[filename]` serves the bytes with `Cache-Control: immutable`.
- When content is saved, images it no longer references are deleted, but only if nothing else still uses them.
- Nothing is written to local disk, so uploads persist across Vercel redeployments.

## Caching

Public pages are prerendered with `"use cache"` data functions tagged `settings`, `services`, `testimonials`, and `page:<key>`. Every admin save calls `revalidateTag(tag, { expire: 0 })`, so changes appear on the next visit. Admin data is never cached. If the database is unreachable, public pages render from the verified defaults in `src/content/defaults.ts`.

## Project structure

```
src/app/(site)/        Public pages + header/footer layout
src/app/admin/         Login + protected (panel) pages
src/app/api/           contact, auth, upload, uploads, admin/*
src/components/        layout, home, forms, testimonials, admin, ui
src/content/defaults.ts  Default content and services (verified facts only)
src/lib/               db, auth, cache, content, validations, uploads, mailer, rate-limit
src/models/index.ts    AdminUser, SiteSettings, PageContent, Service, Testimonial, ContactInquiry, StoredUpload, RateLimit
scripts/create-admin.ts
```

## Deploying to Vercel

1. Push to a Git repo and import it in Vercel.
2. Add the environment variables above in Project → Settings → Environment Variables.
3. In MongoDB Atlas → Network Access, allow Vercel connections (`0.0.0.0/0`, or use the Vercel Atlas integration).
4. Deploy, then run `npm run create-admin` locally against the production `MONGODB_URI`.

## Brand assets

- `public/brand/bba-logo.png` is a circular crop of the BBA logo taken from the approved design mockup. **Replace it with the original high-resolution logo file** (same filename, transparent PNG), or upload it in **Admin → Website Settings → Logo**. `src/app/icon.png` and `apple-icon.png` are the favicon versions of the same logo.
- Photos in `public/images/` are from Unsplash (free license) and are served through `next/image` (AVIF/WebP).
