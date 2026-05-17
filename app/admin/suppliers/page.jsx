import { prisma } from "@/lib/db";
import AdminSupplierList from "@/components/admin/AdminSupplierList";

export const dynamic = "force-dynamic";

export default async function AdminSuppliersPage({ searchParams }) {
  const params = await searchParams;
  const filter = params?.status || "PENDING";

  const suppliers = await prisma.supplier.findMany({
    where: filter === "ALL" ? {} : { status: filter },
    orderBy: { createdAt: "desc" },
    include: {
      offerings: { orderBy: { position: "asc" } },
      owner: { select: { phone: true, name: true, email: true } },
    },
  });

  const counts = await prisma.supplier.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const tally = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
  for (const c of counts) tally[c.status] = c._count._all;

  return <AdminSupplierList suppliers={suppliers} filter={filter} tally={tally} />;
}
