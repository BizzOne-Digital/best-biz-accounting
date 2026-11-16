import { clearSessionCookie, isSameOrigin } from "@/lib/auth";


export async function POST(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ success: false, error: "Invalid origin" }, { status: 403 });
  await clearSessionCookie();
  return Response.json({ success: true });
}
