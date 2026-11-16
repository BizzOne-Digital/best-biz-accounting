import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models";

export const SESSION_COOKIE = "bba_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

type SessionPayload = { uid: string; v: number; exp: number };

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (at least 32 characters)");
  return s;
}

function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createSessionToken(uid: string, version: number) {
  const payload: SessionPayload = { uid, v: version, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (!payload.uid || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(uid: string, version: number) {
  (await cookies()).set(SESSION_COOKIE, createSessionToken(uid, version), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export type AdminSession = { id: string; email: string; name: string };

/** Returns the signed-in admin, or null. Verifies signature, expiry, and session version. */
export async function getAdmin(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  await connectDB();
  const user = await AdminUser.findById(payload.uid).select("email name sessionVersion").lean();
  if (!user || user.sessionVersion !== payload.v) return null;
  return { id: String(user._id), email: user.email, name: user.name };
}

export function unauthorized() {
  return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

/** Same-origin check for cookie-authenticated mutations (CSRF defence in depth). */
export function isSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
