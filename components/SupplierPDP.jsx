"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/theme";
import SupplierMedia from "./SupplierMedia";
import RecommendChip from "./RecommendChip";
import RecommendationsDetail from "./RecommendationsDetail";

// Design tokens from the refined design
const D = {
  cream: "#F6F3EC",
  card: "#FFFFFF",
  ink: "#1A1714",
  ink2: "#3A342D",
  muted: "#75695B",
  brand: "#8B6A3A",
  brandDeep: "#6B4F24",
  brandTint: "#F3EAD9",
  olive: "#4F6B3A",
  oliveTint: "#E6EDD9",
  line: "rgba(26,23,20,0.08)",
  line2: "rgba(26,23,20,0.14)",
};

function VerifiedBadge() {
  return (
    <span
      title="Kendra verified"
      className="inline-flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0"
      style={{ background: COLORS.amber }}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function LocationIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function Stat({ value, label, borderRight }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-2.5 px-2 flex-1"
      style={{ borderRight: borderRight ? `1px solid ${D.line2}` : "none" }}
    >
      <p
        className="serif font-semibold leading-tight"
        style={{ color: D.ink, fontSize: 17, letterSpacing: "-0.2px" }}
      >
        {value}
      </p>
      <p
        className="mono text-[9px] mt-0.5 uppercase"
        style={{ color: D.muted, letterSpacing: "1px" }}
      >
        {label}
      </p>
    </div>
  );
}

function CertChip({ label }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
      style={{ background: D.oliveTint, color: D.olive }}
    >
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l4 4 10-10" stroke={D.olive} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  );
}

function SectionLabel({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <span
        className="mono text-[11px] font-medium uppercase"
        style={{ color: D.muted, letterSpacing: "1.4px" }}
      >
        {children}
      </span>
      {action}
    </div>
  );
}

export default function SupplierPDP({ supplier: s, onBack, onSave, saved }) {
  const [form, setForm] = useState({ name: "", brand: "", need: "", moq: "" });
  const [sent, setSent] = useState(false);
  const [showRecs, setShowRecs] = useState(false);
  const [summary, setSummary] = useState({ count: s.recommendCount ?? 0, topCriteria: [] });
  const [photoTab, setPhotoTab] = useState("products");
  const valid = Boolean(form.name && form.need);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: s.name,
      text: `Check out ${s.name} on Kendra`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* user cancelled or unsupported */
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/suppliers/${s.id}/recommendations`);
        const json = await res.json();
        if (!cancelled && res.ok) setSummary({ count: json.count, topCriteria: json.criteria });
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [s.id]);

  const requestSamples = () => {
    const msg = encodeURIComponent(
      `Hi ${s.name}! Found you on Kendra.\n\nI'd like to request samples.\n\nBrand: ${form.brand || "—"}`
    );
    window.open(`https://wa.me/${s.wa}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const send = () => {
    if (!valid) return;
    const msg = encodeURIComponent(
      `Hi ${s.name}! Found you on Kendra.\n\nName: ${form.name}\nBrand: ${form.brand || "—"}\nNeed: ${form.need}\nTarget MOQ: ${form.moq || "—"}`
    );
    window.open(`https://wa.me/${s.wa}?text=${msg}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const setField = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const stats = [
    s.yearsInBusiness != null && { value: `${s.yearsInBusiness}y`, label: "In business" },
    s.lead && { value: /days?$/i.test(String(s.lead).trim()) ? s.lead : `${s.lead} days`, label: "Lead time" },
    s.moq && { value: String(s.moq), label: "Min order" },
  ].filter(Boolean);

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: D.cream }}>
      {/* Sticky nav */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
        style={{ background: D.cream, borderBottom: `1px solid ${D.line}` }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium px-2 py-1 -ml-2 rounded-lg"
          style={{ color: D.ink }}
          aria-label="Back"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: D.card }}
            aria-label="Share supplier"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={D.muted} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
          <button
            onClick={() => onSave(s.id)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: D.card }}
            aria-label={saved ? "Remove bookmark" : "Save supplier"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? COLORS.amber : "none"} stroke={saved ? COLORS.amber : D.muted} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4h12v17l-6-4-6 4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3 pb-10">
        {/* Hero identity — uses app background, no card */}
        <div className="px-1 pt-1">
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-16 h-16 flex items-center justify-center font-semibold flex-shrink-0 overflow-hidden"
              style={{
                background: s.accent,
                color: COLORS.onAccent,
                fontSize: 23,
                borderRadius: 18,
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.15), 0 0 0 4px ${s.accent}30`,
              }}
            >
              {s.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.logoUrl}
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                s.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h1 className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="serif font-semibold leading-tight"
                  style={{ color: D.ink, fontSize: 26, letterSpacing: "-0.4px" }}
                >
                  {s.name}
                </span>
                <VerifiedBadge />
                {s.lowMoq && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: D.oliveTint, color: D.olive }}
                  >
                    Low MOQ
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-xs" style={{ color: D.muted }}>{s.handle}</span>
                <span className="text-xs" style={{ color: D.muted }}>·</span>
                <span className="flex items-center gap-0.5 text-xs" style={{ color: D.muted }}>
                  <LocationIcon />
                  {s.location}
                </span>
              </div>
            </div>
          </div>

          <p className="leading-relaxed mb-3" style={{ color: D.ink2, fontSize: 15 }}>
            {s.about}
          </p>

          {/* CTA buttons */}
          <div className="flex gap-2">
            <button
              onClick={requestSamples}
              className="flex-[6] flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: COLORS.amber, color: COLORS.onAccent }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8l9-5 9 5v8l-9 5-9-5z" />
                <path d="M3 8l9 5 9-5M12 13v8" />
              </svg>
              Request samples
            </button>
            <button
              onClick={() => window.open(`https://wa.me/${s.wa}`, "_blank", "noopener,noreferrer")}
              className="w-[50px] h-[50px] rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: D.card, border: `1px solid ${D.line2}` }}
              aria-label="Chat on WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={D.ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a8 8 0 01-12.5 6.6L4 20l1.5-4A8 8 0 1121 12z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats + Certifications */}
        {(() => {
          const cleanCerts = Array.from(
            new Set((s.certifications ?? []).filter(Boolean).map((c) => c.trim()).filter(Boolean))
          );
          const hasCerts = cleanCerts.length > 0;
          if (stats.length === 0 && !hasCerts) return null;
          return (
            <div className="rounded-2xl overflow-hidden mt-4" style={{ background: D.card }}>
              {stats.length > 0 && (
                <div
                  className="flex"
                  style={{ borderBottom: hasCerts ? `1px solid ${D.line}` : "none" }}
                >
                  {stats.map((st, i) => (
                    <Stat key={st.label} value={st.value} label={st.label} borderRight={i < stats.length - 1} />
                  ))}
                </div>
              )}
              {hasCerts && (
                <div className="px-2.5 py-1.5 flex items-center gap-1 flex-wrap">
                  <span
                    className="mono text-[8px] uppercase"
                    style={{ color: D.muted, letterSpacing: "0.8px" }}
                  >
                    Certified
                  </span>
                  {cleanCerts.map((c) => (
                    <CertChip key={c} label={c} />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Recommendation chip */}
        <RecommendChip
          count={summary.count}
          topCriteria={summary.topCriteria}
          onOpen={() => setShowRecs(true)}
        />

        {/* Catalog */}
        {s.offerings?.length > 0 && (
          <section>
            <SectionLabel
              action={
                s.offerings.length > 3 && (
                  <span
                    className="text-[12px] font-semibold inline-flex items-center gap-1"
                    style={{ color: D.brandDeep }}
                  >
                    View all {s.offerings.length}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                )
              }
            >
              Catalog
            </SectionLabel>
            <div className="space-y-1.5">
              {s.offerings.map((o) => (
                <div
                  key={o.name}
                  className="rounded-2xl px-3 py-2.5 flex items-center gap-3"
                  style={{ background: D.card }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: D.cream }}
                  >
                    {o.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={o.image} alt={o.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={D.muted} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[15px] font-semibold leading-snug"
                      style={{ color: D.ink, letterSpacing: "-0.1px" }}
                    >
                      {o.name}
                    </p>
                    <p className="text-[12.5px] mt-1" style={{ color: D.muted }}>
                      {o.pack || (o.lead && (/days?$/i.test(String(o.lead).trim()) ? o.lead : `${o.lead} days`))}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {o.price && (
                      <p className="mono text-[12px] font-semibold" style={{ color: D.ink }}>
                        {o.price}
                      </p>
                    )}
                    <p
                      className="mono text-[10.5px] mt-1.5"
                      style={{ color: D.muted, letterSpacing: "0.6px" }}
                    >
                      MOQ {o.moq}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Media */}
        {(s.video?.url || s.photos?.length > 0) && (
          <section>
            <SectionLabel>Photos</SectionLabel>
            <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
              {[
                { key: "products", label: "Products", count: s.photos?.length ?? 0 },
                { key: "facility", label: "Facility", count: s.facilityPhotos?.length ?? 0 },
                { key: "certificates", label: "Certificates", count: s.certPhotos?.length ?? 0 },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPhotoTab(tab.key)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                  style={{
                    background: photoTab === tab.key ? D.ink : D.cream,
                    color: photoTab === tab.key ? "#FFFFFF" : D.ink2,
                    border: photoTab === tab.key ? "none" : `1px solid ${D.line2}`,
                  }}
                >
                  {tab.label}{tab.count > 0 ? ` · ${tab.count}` : ""}
                </button>
              ))}
            </div>
            <SupplierMedia
              video={photoTab === "products" ? s.video : null}
              photos={
                photoTab === "products" ? (s.photos ?? []) :
                photoTab === "facility" ? (s.facilityPhotos ?? []) :
                (s.certPhotos ?? [])
              }
            />
          </section>
        )}

        {/* Send Requirement */}
        <div className="p-4 rounded-2xl" style={{ background: D.card }}>
          <p className="font-semibold mb-0.5 text-sm" style={{ color: D.ink }}>Send Requirement</p>
          <p className="text-xs mb-4" style={{ color: D.muted }}>Hits their WhatsApp directly. No middleman.</p>

          {sent ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">✅</p>
              <p className="font-medium text-sm" style={{ color: D.ink }}>WhatsApp opened</p>
              <p className="text-xs mt-1" style={{ color: D.muted }}>Your message is pre-filled. Just send.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-xs underline" style={{ color: COLORS.amber }}>
                Send another
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { k: "name", label: "Your Name *", ph: "Rajni Ohri" },
                { k: "brand", label: "Brand Name", ph: "Ohria Ayurveda" },
                { k: "moq", label: "Target MOQ", ph: "100 units" },
              ].map((f) => (
                <div key={f.k}>
                  <label className="text-xs font-medium block mb-1" style={{ color: D.ink2 }}>{f.label}</label>
                  <input
                    className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                    style={{ background: D.cream, border: `1px solid ${D.line2}`, color: D.ink }}
                    placeholder={f.ph}
                    value={form[f.k]}
                    onChange={setField(f.k)}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: D.ink2 }}>What do you need? *</label>
                <textarea
                  className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ background: D.cream, border: `1px solid ${D.line2}`, color: D.ink }}
                  rows={3}
                  placeholder="e.g. Sachet packaging for nutraceutical powder, food-grade"
                  value={form.need}
                  onChange={setField("need")}
                />
              </div>
              <button
                onClick={send}
                disabled={!valid}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{
                  background: valid ? COLORS.whatsapp : D.cream,
                  color: valid ? "#fff" : D.muted,
                  cursor: valid ? "pointer" : "not-allowed",
                  border: valid ? "none" : `1px solid ${D.line2}`,
                }}
              >
                💬 Connect on WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

      {showRecs && (
        <RecommendationsDetail
          supplierId={s.id}
          supplierName={s.name}
          onClose={() => setShowRecs(false)}
        />
      )}
    </div>
  );
}
