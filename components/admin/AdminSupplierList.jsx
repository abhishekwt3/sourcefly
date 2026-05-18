"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUS_COLOR = {
  PENDING:  { bg: "#FFF8E1", color: "#B8893A", dot: "#F59E0B" },
  APPROVED: { bg: "#ECFDF5", color: "#166534", dot: "#22C55E" },
  REJECTED: { bg: "#FEF2F2", color: "#991B1B", dot: "#EF4444" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR.PENDING;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function SupplierRow({ supplier, onAction }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(supplier.status);

  const action = (status) => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/suppliers/${supplier.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLocalStatus(status);
        onAction?.();
      }
    });
  };

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E8E4", overflow: "hidden", marginBottom: 12 }}>
      {/* Header row */}
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", userSelect: "none" }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: supplier.accent || "#B8893A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 14, flexShrink: 0 }}>
          {supplier.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{supplier.name}</span>
            <StatusBadge status={localStatus} />
          </div>
          <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>
            {supplier.category} · {supplier.location} · submitted {new Date(supplier.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <span style={{ color: "#aaa", fontSize: 18 }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ borderTop: "1px solid #F0F0EC", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
            <Detail label="Handle" value={supplier.handle} />
            <Detail label="WhatsApp" value={supplier.whatsapp ? `+${supplier.whatsapp}` : "—"} />
            <Detail label="MOQ" value={supplier.moq ? `${supplier.moq} units` : "—"} />
            <Detail label="Lead time" value={supplier.lead || "—"} />
            <Detail label="Submitted by" value={supplier.owner?.name || supplier.owner?.phone || supplier.submittedBy || "—"} />
            <Detail label="Contact email" value={supplier.owner?.email || "—"} />
          </div>

          {supplier.tagline && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 2 }}>TAGLINE</p>
              <p style={{ fontSize: 13 }}>{supplier.tagline}</p>
            </div>
          )}

          {supplier.about && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 2 }}>ABOUT</p>
              <p style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>{supplier.about}</p>
            </div>
          )}

          {supplier.offerings?.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 6 }}>OFFERINGS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {supplier.offerings.map((o) => (
                  <div key={o.id} style={{ fontSize: 13, display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "#F8F8F6", borderRadius: 8 }}>
                    <span>{o.name}</span>
                    <span style={{ color: "#888" }}>MOQ {o.moq} · {o.lead}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {supplier.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {supplier.tags.map((t) => (
                <span key={t} style={{ fontSize: 11, padding: "3px 8px", background: "#F0F0EC", borderRadius: 999, color: "#555" }}>{t}</span>
              ))}
            </div>
          )}

          {supplier.photos?.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 6 }}>PHOTOS</p>
              <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                {supplier.photos.map((url, i) => (
                  <img key={i} src={url} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {localStatus === "PENDING" && (
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={() => action("APPROVED")}
                disabled={pending}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: "#166534", color: "#fff", fontWeight: 600, fontSize: 13, border: "none", cursor: pending ? "wait" : "pointer" }}
              >
                {pending ? "Saving…" : "✓ Approve"}
              </button>
              <button
                onClick={() => action("REJECTED")}
                disabled={pending}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: "#FEF2F2", color: "#991B1B", fontWeight: 600, fontSize: 13, border: "1px solid #FECACA", cursor: pending ? "wait" : "pointer" }}
              >
                {pending ? "Saving…" : "✕ Reject"}
              </button>
            </div>
          )}
          {localStatus === "APPROVED" && (
            <button
              onClick={() => action("REJECTED")}
              disabled={pending}
              style={{ padding: "8px 16px", borderRadius: 10, background: "#FEF2F2", color: "#991B1B", fontWeight: 600, fontSize: 12, border: "1px solid #FECACA", cursor: "pointer", alignSelf: "flex-start" }}
            >
              Revoke approval
            </button>
          )}
          {localStatus === "REJECTED" && (
            <button
              onClick={() => action("APPROVED")}
              disabled={pending}
              style={{ padding: "8px 16px", borderRadius: 10, background: "#ECFDF5", color: "#166534", fontWeight: 600, fontSize: 12, border: "1px solid #86EFAC", cursor: "pointer", alignSelf: "flex-start" }}
            >
              Approve anyway
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#888", margin: "0 0 2px" }}>{label.toUpperCase()}</p>
      <p style={{ fontSize: 13, margin: 0 }}>{value}</p>
    </div>
  );
}

export default function AdminSupplierList({ suppliers, filter, tally }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setFilter = (f) => {
    startTransition(() => router.push(`/admin/suppliers?status=${f}`));
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const tabs = [
    { key: "PENDING",  label: `Pending (${tally.PENDING})` },
    { key: "APPROVED", label: `Approved (${tally.APPROVED})` },
    { key: "REJECTED", label: `Rejected (${tally.REJECTED})` },
    { key: "ALL",      label: "All" },
  ];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#B8893A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>K</div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Kendra Admin</span>
        </div>
        <button onClick={logout} style={{ fontSize: 13, color: "#888", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Logout
        </button>
      </div>

      {/* Top-level nav */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <button
          onClick={() => router.push("/admin/suppliers")}
          style={{ padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: "#B8893A", color: "#fff" }}
        >
          Suppliers
        </button>
        <button
          onClick={() => router.push("/admin/requirements")}
          style={{ padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: "#E8E8E4", color: "#555" }}
        >
          Requirements
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            style={{
              padding: "7px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: filter === t.key ? "#B8893A" : "#E8E8E4",
              color: filter === t.key ? "#fff" : "#555",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {suppliers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa", fontSize: 14 }}>
          No {filter.toLowerCase()} submissions
        </div>
      ) : (
        suppliers.map((s) => (
          <SupplierRow
            key={s.id}
            supplier={s}
            onAction={() => router.refresh()}
          />
        ))
      )}
    </div>
  );
}
