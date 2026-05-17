import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Multi-step seller onboarding has been retired. New and returning sellers
// land directly on the 3-tab Profile/Catalog/Photos editor.
export default async function SellerStepPage() {
  redirect("/seller/manage");
}
