import { createHash } from "node:crypto";
import { connectDB, isDbConfigured } from "@/lib/db";
import { sendInquiryNotification } from "@/lib/mailer";
import { clientIpHash, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations";
import { ContactInquiry } from "@/models";


const fail = (error: string, status = 400) => Response.json({ success: false, error }, { status });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request.");
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Please check the form and try again.", 422);
  }
  const { website, startedAt, ...data } = parsed.data;

  // Spam checks: honeypot filled, or form completed implausibly fast. Respond as if OK.
  const tooFast = typeof startedAt === "number" && Date.now() - startedAt < 2500;
  if (website || tooFast) return Response.json({ success: true });

  if (!isDbConfigured()) return fail("The contact form is temporarily unavailable. Please call or email us.", 503);

  try {
    await connectDB();
    const ipHash = clientIpHash(req);

    const limit = await rateLimit(`contact:${ipHash}`, 5, 60 * 60);
    if (!limit.allowed) return fail("Too many messages sent. Please try again later or call us directly.", 429);

    // Duplicate protection: same email + message within 10 minutes
    const fingerprint = createHash("sha256").update(`${data.email.toLowerCase()}|${data.message}`).digest("hex");
    const duplicate = await ContactInquiry.exists({
      fingerprint,
      createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) },
    });
    if (duplicate) return Response.json({ success: true, duplicate: true });

    const inquiry = await ContactInquiry.create({ ...data, fingerprint, ipHash });
    const emailStatus = await sendInquiryNotification(data);
    await ContactInquiry.updateOne({ _id: inquiry._id }, { emailStatus });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[contact] failed", err);
    return fail("We couldn't send your message right now. Please try again or call us directly.", 500);
  }
}
