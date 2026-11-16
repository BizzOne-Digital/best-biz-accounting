import "server-only";
import { createHash } from "node:crypto";
import { RateLimit } from "@/models";

/** Fixed-window limiter stored in MongoDB so it holds across serverless instances. */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const now = new Date();
  const hit = await RateLimit.findOneAndUpdate(
    { key, expiresAt: { $gt: now } },
    { $inc: { count: 1 } },
    { new: true },
  ).lean();
  if (hit) return { allowed: hit.count <= limit, remaining: Math.max(0, limit - hit.count) };

  await RateLimit.findOneAndUpdate(
    { key },
    { $set: { count: 1, expiresAt: new Date(now.getTime() + windowSeconds * 1000) } },
    { upsert: true },
  );
  return { allowed: true, remaining: limit - 1 };
}

export function clientIpHash(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return createHash("sha256")
    .update(`${ip}:${process.env.SESSION_SECRET ?? ""}`)
    .digest("hex")
    .slice(0, 32);
}
