import { adminRoute, ok } from "@/lib/admin-api";
import { toPlain } from "@/lib/db";
import { ContactInquiry } from "@/models";


const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const GET = adminRoute(async (req) => {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
  const status = url.searchParams.get("status");
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = 25;

  const filter: Record<string, unknown> = {};
  if (status === "new" || status === "read" || status === "responded") filter.status = status;
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ fullName: rx }, { email: rx }, { businessName: rx }, { message: rx }, { service: rx }];
  }

  const [items, total] = await Promise.all([
    ContactInquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-fingerprint -ipHash")
      .lean(),
    ContactInquiry.countDocuments(filter),
  ]);
  return ok({ inquiries: toPlain(items), total, page, pages: Math.max(1, Math.ceil(total / limit)) });
});
