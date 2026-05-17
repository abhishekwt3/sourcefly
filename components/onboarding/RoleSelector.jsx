"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/lib/theme";

export default function RoleSelector() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const choose = async (role) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/complete-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not save");
      router.replace(data.next);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const Card = ({ title, blurb, role }) => (
    <button
      onClick={() => choose(role)}
      disabled={busy}
      className="w-full text-left rounded-2xl p-5 active:scale-[0.98] transition-transform"
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        cursor: busy ? "wait" : "pointer",
      }}
    >
      <p className="pf font-bold text-lg mb-1" style={{ color: COLORS.text }}>
        {title}
      </p>
      <p className="text-sm" style={{ color: COLORS.muted }}>
        {blurb}
      </p>
    </button>
  );

  return (
    <div className="px-5 pt-14 pb-8">
      <h1 className="pf text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
        Who are you here as?
      </h1>
      <p className="text-sm mb-8" style={{ color: COLORS.muted }}>
        We tune the app to your side of the table.
      </p>

      <div className="space-y-3">
        <Card
          role="BUYER"
          title="I'm sourcing"
          blurb="Find verified D2C suppliers for packaging, manufacturing and more."
        />
        <Card
          role="SELLER"
          title="I'm selling"
          blurb="List my business and reach D2C brand buyers directly on WhatsApp."
        />
      </div>

      {error && (
        <p className="text-xs mt-4" style={{ color: "#C0392B" }}>
          {error}
        </p>
      )}
    </div>
  );
}
