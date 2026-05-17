"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/theme";
import ProfilePageShell from "@/components/ProfilePageShell";

function Field({ label, value, onChange, placeholder, readOnly, type = "text" }) {
  return (
    <div>
      <label
        className="block text-xs font-medium uppercase tracking-wider mb-1.5"
        style={{ color: COLORS.muted }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
        style={{
          background: readOnly ? COLORS.surface2 : COLORS.surface,
          color: readOnly ? COLORS.muted : COLORS.text,
          border: `1px solid ${COLORS.border}`,
        }}
      />
    </div>
  );
}

export default function AccountSettingsPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState(null); // null | "saving" | "saved" | "error"

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        const u = d?.user;
        if (!u) return;
        setUser(u);
        setName(u.name ?? "");
        setEmail(u.email ?? "");
        setBrand(u.brand ?? "");
      })
      .catch(() => {});
  }, []);

  const handleChange = (setter) => (val) => {
    setter(val);
    setDirty(true);
    setStatus(null);
  };

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, brand }),
      });
      if (!res.ok) throw new Error();
      setDirty(false);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <ProfilePageShell title="Account Settings">
      <div className="space-y-4">
        <Field
          label="Name"
          value={name}
          onChange={handleChange(setName)}
          placeholder="Your name"
        />
        <Field
          label="Email"
          value={email}
          onChange={handleChange(setEmail)}
          placeholder="you@example.com"
          type="email"
        />
        <Field
          label="Brand / Company"
          value={brand}
          onChange={handleChange(setBrand)}
          placeholder="Your brand name"
        />
        <Field label="Phone" value={user?.phone ?? ""} readOnly />

        {status === "saved" && (
          <p className="text-sm text-center" style={{ color: COLORS.green }}>
            Changes saved.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-center" style={{ color: "#B91C1C" }}>
            Something went wrong. Try again.
          </p>
        )}

        <button
          type="button"
          onClick={save}
          disabled={!dirty || status === "saving"}
          className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition-opacity"
          style={{
            background: COLORS.amber,
            color: COLORS.onAccent,
            opacity: !dirty || status === "saving" ? 0.4 : 1,
          }}
        >
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
      </div>
    </ProfilePageShell>
  );
}
