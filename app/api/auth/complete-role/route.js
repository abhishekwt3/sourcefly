import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (me.role) return NextResponse.json({ error: "role already set" }, { status: 400 });

  const body = await req.json().catch(() => null);
  const role = body?.role;
  if (role !== "BUYER" && role !== "SELLER") {
    return NextResponse.json({ error: "invalid role" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: me.id },
    data: { role },
  });

  await setSessionCookie({ userId: updated.id, role: updated.role });

  return NextResponse.json({
    ok: true,
    next: role === "BUYER" ? "/onboarding/buyer" : "/seller/manage",
  });
}
