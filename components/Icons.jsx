import { COLORS } from "@/lib/theme";

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconDiscover({ active }) {
  return (
    <svg {...base} stroke={active ? COLORS.amber : COLORS.muted}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function IconPost({ active }) {
  return (
    <svg {...base} stroke={active ? COLORS.amber : COLORS.muted}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconSaved({ active }) {
  return (
    <svg
      {...base}
      fill={active ? COLORS.amber : "none"}
      stroke={active ? COLORS.amber : COLORS.muted}
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function IconProfile({ active }) {
  return (
    <svg {...base} stroke={active ? COLORS.amber : COLORS.muted}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
