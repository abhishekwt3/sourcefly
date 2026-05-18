"use client";

import { useState } from "react";
import { COLORS } from "@/lib/theme";
import { CATEGORIES } from "@/lib/data";

const INITIAL = { name: "", brand: "", cat: "", need: "", moq: "", timeline: "" };

const FIELDS = [
  { k: "name", label: "Your Name *", ph: "Ishita Sharma" },
  { k: "brand", label: "Brand Name", ph: "My D2C Brand" },
  { k: "moq", label: "Target MOQ", ph: "e.g. 100 units" },
  { k: "timeline", label: "Timeline", ph: "e.g. Need in 3 weeks" },
];

export default function PostNeedScreen({ onBack }) {
  const [form, setForm] = useState(INITIAL);
  const [posted, setPosted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const valid = Boolean(form.name && form.need) && !submitting;

  const setField = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async () => {
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Could not post requirement");
      setPosted(true);
    } catch (e) {
      setError(e?.message || "Could not post requirement");
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
            Post a Requirement
          </p>
          <p className="text-xs mt-1" style={{ color: COLORS.muted }}>
            Verified suppliers will reach out to you on WhatsApp.
          </p>
        </div>

      {posted ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <p className="text-5xl mb-4">📬</p>
          <p className="font-semibold text-lg pf" style={{ color: COLORS.text }}>
            Requirement posted
          </p>
          <p className="text-sm mt-2 max-w-xs" style={{ color: COLORS.muted }}>
            Matching suppliers will reach out on WhatsApp within 24 hrs.
          </p>
          <button
            onClick={() => {
              setPosted(false);
              setForm(INITIAL);
            }}
            className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: COLORS.surface2,
              border: `1px solid ${COLORS.border2}`,
              color: COLORS.text,
            }}
          >
            Post Another
          </button>
        </div>
      ) : (
        <div className="space-y-4">
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
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border2}`,
                  color: COLORS.text,
                }}
                placeholder={f.ph}
                value={form[f.k]}
                onChange={setField(f.k)}
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
                background: COLORS.surface,
                border: `1px solid ${COLORS.border2}`,
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
              Describe your need *
            </label>
            <textarea
              className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border2}`,
                color: COLORS.text,
              }}
              rows={4}
              placeholder="e.g. Low MOQ sachet packaging for nutraceutical powder, food-grade, need custom print with my logo"
              value={form.need}
              onChange={setField("need")}
            />
          </div>
          {error && (
            <p className="text-xs" style={{ color: "#C0392B" }}>
              {error}
            </p>
          )}
          <button
            onClick={submit}
            disabled={!valid}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all"
            style={{
              background: valid ? COLORS.amber : COLORS.surface,
              color: valid ? COLORS.onAccent : COLORS.muted,
              cursor: valid ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "Posting…" : "Post Requirement"}
          </button>
          <p className="text-xs text-center pb-4" style={{ color: COLORS.border2 }}>
            Only D2C-verified suppliers will see this
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
