"use client";

import { COLORS } from "@/lib/theme";
import ProfilePageShell from "@/components/ProfilePageShell";

const APP_VERSION = "1.0.0";

function ChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={COLORS.muted}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function AboutKendraPage() {
  return (
    <ProfilePageShell title="About Kendra">
      <div className="flex flex-col items-center text-center pt-6 pb-8 space-y-5">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: COLORS.amber }}
        >
          <span
            className="font-bold text-2xl pf"
            style={{ color: COLORS.onAccent }}
          >
            K
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-lg font-bold" style={{ color: COLORS.text }}>
            Kendra
          </h1>
          <p className="text-sm" style={{ color: COLORS.muted }}>
            The D2C-only sourcing platform
          </p>
        </div>

        <p
          className="text-sm leading-relaxed max-w-xs"
          style={{ color: COLORS.text2 }}
        >
          Kendra connects D2C brands with verified Indian manufacturers and
          suppliers. Every listing is manually reviewed — no cold calls, no
          spam, just qualified partners ready to work with
          direct-to-consumer businesses.
        </p>

        <p className="text-xs" style={{ color: COLORS.muted }}>
          Version {APP_VERSION}
        </p>
      </div>

      <div
        className="space-y-2 pt-4"
        style={{ borderTop: `1px solid ${COLORS.border}` }}
      >
        <button
          type="button"
          className="w-full rounded-2xl px-4 py-3.5 flex items-center justify-between"
          style={{ background: COLORS.surface }}
        >
          <span className="text-sm" style={{ color: COLORS.text }}>
            Terms of Use
          </span>
          <ChevronRight />
        </button>
        <button
          type="button"
          className="w-full rounded-2xl px-4 py-3.5 flex items-center justify-between"
          style={{ background: COLORS.surface }}
        >
          <span className="text-sm" style={{ color: COLORS.text }}>
            Privacy Policy
          </span>
          <ChevronRight />
        </button>
      </div>
    </ProfilePageShell>
  );
}
