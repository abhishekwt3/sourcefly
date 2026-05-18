import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const name = String(body.name || "").trim();
  const description = String(body.need || body.description || "").trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  if (!description) return NextResponse.json({ error: "description required" }, { status: 400 });

  const requirement = await prisma.buyerRequirement.create({
    data: {
      name,
      description,
      brand: body.brand?.trim() || null,
      category: body.cat?.trim() || body.category?.trim() || null,
      moq: body.moq?.trim() || null,
      timeline: body.timeline?.trim() || null,
      email: me.email || null,
    },
  });

  return NextResponse.json({ ok: true, id: requirement.id });
}
