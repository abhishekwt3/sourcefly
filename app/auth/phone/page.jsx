import PhoneAuthFlow from "@/components/auth/PhoneAuthFlow";

export const dynamic = "force-dynamic";

export default async function PhoneAuthPage({ searchParams }) {
  const params = await searchParams;
  const next = (typeof params?.next === "string" && params.next) || "/";
  return <PhoneAuthFlow next={next} />;
}
