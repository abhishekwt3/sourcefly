import { NextResponse } from "next/server";
import { firebaseAdminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const idToken = body?.idToken;
  if (!idToken) return NextResponse.json({ error: "missing idToken" }, { status: 400 });

  let decoded;
  try {
    decoded = await firebaseAdminAuth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const phone = decoded.phone_number;
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  let user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
  if (!user) {
    user = await prisma.user.findUnique({ where: { phone } });
    if (user) {
      // phone migrating to a new firebaseUid — relink
      user = await prisma.user.update({
        where: { id: user.id },
        data: { firebaseUid: decoded.uid },
      });
    } else {
      user = await prisma.user.create({
        data: { phone, firebaseUid: decoded.uid },
      });
    }
  }

  await setSessionCookie({ userId: user.id, role: user.role });

  return NextResponse.json({
    ok: true,
    user: { id: user.id, role: user.role, phone: user.phone, name: user.name },
    next: user.role ? "/" : "/onboarding/role",
  });
}
