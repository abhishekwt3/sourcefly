import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import RoleSelector from "@/components/onboarding/RoleSelector";

export const dynamic = "force-dynamic";

export default async function RolePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/auth/phone?next=/onboarding/role");
  if (me.role === "BUYER") redirect("/onboarding/buyer");
  if (me.role === "SELLER") redirect("/seller/manage");
  return <RoleSelector />;
}
