"use client";

import { COLORS } from "@/lib/theme";

const STAR_AMBER = "#8B6A3A";

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24"
      fill={STAR_AMBER} stroke={STAR_AMBER} strokeWidth="1.7" strokeLinejoin="round"
    >
      <path d="M12 3l2.7 5.6L20 9.4l-4 3.9.9 5.5L12 16.2 7.1 18.8 8 13.3l-4-3.9 5.3-.8z" />
    </svg>
  );
}

function computeScore(criteria, count) {
  if (!count || !criteria?.length) return null;
  const total = criteria.reduce((s, c) => s + c.count, 0);
  const max = count * criteria.length;
  return (4 + total / max).toFixed(1);
}

export default function RecommendChip({ count, topCriteria = [], onOpen }) {
  const score = computeScore(topCriteria, count);

  return (
    <button
      onClick={onOpen}
      className="w-full text-left rounded-2xl p-3.5 active:scale-[0.99] transition-transform flex items-center gap-3"
      style={{ background: "#FFFFFF", border: "1px solid rgba(26,23,20,0.08)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold"
        style={{ background: `${COLORS.amber}18`, color: "#6B4F24", fontSize: 17 }}
      >
        {score ?? count}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-[13.5px] font-semibold" style={{ color: "#3A342D" }}>
            {count > 0
              ? `Recommended by ${count} ${count === 1 ? "buyer" : "buyers"}`
              : "No recommendations yet"}
          </p>
          {count > 0 && (
            <span className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} />)}
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: "#75695B" }}>
          Tap to see why buyers like them
        </p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#75695B" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  );
}
