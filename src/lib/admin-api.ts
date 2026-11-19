import "server-only";
import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import { getAdmin, isSameOrigin, unauthorized, type AdminSession } from "@/lib/auth";
import { Service } from "@/models";
import { slugify } from "@/lib/utils";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const ok = (data: Record<string, unknown> = {}) => Response.json({ success: true, ...data });
export const fail = (error: string, status = 400) => Response.json({ success: false, error }, { status });

type Ctx<P> = { params: Promise<P> };

/** Wraps an admin route: same-origin check for mutations, session check, DB connect, error mapping. */
export function adminRoute<P = Record<string, never>>(
  handler: (req: Request, admin: AdminSession, params: P) => Promise<Response>,
) {
  return async (req: Request, ctx: Ctx<P>) => {
    if (req.method !== "GET" && !isSameOrigin(req)) return fail("Invalid origin", 403);
    // Always render at request time; admin data must never be prerendered.
    await connection();
    try {
      const admin = await getAdmin();
      if (!admin) return unauthorized();
      await connectDB();
      return await handler(req, admin, (await ctx?.params) ?? ({} as P));
    } catch (err) {
      if (err instanceof HttpError) return fail(err.message, err.status);
      if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
        return fail("That value is already in use", 409);
      }
      console.error("[admin-api]", err);
      return fail("Server error", 500);
    }
  };
}

export async function readJson(req: Request) {
  try {
    return await req.json();
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

export async function uniqueServiceSlug(base: string, excludeId?: string) {
  const root = slugify(base) || "service";
  let slug = root;
  for (let i = 2; await Service.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }); i++) {
    slug = `${root}-${i}`;
  }
  return slug;
}
