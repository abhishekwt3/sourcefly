import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function PATCH(req, context) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));
  const status = body?.status;

  if (status !== "APPROVED" && status !== "REJECTED") {
    return NextResponse.json({ error: "status must be APPROVED or REJECTED" }, { status: 400 });
  }

  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) return NextResponse.json({ error: "not found" }, { status: 404 });

  const updated = await prisma.supplier.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, status: updated.status });
}
