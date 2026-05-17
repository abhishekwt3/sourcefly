import { COLORS } from "@/lib/theme";
import { IconDiscover, IconSaved, IconProfile } from "./Icons";

export const NAV_ITEMS = [
  { id: "discover", label: "Discover", Icon: IconDiscover },
  { id: "saved", label: "Saved", Icon: IconSaved },
  { id: "profile", label: "Profile", Icon: IconProfile },
];

export default function BottomNav({ tab, onTab }) {
  return (
    <nav
      className="flex-shrink-0 flex items-center justify-around px-2 pt-3"
      style={{
        background: COLORS.surface,
        borderTop: `1px solid ${COLORS.border}`,
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
      }}
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => onTab(id)}
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all"
            style={{ background: active ? `${COLORS.amber}18` : "transparent" }}
            aria-current={active ? "page" : undefined}
          >
            <Icon active={active} />
            <span
              className="text-xs font-medium"
              style={{ color: active ? COLORS.amber : COLORS.muted }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
