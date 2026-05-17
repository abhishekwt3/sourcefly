"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/lib/theme";
import {
  saveSellerStep1,
  saveSellerStep2,
  saveSellerStep3,
  saveSellerStep4,
  saveSellerStep5,
  submitSellerForReview,
} from "@/lib/seller-actions";
import MediaUploader from "@/components/MediaUploader";

const CATEGORIES = [
  "Apparel",
  "Packaging",
  "Print",
  "Gifting",
  "Nutraceuticals",
  "Beauty & Personal Care",
  "Food & Beverage",
  "Home & Lifestyle",
  "Other",
];

const TAG_OPTIONS = [
  "Low MOQ",
  "Fast turnaround",
  "Custom orders",
  "Sample available",
  "Eco-friendly",
  "Export-ready",
];

const CERT_OPTIONS = ["FSSAI", "GMP", "ISO 9001", "BRC", "OEKO-TEX", "FSC", "Organic", "MSME"];

function Chips({ value, onChange, options }) {
  const toggle = (t) => {
    onChange(value.includes(t) ? value.filter((x) => x !== t) : [...value, t]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((t) => {
        const on = value.includes(t);
        return (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            className="text-xs px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: on ? COLORS.amber : COLORS.surface,
              color: on ? COLORS.onAccent : COLORS.text2,
              border: `1px solid ${on ? COLORS.amber : COLORS.border}`,
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: COLORS.text2 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.text,
};

const baseInputClass =
  "w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none";

export default function SellerWizard({ step, totalSteps, user, supplier }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  // Local state seeded from server
  const [form, setForm] = useState({
    name: supplier?.name || "",
    handle: supplier?.handle || "",
    tagline: supplier?.tagline || "",
    category: supplier?.category || "",
    location: supplier?.location || "",
    about: supplier?.about || "",
    yearsInBusiness: supplier?.yearsInBusiness || "",
    tags: supplier?.tags || [],
    certifications: supplier?.certifications || [],
    moq: supplier?.moq ? String(supplier.moq) : "",
    lowMoq: supplier?.lowMoq ?? false,
    lead: supplier?.lead || "",
    offerings:
      supplier?.offerings?.length > 0
        ? supplier.offerings
        : [{ name: "", moq: "", lead: "" }],
    whatsapp: supplier?.whatsapp || "",
    accent: supplier?.accent || "#D4A853",
    photos: supplier?.photos || [],
    videoUrl: supplier?.videoUrl || "",
    videoThumbnail: supplier?.videoThumbnail || "",
    videoDuration: supplier?.videoDuration || "",
  });

  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => router.push(`/onboarding/seller/${step + 1}`);
  const back = () => step > 1 && router.push(`/onboarding/seller/${step - 1}`);

  const handleSave = (saver, after) => {
    setError(null);
    startTransition(async () => {
      const res = await saver(form);
      if (!res?.ok) {
        setError(res?.error || "Could not save");
        return;
      }
      after();
    });
  };

  return (
    <div className="px-5 pt-8 pb-10">
      <div className="flex items-center gap-2 mb-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ background: i < step ? COLORS.amber : COLORS.border }}
          />
        ))}
      </div>
      <p className="text-xs mb-6" style={{ color: COLORS.muted }}>
        Step {step} of {totalSteps}
      </p>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h1 className="pf text-xl font-bold mb-1" style={{ color: COLORS.text }}>
              Business basics
            </h1>
            <p className="text-sm" style={{ color: COLORS.muted }}>
              How buyers will find and recognise you.
            </p>
          </div>

          <Field label="Business name *">
            <input
              className={baseInputClass}
              style={inputStyle}
              value={form.name}
              onChange={(e) => setField("name")(e.target.value)}
              placeholder="Print Panda"
            />
          </Field>
          <Field label="Handle (optional, auto-filled from name)">
            <input
              className={baseInputClass}
              style={inputStyle}
              value={form.handle}
              onChange={(e) => setField("handle")(e.target.value)}
              placeholder="@printpanda"
            />
          </Field>
          <Field label="Tagline * (one line, max 80 chars)">
            <input
              className={baseInputClass}
              style={inputStyle}
              value={form.tagline}
              onChange={(e) => setField("tagline")(e.target.value.slice(0, 80))}
              placeholder="Packaging & Custom Print"
            />
          </Field>
          <Field label="Category *">
            <select
              className={baseInputClass}
              style={inputStyle}
              value={form.category}
              onChange={(e) => setField("category")(e.target.value)}
            >
              <option value="">Choose…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Location * (city, state)">
            <input
              className={baseInputClass}
              style={inputStyle}
              value={form.location}
              onChange={(e) => setField("location")(e.target.value)}
              placeholder="Delhi, Okhla"
            />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h1 className="pf text-xl font-bold mb-1" style={{ color: COLORS.text }}>
              About your business
            </h1>
            <p className="text-sm" style={{ color: COLORS.muted }}>
              Tell D2C buyers what makes you different.
            </p>
          </div>

          <Field label="About * (max 500 chars)">
            <textarea
              rows={5}
              className={`${baseInputClass} resize-none`}
              style={inputStyle}
              value={form.about}
              onChange={(e) => setField("about")(e.target.value.slice(0, 500))}
              placeholder="What you make, who you've worked with, why D2C brands like you."
            />
            <p className="text-xs mt-1 text-right" style={{ color: COLORS.muted }}>
              {form.about.length}/500
            </p>
          </Field>
          <Field label="Years in business (optional)">
            <input
              type="number"
              className={baseInputClass}
              style={inputStyle}
              value={form.yearsInBusiness}
              onChange={(e) => setField("yearsInBusiness")(e.target.value)}
              placeholder="8"
            />
          </Field>
          <Field label="Tags">
            <Chips value={form.tags} onChange={setField("tags")} options={TAG_OPTIONS} />
          </Field>
          <Field label="Certifications">
            <Chips
              value={form.certifications}
              onChange={setField("certifications")}
              options={CERT_OPTIONS}
            />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h1 className="pf text-xl font-bold mb-1" style={{ color: COLORS.text }}>
              Capacity
            </h1>
            <p className="text-sm" style={{ color: COLORS.muted }}>
              MOQ and lead times are the first thing buyers check.
            </p>
          </div>
          <Field label="Minimum order quantity *">
            <input
              type="number"
              className={baseInputClass}
              style={inputStyle}
              value={form.moq}
              onChange={(e) => setField("moq")(e.target.value)}
              placeholder="100"
            />
          </Field>
          <Field label="Lead time *">
            <input
              className={baseInputClass}
              style={inputStyle}
              value={form.lead}
              onChange={(e) => setField("lead")(e.target.value)}
              placeholder="7–10 days"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm" style={{ color: COLORS.text2 }}>
            <input
              type="checkbox"
              checked={form.lowMoq}
              onChange={(e) => setField("lowMoq")(e.target.checked)}
            />
            Mark as Low MOQ supplier
          </label>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <h1 className="pf text-xl font-bold mb-1" style={{ color: COLORS.text }}>
              Product offerings
            </h1>
            <p className="text-sm" style={{ color: COLORS.muted }}>
              Add the items or services buyers can order from you. At least 1.
            </p>
          </div>

          <div className="space-y-3">
            {form.offerings.map((o, i) => (
              <div
                key={i}
                className="rounded-2xl p-3 space-y-2"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium" style={{ color: COLORS.muted }}>
                    Offering {i + 1}
                  </p>
                  {form.offerings.length > 1 && (
                    <button
                      type="button"
                      className="text-xs underline"
                      style={{ color: COLORS.muted }}
                      onClick={() =>
                        setField("offerings")(form.offerings.filter((_, x) => x !== i))
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  className={baseInputClass}
                  style={inputStyle}
                  placeholder="Name (e.g. Custom Mailer Boxes)"
                  value={o.name}
                  onChange={(e) => {
                    const next = [...form.offerings];
                    next[i] = { ...next[i], name: e.target.value };
                    setField("offerings")(next);
                  }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className={baseInputClass}
                    style={inputStyle}
                    placeholder="MOQ (e.g. 200 units)"
                    value={o.moq}
                    onChange={(e) => {
                      const next = [...form.offerings];
                      next[i] = { ...next[i], moq: e.target.value };
                      setField("offerings")(next);
                    }}
                  />
                  <input
                    className={baseInputClass}
                    style={inputStyle}
                    placeholder="Lead (e.g. 12 days)"
                    value={o.lead}
                    onChange={(e) => {
                      const next = [...form.offerings];
                      next[i] = { ...next[i], lead: e.target.value };
                      setField("offerings")(next);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setField("offerings")([...form.offerings, { name: "", moq: "", lead: "" }])
            }
            className="w-full py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: COLORS.surface,
              border: `1px dashed ${COLORS.border2}`,
              color: COLORS.text2,
            }}
          >
            + Add offering
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <div>
            <h1 className="pf text-xl font-bold mb-1" style={{ color: COLORS.text }}>
              WhatsApp & media
            </h1>
            <p className="text-sm" style={{ color: COLORS.muted }}>
              This is the number buyers will message. Add photos to build trust.
            </p>
          </div>

          <Field label="WhatsApp number * (with country code)">
            <input
              className={baseInputClass}
              style={inputStyle}
              placeholder="919876543210"
              value={form.whatsapp}
              onChange={(e) => setField("whatsapp")(e.target.value.replace(/\D/g, ""))}
            />
          </Field>

          <Field label="Photos (up to 8)">
            <MediaUploader
              kind="photos"
              urls={form.photos}
              onChange={setField("photos")}
              max={8}
            />
          </Field>

          <Field label="Intro video (optional)">
            <MediaUploader
              kind="video"
              urls={form.videoUrl ? [form.videoUrl] : []}
              onChange={(urls) => setField("videoUrl")(urls[0] || "")}
              max={1}
            />
          </Field>

          <Field label="Accent colour">
            <input
              type="color"
              className="w-16 h-10 rounded-lg cursor-pointer"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
              value={form.accent}
              onChange={(e) => setField("accent")(e.target.value)}
            />
          </Field>
        </div>
      )}

      {error && (
        <p className="text-xs mt-4" style={{ color: "#C0392B" }}>
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 mt-8">
        {step > 1 ? (
          <button
            onClick={back}
            className="px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: COLORS.surface, color: COLORS.text2, border: `1px solid ${COLORS.border}` }}
          >
            Back
          </button>
        ) : <span />}

        {step < totalSteps && (
          <button
            onClick={() => {
              const savers = [saveSellerStep1, saveSellerStep2, saveSellerStep3, saveSellerStep4];
              handleSave(savers[step - 1], next);
            }}
            disabled={pending}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ background: COLORS.amber, color: COLORS.onAccent }}
          >
            {pending ? "Saving…" : "Save & continue"}
          </button>
        )}

        {step === totalSteps && (
          <button
            onClick={() =>
              handleSave(saveSellerStep5, () => {
                startTransition(async () => {
                  const r = await submitSellerForReview();
                  if (!r?.ok) {
                    setError(r?.error || "Could not submit");
                    return;
                  }
                  router.replace("/seller/manage");
                });
              })
            }
            disabled={pending}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ background: COLORS.amber, color: COLORS.onAccent }}
          >
            {pending ? "Submitting…" : "Submit for review"}
          </button>
        )}
      </div>
    </div>
  );
}
