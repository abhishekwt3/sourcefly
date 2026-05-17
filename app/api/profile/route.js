import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : undefined;
  const email = typeof body.email === "string" ? body.email.trim() : undefined;
  const brand = typeof body.brand === "string" ? body.brand.trim() : undefined;

  const updated = await prisma.user.update({
    where: { id: me.id },
    data: {
      ...(name !== undefined ? { name: name || null } : {}),
      ...(email !== undefined ? { email: email || null } : {}),
      ...(brand !== undefined ? { brand: brand || null } : {}),
    },
  });

  return NextResponse.json({
    ok: true,
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      brand: updated.brand,
      role: updated.role,
    },
  });
}
