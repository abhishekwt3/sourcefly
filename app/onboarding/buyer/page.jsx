import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import BuyerOnboarding from "@/components/onboarding/BuyerOnboarding";

export const dynamic = "force-dynamic";

export default async function BuyerOnboardingPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/auth/phone?next=/onboarding/buyer");
  if (!me.role) redirect("/onboarding/role");
  if (me.role !== "BUYER") redirect("/");
  return <BuyerOnboarding initial={{ name: me.name, email: me.email, brand: me.brand }} />;
}
