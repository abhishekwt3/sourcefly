import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Approval flow removed. Anyone hitting /seller/pending is sent to the live editor.
export default async function SellerPendingPage() {
  redirect("/seller/manage");
}
