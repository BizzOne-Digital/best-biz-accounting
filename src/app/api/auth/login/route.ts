import bcrypt from "bcryptjs";
import { connectDB, isDbConfigured } from "@/lib/db";
import { isSameOrigin, setSessionCookie } from "@/lib/auth";
import { clientIpHash, rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations";
import { AdminUser } from "@/models";


const fail = (error: string, status = 400) => Response.json({ success: false, error }, { status });
// Used when the email doesn't exist so response timing doesn't reveal valid accounts.
let dummyHash: string | null = null;
const getDummyHash = () => (dummyHash ??= bcrypt.hashSync("not-a-real-password", 12));
const MAX_FAILS = 5;
const LOCK_MINUTES = 15;

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return fail("Invalid origin", 403);
  if (!isDbConfigured()) return fail("Database is not configured", 503);

  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("Enter a valid email and password", 422);
  const { email, password } = parsed.data;

  try {
    await connectDB();
    const ip = clientIpHash(req);
    const limit = await rateLimit(`login:${ip}`, 10, 15 * 60);
    if (!limit.allowed) return fail("Too many login attempts. Please wait 15 minutes and try again.", 429);

    const user = await AdminUser.findOne({ email: email.toLowerCase() });
    if (user?.lockUntil && user.lockUntil > new Date()) {
      return fail("This account is temporarily locked. Please try again later.", 423);
    }

    const valid = await bcrypt.compare(password, user?.passwordHash ?? getDummyHash());
    if (!user || !valid) {
      if (user) {
        user.failedLogins = (user.failedLogins ?? 0) + 1;
        if (user.failedLogins >= MAX_FAILS) {
          user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
          user.failedLogins = 0;
        }
        await user.save();
      }
      return fail("Incorrect email or password", 401);
    }

    user.failedLogins = 0;
    user.lockUntil = null;
    user.lastLoginAt = new Date();
    await user.save();
    await setSessionCookie(String(user._id), user.sessionVersion ?? 1);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[login]", err);
    return fail("Login failed. Please try again.", 500);
  }
}
