"use client";

import { useEffect } from "react";
import { COLORS } from "@/lib/theme";
import { CATEGORIES } from "@/lib/data";

const TAG_OPTIONS = [
  "Low MOQ",
  "Fast turnaround",
  "Custom orders",
  "Sample available",
  "Eco-friendly",
  "Export-ready",
];

const CERT_OPTIONS = ["FSSAI", "GMP", "ISO 9001", "BRC", "OEKO-TEX", "FSC", "Organic", "MSME"];

function SectionLabel({ children }) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-wider mb-3"
      style={{ color: COLORS.amber }}
    >
      {children}
    </p>
  );
}

function Chip({ label, active, onToggle, style = "dark" }) {
  const activeStyle =
    style === "amber"
      ? { background: COLORS.amber, color: COLORS.onAccent, border: `1px solid ${COLORS.amber}` }
      : { background: COLORS.text, color: COLORS.bg, border: `1px solid ${COLORS.text}` };
  const inactiveStyle = {
    background: COLORS.surface,
    color: COLORS.text2,
    border: `1px solid ${COLORS.border}`,
  };
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-xs px-3 py-1.5 rounded-full transition-colors flex-shrink-0"
      style={active ? activeStyle : inactiveStyle}
    >
      {label}
    </button>
  );
}

export default function FilterOverlay({ open, onClose, filters, onChange, resultCount, locations }) {
  // Prevent body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const { cat, location, lowMoq, tags, certifications } = filters;

  const toggleTag = (t) =>
    onChange({ ...filters, tags: tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t] });

  const toggleCert = (c) =>
    onChange({ ...filters, certifications: certifications.includes(c) ? certifications.filter((x) => x !== c) : [...certifications, c] });

  const clearAll = () =>
    onChange({ cat: "All", location: "", lowMoq: false, tags: [], certifications: [] });

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ maxWidth: 430, margin: "0 auto" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(23,23,23,0.4)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative flex flex-col rounded-t-2xl"
        style={{ background: COLORS.surface, maxHeight: "85dvh" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-8 h-1 rounded-full" style={{ background: COLORS.border2 }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
          <p className="pf font-bold text-base" style={{ color: COLORS.text }}>
            Filters
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium px-3 py-1.5 rounded-xl"
            style={{ background: COLORS.surface2, color: COLORS.muted }}
          >
            Clear all
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 space-y-6 pb-4" style={{ flex: 1 }}>

          {/* Category */}
          <div>
            <SectionLabel>Category</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  active={cat === c}
                  onToggle={() => onChange({ ...filters, cat: c })}
                  style="dark"
                />
              ))}
            </div>
          </div>

          {/* Location */}
          {locations.length > 0 && (
            <div>
              <SectionLabel>Location</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <Chip
                    key={loc}
                    label={loc}
                    active={location === loc}
                    onToggle={() => onChange({ ...filters, location: location === loc ? "" : loc })}
                    style="dark"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Low MOQ */}
          <div>
            <SectionLabel>Order size</SectionLabel>
            <button
              type="button"
              onClick={() => onChange({ ...filters, lowMoq: !lowMoq })}
              className="w-full rounded-2xl p-3 flex items-center justify-between"
              style={{ background: COLORS.surface2 }}
            >
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: COLORS.text }}>
                  Low MOQ suppliers only
                </p>
                <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>
                  Under 100 units minimum
                </p>
              </div>
              <div
                className="w-10 h-6 rounded-full flex items-center transition-all flex-shrink-0"
                style={{
                  background: lowMoq ? COLORS.green : COLORS.border2,
                  justifyContent: lowMoq ? "flex-end" : "flex-start",
                  padding: "2px",
                }}
              >
                <div className="w-5 h-5 rounded-full" style={{ background: "#fff" }} />
              </div>
            </button>
          </div>

          {/* Specialisations */}
          <div>
            <SectionLabel>Specialisations</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  active={tags.includes(t)}
                  onToggle={() => toggleTag(t)}
                  style="amber"
                />
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <SectionLabel>Certifications</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {CERT_OPTIONS.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  active={certifications.includes(c)}
                  onToggle={() => toggleCert(c)}
                  style="amber"
                />
              ))}
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div
          className="flex-shrink-0 px-5 pb-6 pt-3"
          style={{ borderTop: `1px solid ${COLORS.border}` }}
        >
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl text-sm font-semibold"
            style={{ background: COLORS.amber, color: COLORS.onAccent }}
          >
            Show {resultCount} {resultCount === 1 ? "supplier" : "suppliers"}
          </button>
        </div>
      </div>
    </div>
  );
}
