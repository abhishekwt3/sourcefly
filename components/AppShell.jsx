"use client";

import { useCallback, useMemo, useState } from "react";
import { COLORS } from "@/lib/theme";
import BottomNav from "@/components/BottomNav";
import SupplierPDP from "@/components/SupplierPDP";
import DiscoverScreen from "@/components/screens/DiscoverScreen";
import SavedScreen from "@/components/screens/SavedScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import ListScreen from "@/components/screens/ListScreen";
import PostNeedScreen from "@/components/screens/PostNeedScreen";

export default function AppShell({ suppliers }) {
  const [tab, setTab] = useState("discover");
  const [selectedId, setSelectedId] = useState(null);
  const [listMode, setListMode] = useState(false);
  const [postNeedMode, setPostNeedMode] = useState(false);
  const [savedIds, setSavedIds] = useState([]);

  const toggleSave = useCallback((id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const selected = useMemo(
    () => (selectedId == null ? null : suppliers.find((s) => s.id === selectedId)),
    [selectedId, suppliers]
  );

  const switchTab = (id) => {
    setSelectedId(null);
    setListMode(false);
    setPostNeedMode(false);
    setTab(id);
  };

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        maxWidth: "430px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <header className="flex items-center px-5 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: COLORS.amber }}
          >
            <span className="font-bold text-xs pf" style={{ color: COLORS.onAccent }}>
              K
            </span>
          </div>
          <span className="pf font-bold" style={{ color: COLORS.text, fontSize: "17px" }}>
            Kendra
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {selected ? (
          <SupplierPDP
            supplier={selected}
            onBack={() => setSelectedId(null)}
            onSave={toggleSave}
            saved={savedIds.includes(selected.id)}
          />
        ) : listMode ? (
          <ListScreen onBack={() => setListMode(false)} />
        ) : postNeedMode ? (
          <PostNeedScreen onBack={() => setPostNeedMode(false)} />
        ) : (
          <>
            {tab === "discover" && (
              <DiscoverScreen
                suppliers={suppliers}
                onSelect={(s) => setSelectedId(s.id)}
                savedIds={savedIds}
                onSave={toggleSave}
              />
            )}
            {tab === "saved" && (
              <SavedScreen
                suppliers={suppliers}
                savedIds={savedIds}
                onSelect={(s) => setSelectedId(s.id)}
                onSave={toggleSave}
              />
            )}
            {tab === "profile" && (
              <ProfileScreen
                savedCount={savedIds.length}
                onListBusiness={() => setListMode(true)}
                onPostNeed={() => setPostNeedMode(true)}
              />
            )}
          </>
        )}
      </main>

      <BottomNav tab={tab} onTab={switchTab} />
    </div>
  );
}
