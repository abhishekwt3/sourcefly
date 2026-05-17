"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/lib/theme";
import { labelFor } from "@/lib/recommendation-criteria";
import RecommendPopup from "./RecommendPopup";

const D = {
  ink: "#1A1714",
  ink2: "#3A342D",
  muted: "#75695B",
  starAmber: "#8B6A3A",
  tagGreen: "#3A5226",
  tagGreenBg: "#E8F0DE",
  cream: "#F6F3EC",
  line: "rgba(26,23,20,0.08)",
};

function StarRow({ size = 15 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={D.starAmber} stroke={D.starAmber} strokeWidth="1.4" strokeLinejoin="round"
        >
          <path d="M12 3l2.7 5.6L20 9.4l-4 3.9.9 5.5L12 16.2 7.1 18.8 8 13.3l-4-3.9 5.3-.8z" />
        </svg>
      ))}
    </span>
  );
}

function CriteriaChip({ label }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded-full font-semibold"
      style={{ background: D.tagGreenBg, color: D.tagGreen }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l4 4 10-10" stroke={D.tagGreen} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  );
}

function computeScore(criteria, count) {
  if (!count || !criteria?.length) return null;
  const total = criteria.reduce((s, c) => s + c.count, 0);
  const max = count * criteria.length;
  return (4 + total / max).toFixed(1);
}

function criteriaScore(c, count) {
  if (!count) return "—";
  return (4 + c.count / count).toFixed(1);
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

function initials(name) {
  return (name || "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function RecommendationsDetail({ supplierId, supplierName, onClose }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`/api/suppliers/${supplierId}/recommendations`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Could not load");
      setData(json);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, [supplierId]);

  if (error) {
    return (
      <Sheet onClose={onClose}>
        <p className="text-sm" style={{ color: "#C0392B" }}>{error}</p>
      </Sheet>
    );
  }

  if (!data) {
    return (
      <Sheet onClose={onClose}>
        <p className="text-sm" style={{ color: D.muted }}>Loading…</p>
      </Sheet>
    );
  }

  const score = computeScore(data.criteria, data.count);
  const maxCount = Math.max(1, ...data.criteria.map((c) => c.count));

  const canReview = data.viewer && data.viewer.role === "BUYER";
  const ctaLabel = !data.viewer
    ? "Sign in to write a review"
    : canReview
    ? (data.mine ? "Edit your review" : "Write a review")
    : "Write a review";

  const onCtaClick = () => {
    if (!data.viewer) {
      router.push(`/auth/phone?next=${encodeURIComponent(window.location.pathname || "/")}`);
      return;
    }
    if (!canReview) return;
    setPopupOpen(true);
  };

  return (
    <Sheet onClose={onClose}>
      <div className="flex items-center gap-4 mb-5 px-1">
        <span className="font-semibold leading-none" style={{ color: D.ink, fontSize: 56 }}>
          {score ?? data.count}
        </span>
        <div>
          <StarRow size={15} />
          <p className="text-[13px] mt-1" style={{ color: D.muted }}>
            Based on{" "}
            <strong style={{ color: D.ink }}>{data.count} verified {data.count === 1 ? "buyer" : "buyers"}</strong>
            {data.ordersShipped ? ` · ${data.ordersShipped} orders` : ""}
          </p>
        </div>
      </div>

      <p className="text-[10.5px] font-medium uppercase tracking-widest mb-3" style={{ color: D.muted }}>
        Why buyers recommend them
      </p>
      <div className="space-y-2.5 mb-5">
        {data.criteria.map((c) => (
          <div key={c.key} className="flex items-center gap-3">
            <span className="text-[13.5px] flex-shrink-0 w-32" style={{ color: D.ink2 }}>
              {labelFor(c.key)}
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: D.cream }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${(c.count / maxCount) * 100}%`, background: COLORS.amber }}
              />
            </div>
            <span className="text-[12.5px] font-semibold w-8 text-right flex-shrink-0" style={{ color: D.ink }}>
              {criteriaScore(c, data.count)}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onCtaClick}
        disabled={data.viewer && !canReview}
        className="w-full py-3 rounded-xl font-semibold text-[14.5px] flex items-center justify-center gap-2 mb-2"
        style={{
          background: data.viewer && !canReview ? "rgba(26,23,20,0.06)" : COLORS.amber,
          color: data.viewer && !canReview ? D.muted : "#0C0B09",
          cursor: data.viewer && !canReview ? "not-allowed" : "pointer",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
        {ctaLabel}
      </button>
      <p className="text-xs mb-5 text-center" style={{ color: D.muted }}>
        Only buyers with a Kendra-verified order can post a review.
      </p>

      {data.notes.length > 0 && (
        <>
          <p className="text-[11px] font-medium mb-3" style={{ color: D.muted }}>
            All reviews · {data.notes.length}
          </p>
          <div className="space-y-4">
            {data.notes.map((n) => (
              <div key={n.id} className="pb-4" style={{ borderBottom: `1px solid ${D.line}` }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-[13px]"
                    style={{ background: COLORS.amber, color: "#fff" }}
                  >
                    {initials(n.author)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold leading-tight" style={{ color: D.ink }}>
                      {n.author}
                    </p>
                    <p className="text-[12px]" style={{ color: D.muted }}>
                      {n.brand || ""}{n.brand && n.createdAt ? " · " : ""}{formatDate(n.createdAt)}
                    </p>
                  </div>
                  <StarRow size={13} />
                </div>
                <p className="text-[14.5px] leading-relaxed mb-2.5" style={{ color: D.ink2 }}>
                  &ldquo;{n.text}&rdquo;
                </p>
                {n.criteria?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {n.criteria.map((key) => (
                      <CriteriaChip key={key} label={labelFor(key)} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {data.notes.length === 0 && data.count === 0 && (
        <p className="text-sm" style={{ color: D.muted }}>
          Be the first to review {supplierName}.
        </p>
      )}

      {popupOpen && (
        <RecommendPopup
          supplierId={supplierId}
          supplierName={supplierName}
          initial={data.mine}
          onClose={() => setPopupOpen(false)}
          onSaved={() => load()}
        />
      )}
    </Sheet>
  );
}

function Sheet({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] rounded-t-3xl px-5 pt-5 pb-10"
        style={{ background: "#F6F3EC", maxHeight: "92dvh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(26,23,20,0.14)" }} />
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold" style={{ color: "#1A1714", fontSize: 26 }}>Reviews</h2>
          <button onClick={onClose} className="text-[15px] font-medium px-1" style={{ color: "#3A342D" }}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
