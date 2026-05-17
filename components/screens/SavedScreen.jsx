import { COLORS } from "@/lib/theme";
import SupplierCard from "../SupplierCard";

export default function SavedScreen({ suppliers = [], savedIds, onSelect, onSave }) {
  const saved = suppliers.filter((s) => savedIds.includes(s.id));

  return (
    <div className="flex flex-col h-full px-4 py-4" style={{ background: COLORS.bg }}>
      <p className="font-semibold text-lg pf mb-1" style={{ color: COLORS.text }}>
        Saved
      </p>
      <p className="text-xs mb-4" style={{ color: COLORS.muted }}>
        {saved.length} supplier{saved.length !== 1 ? "s" : ""} saved
      </p>
      {saved.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-4xl mb-3">🔖</p>
          <p className="font-medium" style={{ color: COLORS.muted }}>
            Nothing saved yet
          </p>
          <p className="text-xs mt-1" style={{ color: COLORS.border2 }}>
            Tap the bookmark on any supplier card
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto space-y-3">
          {saved.map((s) => (
            <SupplierCard
              key={s.id}
              supplier={s}
              onClick={onSelect}
              onSave={onSave}
              saved
            />
          ))}
        </div>
      )}
    </div>
  );
}
