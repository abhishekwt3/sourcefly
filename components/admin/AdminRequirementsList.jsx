"use client";

import { useRouter, usePathname } from "next/navigation";

function NavTab({ href, label, active }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      style={{
        padding: "7px 16px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        background: active ? "#B8893A" : "#E8E8E4",
        color: active ? "#fff" : "#555",
      }}
    >
      {label}
    </button>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#888", margin: "0 0 2px" }}>
        {label.toUpperCase()}
      </p>
      <p style={{ fontSize: 13, margin: 0, whiteSpace: "pre-wrap" }}>{value || "—"}</p>
    </div>
  );
}

export default function AdminRequirementsList({ requirements }) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#B8893A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>K</div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Kendra Admin</span>
        </div>
        <button onClick={logout} style={{ fontSize: 13, color: "#888", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Logout
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <NavTab href="/admin/suppliers" label="Suppliers" active={pathname.startsWith("/admin/suppliers")} />
        <NavTab href="/admin/requirements" label={`Requirements (${requirements.length})`} active={pathname.startsWith("/admin/requirements")} />
      </div>

      {requirements.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa", fontSize: 14 }}>
          No buyer requirements posted yet
        </div>
      ) : (
        requirements.map((r) => (
          <div
            key={r.id}
            style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E8E4", padding: "16px 18px", marginBottom: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
                  {r.name}
                  {r.brand && <span style={{ color: "#888", fontWeight: 400 }}> · {r.brand}</span>}
                </p>
                <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>
                  {r.category || "Uncategorized"} · posted {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 13, marginBottom: 12 }}>
              <Detail label="Target MOQ" value={r.moq} />
              <Detail label="Timeline" value={r.timeline} />
              <Detail label="Email" value={r.email} />
            </div>

            <Detail label="Need" value={r.description} />
          </div>
        ))
      )}
    </div>
  );
}
