import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CRITERIA_KEYS } from "@/lib/recommendation-criteria";

export const runtime = "nodejs";

export async function GET(_req, context) {
  const { id } = await context.params;

  const [supplier, recs, me] = await Promise.all([
    prisma.supplier.findUnique({ where: { id } }),
    prisma.recommendation.findMany({
      where: { supplierId: id },
      orderBy: { createdAt: "desc" },
      include: { buyer: { select: { name: true, brand: true } } },
    }),
    getCurrentUser(),
  ]);

  if (!supplier) return NextResponse.json({ error: "not found" }, { status: 404 });

  const tally = Object.fromEntries(CRITERIA_KEYS.map((k) => [k, 0]));
  for (const r of recs) {
    for (const c of r.criteria) tally[c] = (tally[c] || 0) + 1;
  }

  const ordered = CRITERIA_KEYS
    .map((k) => ({ key: k, count: tally[k] || 0 }))
    .sort((a, b) => b.count - a.count);

  const myRec = me ? recs.find((r) => r.buyerId === me.id) : null;

  return NextResponse.json({
    supplierId: id,
    count: supplier.recommendCount,
    ordersShipped: supplier.ordersShipped ?? null,
    criteria: ordered,
    notes: recs
      .filter((r) => r.note)
      .map((r) => ({
        id: r.id,
        text: r.note,
        author: r.buyer?.name || "Anonymous",
        brand: r.buyer?.brand || null,
        createdAt: r.createdAt,
        criteria: r.criteria,
      })),
    mine: myRec ? { criteria: myRec.criteria, note: myRec.note || "" } : null,
    viewer: me ? { id: me.id, role: me.role } : null,
  });
}
