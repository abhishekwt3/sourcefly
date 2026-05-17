"use client";

import { useState } from "react";
import { COLORS } from "@/lib/theme";
import ProfilePageShell from "@/components/ProfilePageShell";

// Replace with real Kendra support WhatsApp number when available
const SUPPORT_WHATSAPP = "919999999999";

const FAQ = [
  {
    q: "How do I save suppliers?",
    a: "Tap the bookmark icon on any supplier card in the Discover tab. All saved suppliers appear in your Saved tab.",
  },
  {
    q: "How do I list my business?",
    a: 'Go to Profile → "Are you a supplier?" and complete the onboarding form. Manual review takes up to 48 hours — you\'ll be notified on WhatsApp.',
  },
  {
    q: "What does D2C-only mean?",
    a: "Kendra connects brands that sell direct-to-consumer with suppliers who work with D2C businesses — no resellers or distributors.",
  },
  {
    q: "How long does listing review take?",
    a: "Up to 48 hours. You'll receive a WhatsApp notification once your listing has been reviewed.",
  },
  {
    q: "How do I contact support?",
    a: "Use the button below to chat with the Kendra team directly on WhatsApp.",
  },
];

function ChevronDown() {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: COLORS.surface }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3"
      >
        <span className="text-sm font-medium" style={{ color: COLORS.text }}>
          {q}
        </span>
        <span
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          <ChevronDown />
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function HelpSupportPage() {
  return (
    <ProfilePageShell title="Help & Support">
      <div className="space-y-2 pb-24">
        {FAQ.map((item) => (
          <AccordionItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>

      <div
        className="fixed bottom-0 left-1/2"
        style={{
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "430px",
          padding: "16px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
          background: COLORS.bg,
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <a
          href={`https://wa.me/${SUPPORT_WHATSAPP}`}
          target="_blank"
          rel="noreferrer"
          className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
          style={{ background: "#25D366", color: "#fff" }}
        >
          <WhatsAppIcon />
          Chat with support on WhatsApp
        </a>
      </div>
    </ProfilePageShell>
  );
}
