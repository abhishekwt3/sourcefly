"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/lib/theme";

export default function BuyerOnboarding({ initial }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    brand: initial?.brand || "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Could not save");
      router.replace("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const Field = ({ label, k, ph, type = "text" }) => (
    <div>
      <label className="text-xs font-medium block mb-1" style={{ color: COLORS.text2 }}>
        {label}
      </label>
      <input
        type={type}
        value={form[k]}
        onChange={set(k)}
        placeholder={ph}
        className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          color: COLORS.text,
        }}
      />
    </div>
  );

  return (
    <div className="px-5 pt-14 pb-8">
      <h1 className="pf text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
        Tell us about yourself
      </h1>
      <p className="text-sm mb-8" style={{ color: COLORS.muted }}>
        Suppliers will see your name and brand on WhatsApp introductions.
      </p>

      <div className="space-y-4">
        <Field label="Your name *" k="name" ph="Rajni Ohri" />
        <Field label="Brand (optional)" k="brand" ph="Ohria Ayurveda" />
        <Field label="Email (optional)" k="email" ph="you@brand.com" type="email" />
      </div>

      {error && (
        <p className="text-xs mt-3" style={{ color: "#C0392B" }}>
          {error}
        </p>
      )}

      <button
        onClick={submit}
        disabled={busy || !form.name.trim()}
        className="w-full mt-8 py-3.5 rounded-xl font-semibold text-sm"
        style={{
          background: form.name.trim() ? COLORS.amber : COLORS.surface2,
          color: form.name.trim() ? COLORS.onAccent : COLORS.muted,
        }}
      >
        {busy ? "Saving…" : "Continue"}
      </button>
    </div>
  );
}
