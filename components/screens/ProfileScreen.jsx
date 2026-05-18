"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/lib/theme";

function Chevron({ color }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: COLORS.surface }}>
      <p className="text-xl font-semibold" style={{ color: COLORS.text }}>
        {value}
      </p>
      <p
        className="text-[10px] uppercase tracking-wider mt-1"
        style={{ color: COLORS.muted }}
      >
        {label}
      </p>
    </div>
  );
}

function Row({ label, hint, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl px-4 py-3.5 flex items-center justify-between"
      style={{ background: COLORS.surface }}
    >
      <div className="text-left min-w-0">
        <span className="text-sm" style={{ color: COLORS.text }}>
          {label}
        </span>
        {hint && (
          <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>
            {hint}
          </p>
        )}
      </div>
      <Chevron color={COLORS.muted} />
    </button>
  );
}

export default function ProfileScreen({ savedCount = 0, onListBusiness, onPostNeed }) {
  const router = useRouter();
  const [me, setMe] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setMe(d?.user || null)).catch(() => {});
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    router.refresh();
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4 pb-8"
      style={{ background: COLORS.bg }}
    >
      {/* Identity card */}
      {me ? (
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: COLORS.surface }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg"
            style={{ background: COLORS.amber, color: COLORS.onAccent }}
          >
            {(me.name || me.email || me.phone || "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: COLORS.text }}>
              {me.name || "Add your name"}
            </p>
            <p className="text-xs" style={{ color: COLORS.muted }}>
              {me.role === "SELLER" ? "Seller" : "Buyer"} · {me.phone || me.email}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-xs font-medium underline underline-offset-2"
            style={{ color: COLORS.muted }}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => router.push("/auth/phone?next=/")}
          className="w-full rounded-2xl p-4 flex items-center justify-between"
          style={{ background: COLORS.amber }}
        >
          <span className="font-semibold text-sm" style={{ color: COLORS.onAccent }}>
            Sign in / Sign up
          </span>
          <Chevron color={COLORS.onAccent} />
        </button>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Stat value={savedCount} label="Saved" />
        <Stat value={0} label="Requirements" />
      </div>

      {/* Role-specific CTA */}
      {me?.role === "SELLER" && me?.supplierStatus ? (
        <button
          type="button"
          onClick={() => router.push("/seller/manage")}
          className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${COLORS.green}1F` }}
          >
            🏭
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: COLORS.text }}>
              Manage your listing
            </p>
            <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>
              Edit details, offerings, and media.
            </p>
          </div>
          <Chevron color={COLORS.muted} />
        </button>
      ) : me?.role === "BUYER" ? (
        <button
          type="button"
          onClick={() => onPostNeed?.()}
          className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${COLORS.amber}1F` }}
          >
            📝
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: COLORS.text }}>
              Post a requirement
            </p>
            <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>
              Verified D2C suppliers reach out on WhatsApp.
            </p>
          </div>
          <Chevron color={COLORS.muted} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (!me) {
              router.push("/auth/phone?next=/onboarding/role");
              return;
            }
            if (me.role === "SELLER") router.push("/seller/manage");
            else router.push("/onboarding/role");
          }}
          className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${COLORS.amber}1F` }}
          >
            🏭
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: COLORS.text }}>
              Are you a supplier?
            </p>
            <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>
              List your business — manual review, free to apply.
            </p>
          </div>
          <Chevron color={COLORS.muted} />
        </button>
      )}

      {/* Links */}
      <div className="space-y-2">
        <Row label="Account settings" onClick={() => router.push("/profile/settings")} />
        <Row label="Help & support" onClick={() => router.push("/profile/help")} />
        <Row label="About Kendra" hint="The D2C-only sourcing platform" onClick={() => router.push("/profile/about")} />
      </div>
    </div>
  );
}
