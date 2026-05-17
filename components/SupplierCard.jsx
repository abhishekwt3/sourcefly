import { COLORS } from "@/lib/theme";

const D = {
  cream: "#F6F3EC",
  card: "#FFFFFF",
  ink: "#1A1714",
  ink2: "#3A342D",
  muted: "#75695B",
  brand: "#8B6A3A",
  brandDeep: "#6B4F24",
  brandTint: "#F4EFE5",
  olive: "#4F6B3A",
  oliveDeep: "#3A5226",
  oliveTint: "#E6EDD9",
  line: "rgba(26,23,20,0.08)",
  line2: "rgba(26,23,20,0.14)",
};

function BookmarkIcon({ filled }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? D.brand : "none"}
      stroke={filled ? D.brand : D.muted}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill={D.brandDeep}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function StatBlock({ label, value }) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span
        className="mono uppercase"
        style={{
          color: D.muted,
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "0.8px",
        }}
      >
        {label}
      </span>
      <span
        className="mono"
        style={{
          color: D.ink2,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.3px",
        }}
      >
        {value}
      </span>
    </span>
  );
}

function deriveFromPrice(offerings) {
  if (!Array.isArray(offerings) || offerings.length === 0) return null;
  const anyOnEnquiry = offerings.every((o) => o.priceOnEnquiry || (!o.priceMin && !o.priceMax));
  if (anyOnEnquiry) return "On enquiry";
  const mins = offerings
    .map((o) => Number(o.priceMin))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (mins.length === 0) return null;
  return `₹${Math.min(...mins)}`;
}

export default function SupplierCard({ supplier: s, onClick, onSave, saved }) {
  const handleSave = (e) => {
    e.stopPropagation();
    onSave(s.id);
  };

  const fromPrice = deriveFromPrice(s.offerings);
  const recCount = s.recommendCount ?? 0;
  const rating = s.rating ?? null; // schema doesn't have rating yet — null hides it
  const subtitle = [s.tagline, s.city || s.location?.split(",")[0]?.trim()]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(s)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(s);
        }
      }}
      className="w-full text-left rounded-2xl p-4 flex flex-col gap-3 active:scale-[0.99] transition-transform cursor-pointer"
      style={{ background: D.card, border: `1px solid ${D.line}` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center font-semibold flex-shrink-0 overflow-hidden"
          style={{
            background: s.accent || D.brand,
            color: "#FFFFFF",
            fontSize: 14,
            boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.18), 0 0 0 3px ${
              s.accent || D.brand
            }22`,
          }}
        >
          {s.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.logoUrl} alt={s.name} className="w-full h-full object-cover" />
          ) : (
            (s.name || "??").slice(0, 2).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p
              className="truncate"
              style={{
                color: D.ink,
                fontSize: 15.5,
                fontWeight: 600,
                letterSpacing: "-0.1px",
              }}
            >
              {s.name}
            </p>
            {s.lowMoq && (
              <span
                className="inline-flex items-center rounded-full"
                style={{
                  background: D.oliveTint,
                  color: D.oliveDeep,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                  padding: "2px 7px",
                }}
              >
                Low MOQ
              </span>
            )}
          </div>
          <p
            className="truncate mt-0.5"
            style={{ color: D.muted, fontSize: 12.5 }}
          >
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{ background: "transparent" }}
          aria-label={saved ? "Remove bookmark" : "Save supplier"}
        >
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      {/* Tag chips */}
      {s.tags?.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {s.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full"
              style={{
                background: D.brandTint,
                color: D.ink2,
                fontSize: 11.5,
                fontWeight: 500,
                padding: "3px 9px",
              }}
            >
              {t}
            </span>
          ))}
          {s.tags.length > 3 && (
            <span style={{ color: D.muted, fontSize: 11.5 }}>
              +{s.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {s.about && (
        <p
          className="line-clamp-2"
          style={{ color: D.ink2, fontSize: 13, lineHeight: "18.85px" }}
        >
          {s.about}
        </p>
      )}

      {/* Footer: stats + rating */}
      <div
        className="flex items-end justify-between pt-3"
        style={{ borderTop: `1px solid ${D.line}` }}
      >
        <div className="flex gap-5">
          {s.moq != null && <StatBlock label="MOQ" value={s.moq} />}
          {s.lead && <StatBlock label="Lead" value={s.lead} />}
          {fromPrice && <StatBlock label="From" value={fromPrice} />}
        </div>

        {(rating != null || recCount > 0) && (
          <div className="flex items-center gap-1">
            <StarIcon />
            <span
              className="mono"
              style={{
                color: D.ink,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {rating != null ? rating : recCount}
            </span>
            {recCount > 0 && rating != null && (
              <span
                className="mono"
                style={{ color: D.muted, fontSize: 11, fontWeight: 500 }}
              >
                ({recCount})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
