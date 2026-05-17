"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Invalid credentials");
      router.replace("/admin/suppliers");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F5F3" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 360, boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#B8893A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 16 }}>K</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>Kendra Admin</p>
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Supplier review dashboard</p>
          </div>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="admin@kendra.in"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0DC", fontSize: 14, boxSizing: "border-box", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0DC", fontSize: 14, boxSizing: "border-box", outline: "none" }}
            />
          </div>

          {error && <p style={{ color: "#C0392B", fontSize: 13, margin: 0 }}>{error}</p>}

          <button
            type="submit"
            disabled={busy}
            style={{ padding: "11px 0", borderRadius: 10, background: "#B8893A", color: "#fff", fontWeight: 600, fontSize: 14, border: "none", cursor: busy ? "wait" : "pointer" }}
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
