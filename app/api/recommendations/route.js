import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CRITERIA_KEYS } from "@/lib/recommendation-criteria";

export const runtime = "nodejs";

function sanitize(body) {
  const supplierId = typeof body?.supplierId === "string" ? body.supplierId : null;
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 500) : "";
  const criteria = Array.isArray(body?.criteria)
    ? body.criteria.filter((c) => CRITERIA_KEYS.includes(c))
    : [];
  return { supplierId, note, criteria };
}

export async function POST(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (me.role !== "BUYER") return NextResponse.json({ error: "buyers only" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { supplierId, note, criteria } = sanitize(body);
  if (!supplierId) return NextResponse.json({ error: "supplierId required" }, { status: 400 });
  if (criteria.length === 0)
    return NextResponse.json({ error: "Pick at least one criterion" }, { status: 400 });

  const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
  if (!supplier) return NextResponse.json({ error: "supplier not found" }, { status: 404 });

  const existing = await prisma.recommendation.findUnique({
    where: { supplierId_buyerId: { supplierId, buyerId: me.id } },
  });

  const result = await prisma.$transaction(async (tx) => {
    const rec = await tx.recommendation.upsert({
      where: { supplierId_buyerId: { supplierId, buyerId: me.id } },
      create: { supplierId, buyerId: me.id, criteria, note: note || null },
      update: { criteria, note: note || null },
    });
    if (!existing) {
      await tx.supplier.update({
        where: { id: supplierId },
        data: { recommendCount: { increment: 1 } },
      });
    }
    return rec;
  });

  return NextResponse.json({ ok: true, recommendation: result, created: !existing });
}

export async function DELETE(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (me.role !== "BUYER") return NextResponse.json({ error: "buyers only" }, { status: 403 });

  const url = new URL(req.url);
  const supplierId = url.searchParams.get("supplierId");
  if (!supplierId) return NextResponse.json({ error: "supplierId required" }, { status: 400 });

  const existing = await prisma.recommendation.findUnique({
    where: { supplierId_buyerId: { supplierId, buyerId: me.id } },
  });
  if (!existing) return NextResponse.json({ ok: true });

  await prisma.$transaction([
    prisma.recommendation.delete({ where: { id: existing.id } }),
    prisma.supplier.update({
      where: { id: supplierId },
      data: { recommendCount: { decrement: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
