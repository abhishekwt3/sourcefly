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

  const phone = decoded.phone_number || null;
  const email = decoded.email || null;
  const name = decoded.name || null;
  if (!phone && !email) {
    return NextResponse.json({ error: "phone or email required" }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
  if (!user && phone) {
    user = await prisma.user.findUnique({ where: { phone } });
  }
  if (!user && email) {
    user = await prisma.user.findFirst({ where: { email } });
  }

  if (user) {
    // Relink or fill in any newly-known identifiers
    const patch = {};
    if (user.firebaseUid !== decoded.uid) patch.firebaseUid = decoded.uid;
    if (!user.phone && phone) patch.phone = phone;
    if (!user.email && email) patch.email = email;
    if (!user.name && name) patch.name = name;
    if (Object.keys(patch).length > 0) {
      user = await prisma.user.update({ where: { id: user.id }, data: patch });
    }
  } else {
    user = await prisma.user.create({
      data: { phone, email, name, firebaseUid: decoded.uid },
    });
  }

  await setSessionCookie({ userId: user.id, role: user.role });

  return NextResponse.json({
    ok: true,
    user: { id: user.id, role: user.role, phone: user.phone, name: user.name },
    next: user.role ? "/" : "/onboarding/role",
  });
}
