import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ user: null });

  let supplierStatus = null;
  if (me.role === "SELLER") {
    const supplier = await prisma.supplier.findUnique({
      where: { ownerId: me.id },
      select: { status: true },
    });
    supplierStatus = supplier?.status ?? null;
  }

  return NextResponse.json({
    user: {
      id: me.id,
      phone: me.phone,
      role: me.role,
      name: me.name,
      email: me.email,
      brand: me.brand,
      supplierStatus,
    },
  });
}
