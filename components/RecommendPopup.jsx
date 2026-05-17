"use client";

import { useState } from "react";
import { COLORS } from "@/lib/theme";
import { CRITERIA } from "@/lib/recommendation-criteria";

export default function RecommendPopup({ supplierId, supplierName, initial, onClose, onSaved }) {
  const [criteria, setCriteria] = useState(initial?.criteria || []);
  const [note, setNote] = useState(initial?.note || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const toggle = (k) => {
    setCriteria((cs) => (cs.includes(k) ? cs.filter((x) => x !== k) : [...cs, k]));
  };

  const submit = async () => {
    if (criteria.length === 0) {
      setError("Pick at least one thing you liked");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId, criteria, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not save");
      onSaved?.(data);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm("Remove your recommendation?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/recommendations?supplierId=${supplierId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Could not remove");
      onSaved?.({ removed: true });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] rounded-t-3xl p-5"
        style={{ background: COLORS.bg, maxHeight: "90dvh", overflow: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-10 h-1 rounded-full mx-auto mb-4"
          style={{ background: COLORS.border2 }}
        />
        <h2 className="pf text-lg font-bold mb-1" style={{ color: COLORS.text }}>
          What did you like about {supplierName}?
        </h2>
        <p className="text-xs mb-4" style={{ color: COLORS.muted }}>
          Tap all that apply.
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {CRITERIA.map((c) => {
            const on = criteria.includes(c.key);
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => toggle(c.key)}
                className="text-xs px-3 py-2 rounded-full"
                style={{
                  background: on ? COLORS.amber : COLORS.surface,
                  color: on ? COLORS.onAccent : COLORS.text2,
                  border: `1px solid ${on ? COLORS.amber : COLORS.border}`,
                }}
              >
                {on ? "✓ " : ""}{c.label}
              </button>
            );
          })}
        </div>

        <label className="text-xs font-medium block mb-1.5" style={{ color: COLORS.text2 }}>
          Tell other buyers why you'd recommend them (optional)
        </label>
        <textarea
          rows={4}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was the experience like? Anything that stood out?"
          className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none mb-1"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.text }}
        />
        <p className="text-xs text-right mb-4" style={{ color: COLORS.muted }}>
          {note.length}/500
        </p>

        {error && <p className="text-xs mb-3" style={{ color: "#C0392B" }}>{error}</p>}

        <button
          onClick={submit}
          disabled={busy}
          className="w-full py-3 rounded-xl font-semibold text-sm"
          style={{ background: COLORS.amber, color: COLORS.onAccent }}
        >
          {busy ? "Saving…" : initial ? "Update recommendation" : "Submit recommendation"}
        </button>
        <div className="flex items-center justify-between mt-3 px-1">
          <button onClick={onClose} className="text-xs underline" style={{ color: COLORS.muted }}>
            Cancel
          </button>
          {initial && (
            <button onClick={remove} className="text-xs underline" style={{ color: "#C0392B" }}>
              Remove my recommendation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
