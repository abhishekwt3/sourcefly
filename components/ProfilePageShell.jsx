"use client";

import { useRouter } from "next/navigation";
import { COLORS } from "@/lib/theme";

function BackIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={COLORS.text}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export default function ProfilePageShell({ title, children }) {
  const router = useRouter();
  return (
    <div
      style={{
        background: COLORS.bg,
        minHeight: "100dvh",
        maxWidth: "430px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        className="flex items-center px-4 pt-4 pb-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${COLORS.border}` }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: COLORS.surface }}
        >
          <BackIcon />
        </button>
        <span
          className="flex-1 text-center font-semibold text-sm"
          style={{ color: COLORS.text }}
        >
          {title}
        </span>
        <div className="w-9" />
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
    </div>
  );
}
