import { prisma } from "@/lib/db";
import AdminRequirementsList from "@/components/admin/AdminRequirementsList";

export const dynamic = "force-dynamic";

export default async function AdminRequirementsPage() {
  const requirements = await prisma.buyerRequirement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminRequirementsList requirements={requirements} />;
}
