import { getApprovedSuppliers } from "@/lib/suppliers";
import AppShell from "@/components/AppShell";

// Listings change when admin approves new suppliers — opt out of static
// caching so the buyer always sees the current directory.
export const dynamic = "force-dynamic";

export default async function Home() {
  const suppliers = await getApprovedSuppliers();
  return <AppShell suppliers={suppliers} />;
}
