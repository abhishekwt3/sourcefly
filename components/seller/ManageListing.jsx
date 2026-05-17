"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/lib/theme";
import { updateListing } from "@/lib/seller-actions";
import MediaUploader from "@/components/MediaUploader";

const D = {
  cream: "#F6F3EC",
  cream2: "#EFEADD",
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

const CATEGORIES = [
  "Packaging",
  "Apparel",
  "Beauty",
  "Print",
  "Nutraceuticals",
  "Food & Beverage",
  "Home & Lifestyle",
  "Gifting",
  "Other",
];

const COUNTRIES = ["India", "Bangladesh", "Sri Lanka", "Nepal", "UAE"];

const CERT_OPTIONS = [
  "FSSAI",
  "ISO 22000",
  "ISO 9001",
  "HACCP",
  "BRC",
  "GMP",
  "GOTS",
  "Organic",
  "Halal",
  "OEKO-TEX",
  "FSC",
  "MSME",
];

const PRODUCT_TAGS = ["None", "Bestseller", "New", "Custom", "Limited"];

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "catalog", label: "Catalog" },
  { key: "photos", label: "Photos" },
];

const inputBase = "w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none";
const inputStyle = {
  background: D.card,
  border: `1px solid ${D.line2}`,
  color: D.ink,
};

function MonoLabel({ children, counter }) {
  return (
    <div className="flex items-baseline justify-between mb-1.5">
      <span
        className="mono text-[10px] uppercase"
        style={{ color: D.muted, letterSpacing: "1.2px" }}
      >
        {children}
      </span>
      {counter && (
        <span
          className="mono text-[10px]"
          style={{ color: D.muted, letterSpacing: "0.6px" }}
        >
          {counter}
        </span>
      )}
    </div>
  );
}

function Field({ label, counter, children }) {
  return (
    <div>
      <MonoLabel counter={counter}>{label}</MonoLabel>
      {children}
    </div>
  );
}

function TagEditor({ value, onChange, max = 6, placeholder }) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const t = draft.trim();
    if (!t) return;
    if (value.length >= max) {
      setDraft("");
      return;
    }
    if (value.some((v) => v.toLowerCase() === t.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, t]);
    setDraft("");
  };

  const remove = (t) => onChange(value.filter((v) => v !== t));

  return (
    <div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full"
              style={{
                background: D.brandTint,
                color: D.ink2,
                fontSize: 11.5,
                fontWeight: 500,
                padding: "3px 4px 3px 10px",
              }}
            >
              {t}
              <button
                type="button"
                onClick={() => remove(t)}
                className="inline-flex items-center justify-center w-4 h-4 rounded-full"
                style={{ color: D.muted }}
                aria-label={`Remove ${t}`}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
      {value.length < max && (
        <input
          className={inputBase}
          style={inputStyle}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={commit}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function Chips({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((t) => {
        const on = value.includes(t);
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(on ? value.filter((x) => x !== t) : [...value, t])}
            className="text-xs px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: on ? D.olive : D.card,
              color: on ? "#FFFFFF" : D.ink2,
              border: `1px solid ${on ? D.olive : D.line2}`,
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-4 ${className}`}
      style={{ background: D.card, border: `1px solid ${D.line}` }}
    >
      {children}
    </div>
  );
}

function computeCompletion(form) {
  const checks = [
    !!form.name?.trim(),
    !!form.handle?.trim(),
    !!form.category?.trim(),
    !!(form.city?.trim() || form.location?.trim()),
    !!form.about?.trim(),
    Number(form.moq) > 0,
    !!form.lead?.trim(),
    (form.certifications?.length || 0) > 0,
    !!form.whatsapp?.trim(),
    form.offerings.some((o) => o.name?.trim() && o.moq?.trim()),
    (form.photos?.length || 0) > 0,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

export default function ManageListing({ supplier }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("profile");

  const [form, setForm] = useState({
    name: supplier.name || "",
    handle: (supplier.handle || "").replace(/^@/, ""),
    tagline: supplier.tagline || "",
    category: supplier.category || "",
    city: supplier.city || supplier.location || "",
    country: supplier.country || "India",
    logoUrl: supplier.logoUrl || "",
    about: supplier.about || "",
    yearsInBusiness: supplier.yearsInBusiness ?? "",
    moq: supplier.moq ? String(supplier.moq) : "",
    lowMoq: supplier.lowMoq ?? false,
    lead: supplier.lead || "",
    tags: supplier.tags || [],
    certifications: (supplier.certifications || []).filter((c) =>
      CERT_OPTIONS.includes(c)
    ),
    certPdfs: supplier.certPdfs || [],
    offerings:
      supplier.offerings?.length > 0
        ? supplier.offerings.map((o) => ({
            name: o.name || "",
            pack: o.pack || "",
            priceMin: o.priceMin != null ? String(o.priceMin) : "",
            priceMax: o.priceMax != null ? String(o.priceMax) : "",
            priceOnEnquiry: !!o.priceOnEnquiry,
            moq: o.moq || "",
            lead: o.lead || "",
            tag: o.tag || "",
            image: o.image || "",
          }))
        : [emptyOffering()],
    whatsapp: supplier.whatsapp || "",
    accent: supplier.accent || "#8B6A3A",
    photos: supplier.photos || [],
    facilityPhotos: supplier.facilityPhotos || [],
    videoUrl: supplier.videoUrl || "",
  });

  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const completion = useMemo(() => computeCompletion(form), [form]);

  const handleSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const payload = {
        ...form,
        handle: form.handle.startsWith("@") ? form.handle : `@${form.handle}`,
        location: [form.city?.trim(), form.country?.trim()].filter(Boolean).join(", "),
      };
      const res = await updateListing(payload);
      if (!res?.ok) {
        setError(res?.error || "Could not save");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const updateOffering = (i, patch) =>
    setField("offerings")(
      form.offerings.map((o, x) => (x === i ? { ...o, ...patch } : o))
    );

  const addOffering = () =>
    setField("offerings")([...form.offerings, emptyOffering()]);

  const removeOffering = (i) =>
    setField("offerings")(form.offerings.filter((_, x) => x !== i));

  const goNext = () => {
    if (tab === "profile") setTab("catalog");
    else if (tab === "catalog") setTab("photos");
  };

  const goBack = () => {
    if (tab === "photos") setTab("catalog");
    else if (tab === "catalog") setTab("profile");
  };

  return (
    <div
      style={{
        background: D.cream,
        height: "100dvh",
        maxWidth: 430,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: D.cream, borderBottom: `1px solid ${D.line}` }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
          style={{ background: D.card, border: `1px solid ${D.line}` }}
          aria-label="Go back"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={D.ink}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1
            className="serif font-semibold leading-tight truncate"
            style={{ color: D.ink, fontSize: 18, letterSpacing: "-0.3px" }}
          >
            List your business
          </h1>
          <p
            className="mono text-[10px] uppercase mt-0.5"
            style={{ color: D.muted, letterSpacing: "1px" }}
          >
            {completion}% complete
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: D.ink,
            color: "#FFFFFF",
            opacity: pending ? 0.6 : 1,
          }}
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </header>

      {/* Tabs */}
      <nav
        className="flex items-center gap-1 px-4 pt-3 pb-2 flex-shrink-0"
        style={{ background: D.cream }}
      >
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={{
                background: active ? D.ink : "transparent",
                color: active ? "#FFFFFF" : D.muted,
                letterSpacing: active ? "-0.1px" : "normal",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* Body */}
      <div className="px-4 pt-2 pb-4 flex-1 overflow-y-auto">
        {tab === "profile" && (
          <ProfileTab
            form={form}
            setField={setField}
          />
        )}

        {tab === "catalog" && (
          <CatalogTab
            offerings={form.offerings}
            updateOffering={updateOffering}
            addOffering={addOffering}
            removeOffering={removeOffering}
          />
        )}

        {tab === "photos" && (
          <PhotosTab
            photos={form.photos}
            onPhotos={setField("photos")}
            facilityPhotos={form.facilityPhotos}
            onFacility={setField("facilityPhotos")}
          />
        )}
      </div>

      {/* Footer */}
      <div
        className="flex-shrink-0 px-4 pb-5 pt-3 flex items-center gap-2"
        style={{ background: D.cream, borderTop: `1px solid ${D.line}` }}
      >
        {tab !== "profile" && (
          <button
            type="button"
            onClick={goBack}
            className="px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ background: D.card, color: D.ink, border: `1px solid ${D.line2}` }}
          >
            Back
          </button>
        )}
        {tab !== "photos" ? (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{ background: D.ink, color: "#FFFFFF" }}
          >
            Next ·
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{ background: D.brand, color: "#FFFFFF", opacity: pending ? 0.6 : 1 }}
          >
            {pending ? "Publishing…" : "Publish listing"}
          </button>
        )}
      </div>

      {(error || saved) && (
        <div
          className="px-4 py-2 text-xs text-center"
          style={{
            background: error ? "#FEE2E2" : D.oliveTint,
            color: error ? "#C0392B" : D.olive,
          }}
        >
          {error || "✓ Changes saved"}
        </div>
      )}
    </div>
  );
}

function ProfileTab({ form, setField }) {
  return (
    <div className="space-y-3 py-2">
      {/* Logo */}
      <Card>
        <MonoLabel>Logo</MonoLabel>
        <div className="flex items-center gap-3 mt-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-semibold flex-shrink-0 overflow-hidden"
            style={{
              background: form.accent,
              color: "#FFFFFF",
              fontSize: 22,
              boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.15), 0 0 0 4px ${form.accent}30`,
            }}
          >
            {form.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logoUrl}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              (form.name || "??").slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <MediaUploader
              kind="photos"
              urls={form.logoUrl ? [form.logoUrl] : []}
              onChange={(urls) => setField("logoUrl")(urls[0] || "")}
              max={1}
            />
          </div>
        </div>
      </Card>

      {/* Identity */}
      <Card>
        <div className="space-y-3">
          <Field
            label="Business name"
            counter={`${form.name.length}/48`}
          >
            <input
              className={inputBase}
              style={inputStyle}
              value={form.name}
              maxLength={48}
              onChange={(e) => setField("name")(e.target.value.slice(0, 48))}
              placeholder="Ozo Seasonings"
            />
          </Field>

          <Field
            label="Handle"
            counter={`${form.handle.length}/32`}
          >
            <div
              className="flex items-center rounded-xl px-3 py-2.5"
              style={{ background: D.card, border: `1px solid ${D.line2}` }}
            >
              <span
                className="mono text-sm pr-1"
                style={{ color: D.muted }}
              >
                @
              </span>
              <input
                className="flex-1 bg-transparent text-sm focus:outline-none"
                style={{ color: D.ink }}
                value={form.handle}
                maxLength={32}
                onChange={(e) =>
                  setField("handle")(
                    e.target.value.replace(/[^a-z0-9_]/gi, "").slice(0, 32)
                  )
                }
                placeholder="ozoseasoning"
              />
            </div>
          </Field>

          <Field
            label="Tagline"
            counter={`${form.tagline.length}/80`}
          >
            <input
              className={inputBase}
              style={inputStyle}
              value={form.tagline}
              maxLength={80}
              onChange={(e) => setField("tagline")(e.target.value.slice(0, 80))}
              placeholder="Seasoning for every need"
            />
          </Field>

          <Field label="Category">
            <select
              className={inputBase}
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

          <div className="grid grid-cols-2 gap-2">
            <Field label="City">
              <input
                className={inputBase}
                style={inputStyle}
                value={form.city}
                onChange={(e) => setField("city")(e.target.value)}
                placeholder="New Delhi"
              />
            </Field>
            <Field label="Country">
              <select
                className={inputBase}
                style={inputStyle}
                value={form.country}
                onChange={(e) => setField("country")(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="WhatsApp (with country code)">
            <div
              className="flex items-center rounded-xl px-3 py-2.5"
              style={{ background: D.card, border: `1px solid ${D.line2}` }}
            >
              <span
                className="mono text-sm pr-1"
                style={{ color: D.muted }}
              >
                +
              </span>
              <input
                inputMode="numeric"
                autoComplete="tel"
                className="flex-1 bg-transparent text-sm focus:outline-none"
                style={{ color: D.ink }}
                value={form.whatsapp}
                onChange={(e) =>
                  setField("whatsapp")(e.target.value.replace(/\D/g, "").slice(0, 15))
                }
                placeholder="919876543210"
              />
            </div>
          </Field>
        </div>
      </Card>

      {/* Pitch */}
      <Card>
        <Field
          label="Pitch"
          counter={`${form.about.length}/240`}
        >
          <textarea
            rows={4}
            className={`${inputBase} resize-none`}
            style={inputStyle}
            value={form.about}
            maxLength={240}
            onChange={(e) => setField("about")(e.target.value.slice(0, 240))}
            placeholder="Short description — what you make, who for, what makes you different."
          />
        </Field>
      </Card>

      {/* Category chips */}
      <Card>
        <MonoLabel counter={`${form.tags.length}/6`}>Specialties</MonoLabel>
        <p className="text-xs mt-1 mb-3" style={{ color: D.muted }}>
          Materials, capabilities, or product types you focus on.
        </p>
        <TagEditor
          value={form.tags}
          onChange={setField("tags")}
          max={6}
          placeholder="Type and press Enter (e.g. Leather, Canvas)"
        />
      </Card>

      {/* Trade terms */}
      <Card>
        <MonoLabel>Trade terms</MonoLabel>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Field label="Years">
            <input
              type="number"
              className={inputBase}
              style={inputStyle}
              value={form.yearsInBusiness}
              onChange={(e) => setField("yearsInBusiness")(e.target.value)}
              placeholder="2"
            />
          </Field>
          <Field label="MOQ">
            <input
              type="number"
              className={inputBase}
              style={inputStyle}
              value={form.moq}
              onChange={(e) => setField("moq")(e.target.value)}
              placeholder="5"
            />
          </Field>
          <Field label="Lead">
            <input
              className={inputBase}
              style={inputStyle}
              value={form.lead}
              onChange={(e) => setField("lead")(e.target.value)}
              placeholder="12d"
            />
          </Field>
        </div>
        <p className="mono text-[10px] mt-3" style={{ color: D.muted, letterSpacing: "0.4px" }}>
          In business · Min order · Typical lead
        </p>

        <label
          className="flex items-center gap-2.5 mt-4 pt-3 cursor-pointer"
          style={{ borderTop: `1px solid ${D.line}` }}
        >
          <input
            type="checkbox"
            checked={form.lowMoq}
            onChange={(e) => setField("lowMoq")(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
            style={{ accentColor: D.olive }}
          />
          <span className="flex-1">
            <span className="text-sm font-medium block" style={{ color: D.ink }}>
              Show &ldquo;Low MOQ&rdquo; badge
            </span>
            <span className="text-xs" style={{ color: D.muted }}>
              Buyers can filter for suppliers with low minimums.
            </span>
          </span>
        </label>
      </Card>

      {/* Credentials */}
      <Card>
        <MonoLabel>Credentials</MonoLabel>
        <p className="text-xs mt-1 mb-3" style={{ color: D.muted }}>
          We&apos;ll request copies during Kendra verification.
        </p>
        <Chips
          value={form.certifications}
          onChange={setField("certifications")}
          options={CERT_OPTIONS}
        />

        <div className="mt-4">
          <MonoLabel>Attach certificate PDFs (optional)</MonoLabel>
          <MediaUploader
            kind="photos"
            urls={form.certPdfs}
            onChange={setField("certPdfs")}
            max={6}
          />
        </div>
      </Card>

      <p className="text-[11px] text-center px-4 py-3" style={{ color: D.muted }}>
        Listings reviewed within 24h. Verified suppliers get a badge buyers filter by.
      </p>
    </div>
  );
}

function CatalogTab({ offerings, updateOffering, addOffering, removeOffering }) {
  const count = offerings.filter((o) => o.name?.trim()).length;
  return (
    <div className="space-y-3 py-2">
      <Card>
        <MonoLabel>Products you make</MonoLabel>
        <p className="text-sm mt-1" style={{ color: D.ink2 }}>
          <span className="serif font-semibold" style={{ color: D.ink, fontSize: 17 }}>
            {count} product{count === 1 ? "" : "s"}
          </span>
          <span className="text-xs ml-2" style={{ color: D.muted }}>
            · buyers request samples per item.
          </span>
        </p>
      </Card>

      {offerings.map((o, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between mb-3">
            <span
              className="mono text-[10px] uppercase"
              style={{ color: D.muted, letterSpacing: "1.2px" }}
            >
              Product {i + 1}
            </span>
            {offerings.length > 1 && (
              <button
                type="button"
                className="text-xs underline"
                style={{ color: D.muted }}
                onClick={() => removeOffering(i)}
              >
                Remove
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                style={{ background: D.cream, border: `1px solid ${D.line}` }}
              >
                {o.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={o.image}
                    alt={o.name || `Product ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={D.muted}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <MonoLabel>Product photo</MonoLabel>
                <MediaUploader
                  kind="photos"
                  urls={o.image ? [o.image] : []}
                  onChange={(urls) => updateOffering(i, { image: urls[0] || "" })}
                  max={1}
                />
              </div>
            </div>

            <Field
              label="Product name"
              counter={`${(o.name || "").length}/56`}
            >
              <input
                className={inputBase}
                style={inputStyle}
                value={o.name}
                maxLength={56}
                onChange={(e) => updateOffering(i, { name: e.target.value.slice(0, 56) })}
                placeholder="Pudina Chatpata"
              />
            </Field>

            <Field
              label="Pack / variant"
              counter={`${(o.pack || "").length}/64`}
            >
              <input
                className={inputBase}
                style={inputStyle}
                value={o.pack}
                maxLength={64}
                onChange={(e) => updateOffering(i, { pack: e.target.value.slice(0, 64) })}
                placeholder="Mint finishing sprinkle · 30g"
              />
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Price From (₹)">
                <input
                  type="number"
                  inputMode="numeric"
                  className={inputBase}
                  style={{
                    ...inputStyle,
                    opacity: o.priceOnEnquiry ? 0.5 : 1,
                  }}
                  value={o.priceMin}
                  disabled={o.priceOnEnquiry}
                  onChange={(e) => updateOffering(i, { priceMin: e.target.value })}
                  placeholder="48"
                />
              </Field>
              <Field label="Price To (₹)">
                <input
                  type="number"
                  inputMode="numeric"
                  className={inputBase}
                  style={{
                    ...inputStyle,
                    opacity: o.priceOnEnquiry ? 0.5 : 1,
                  }}
                  value={o.priceMax}
                  disabled={o.priceOnEnquiry}
                  onChange={(e) => updateOffering(i, { priceMax: e.target.value })}
                  placeholder="62"
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: D.ink2 }}>
              <input
                type="checkbox"
                checked={o.priceOnEnquiry}
                onChange={(e) => updateOffering(i, { priceOnEnquiry: e.target.checked })}
              />
              <span className="text-xs">Price on enquiry (custom recipes)</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <Field label="MOQ">
                <input
                  className={inputBase}
                  style={inputStyle}
                  value={o.moq}
                  onChange={(e) => updateOffering(i, { moq: e.target.value })}
                  placeholder="5"
                />
              </Field>
              <Field label="Tag (optional)">
                <select
                  className={inputBase}
                  style={inputStyle}
                  value={o.tag || "None"}
                  onChange={(e) =>
                    updateOffering(i, { tag: e.target.value === "None" ? "" : e.target.value })
                  }
                >
                  {PRODUCT_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </Card>
      ))}

      <button
        type="button"
        onClick={addOffering}
        className="w-full py-3 rounded-xl text-sm font-semibold"
        style={{
          background: "transparent",
          border: `1px dashed ${D.line2}`,
          color: D.brandDeep,
        }}
      >
        + Add another product
      </button>
    </div>
  );
}

function PhotosTab({ photos, onPhotos, facilityPhotos, onFacility }) {
  return (
    <div className="space-y-3 py-2">
      <Card>
        <MonoLabel counter={`${photos.length} / 6`}>Products</MonoLabel>
        <p className="text-[11px] mb-3" style={{ color: D.muted }}>
          Drag to reorder · first photo is your cover.
        </p>
        <MediaUploader kind="photos" urls={photos} onChange={onPhotos} max={6} />
      </Card>

      <Card>
        <MonoLabel counter={`${facilityPhotos.length} / 4`}>Facility</MonoLabel>
        <p className="text-[11px] mb-3" style={{ color: D.muted }}>
          Show the workspace — buyers trust suppliers they can see.
        </p>
        <MediaUploader
          kind="photos"
          urls={facilityPhotos}
          onChange={onFacility}
          max={4}
        />
      </Card>
    </div>
  );
}

function emptyOffering() {
  return {
    name: "",
    pack: "",
    priceMin: "",
    priceMax: "",
    priceOnEnquiry: false,
    moq: "",
    lead: "",
    tag: "",
    image: "",
  };
}
