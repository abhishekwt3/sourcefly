"use client";

import { useState } from "react";
import { COLORS } from "@/lib/theme";
import { CATEGORIES } from "@/lib/data";
import { submitListing } from "@/lib/actions";

const INITIAL = { name: "", cat: "", loc: "", moq: "", wa: "", desc: "", email: "" };

const FIELDS = [
  { k: "name", label: "Business Name *", ph: "Hitchhiking Vespa" },
  { k: "loc", label: "City / Location *", ph: "Mumbai" },
  { k: "moq", label: "Minimum Order Quantity", ph: "e.g. 50 units" },
  { k: "wa", label: "WhatsApp Number *", ph: "9876543210" },
  { k: "email", label: "Contact Email", ph: "you@brand.com" },
];

export default function ListScreen({ onBack }) {
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const valid = Boolean(form.name && form.wa && form.loc) && !submitting;

  const setField = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async () => {
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitListing({
        name: form.name,
        category: form.cat,
        location: form.loc,
        moq: form.moq,
        whatsapp: form.wa,
        description: form.desc,
        email: form.email,
      });
      if (res?.ok) {
        setDone(true);
      } else {
        setError(res?.error || "Something went wrong. Try again.");
      }
    } catch (e) {
      setError("Could not reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: COLORS.bg }}>
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
        style={{ background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium px-2 py-1 -ml-2 rounded-lg"
          style={{ color: COLORS.text }}
          aria-label="Back"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>

      <div className="px-4 py-4 space-y-4 pb-8">
        <div>
          <p className="font-semibold text-lg pf" style={{ color: COLORS.text }}>
            List Your Business
          </p>
          <p className="text-xs mt-1" style={{ color: COLORS.muted }}>
            We manually verify every supplier before listing. D2C-friendly only.
          </p>
        </div>

        {done ? (
          <div
            className="flex flex-col items-center justify-center text-center py-12 rounded-2xl"
            style={{ background: COLORS.surface }}
          >
            <p className="text-5xl mb-4">🎉</p>
            <p className="font-semibold text-lg pf" style={{ color: COLORS.text }}>
              Application received
            </p>
            <p className="text-sm mt-2 max-w-xs" style={{ color: COLORS.muted }}>
              We&apos;ll review and reach out on WhatsApp within 24 hrs.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: COLORS.text, color: COLORS.bg }}
            >
              Back to profile
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl space-y-4" style={{ background: COLORS.surface }}>
            {FIELDS.map((f) => (
              <div key={f.k}>
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: COLORS.text2 }}
                >
                  {f.label}
                </label>
                <input
                  className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                  style={{
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                  }}
                  placeholder={f.ph}
                  value={form[f.k]}
                  onChange={setField(f.k)}
                  inputMode={f.k === "wa" ? "tel" : f.k === "email" ? "email" : undefined}
                />
              </div>
            ))}
            <div>
              <label
                className="text-xs font-medium block mb-1.5"
                style={{ color: COLORS.text2 }}
              >
                Category
              </label>
              <select
                className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                style={{
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.text,
                }}
                value={form.cat}
                onChange={setField("cat")}
              >
                <option value="">Select category</option>
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-xs font-medium block mb-1.5"
                style={{ color: COLORS.text2 }}
              >
                What do you make / offer?
              </label>
              <textarea
                className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none"
                style={{
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.text,
                }}
                rows={4}
                placeholder="Brief description of your products or services..."
                value={form.desc}
                onChange={setField("desc")}
              />
            </div>

            {error && (
              <p
                className="text-xs px-3 py-2 rounded-xl"
                style={{
                  background: "#FEE2E2",
                  color: "#991B1B",
                  border: "1px solid #FCA5A5",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={submit}
              disabled={!valid}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all"
              style={{
                background: valid ? COLORS.amber : COLORS.bg,
                color: valid ? COLORS.onAccent : COLORS.muted,
                cursor: valid ? "pointer" : "not-allowed",
              }}
            >
              {submitting ? "Submitting…" : "Submit for Review"}
            </button>
            <p className="text-xs text-center" style={{ color: COLORS.muted }}>
              Only D2C-verified suppliers are listed on Kendra
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
