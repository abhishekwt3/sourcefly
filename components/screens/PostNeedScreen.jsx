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

export default function PostNeedScreen() {
  const [form, setForm] = useState(INITIAL);
  const [posted, setPosted] = useState(false);
  const valid = Boolean(form.name && form.need);

  const setField = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4">
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
          <button
            onClick={() => setPosted(true)}
            disabled={!valid}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all"
            style={{
              background: valid ? COLORS.amber : COLORS.surface,
              color: valid ? COLORS.onAccent : COLORS.muted,
              cursor: valid ? "pointer" : "not-allowed",
            }}
          >
            Post Requirement
          </button>
          <p className="text-xs text-center pb-4" style={{ color: COLORS.border2 }}>
            Only D2C-verified suppliers will see this
          </p>
        </div>
      )}
    </div>
  );
}
