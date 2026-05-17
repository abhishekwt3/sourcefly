"use client";

import { useMemo, useState } from "react";
import { COLORS } from "@/lib/theme";
import SupplierCard from "../SupplierCard";
import FilterOverlay from "../FilterOverlay";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.muted} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function FilterIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

const DEFAULT_FILTERS = { cat: "All", location: "", lowMoq: false, tags: [], certifications: [] };

export default function DiscoverScreen({ suppliers = [], onSelect, savedIds, onSave }) {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilter, setShowFilter] = useState(false);

  // Derive unique city names from supplier locations
  const locations = useMemo(() => {
    const cities = new Set(
      suppliers.map((s) => (s.location || "").split(",")[0].trim()).filter(Boolean)
    );
    return Array.from(cities).sort();
  }, [suppliers]);

  const results = useMemo(() => {
    const query = q.toLowerCase();
    const { cat, location, lowMoq, tags, certifications } = filters;
    return suppliers.filter((s) => {
      if (cat !== "All" && s.category !== cat) return false;
      if (location && !s.location?.toLowerCase().includes(location.toLowerCase())) return false;
      if (lowMoq && !s.lowMoq) return false;
      if (tags.length > 0 && !tags.every((t) => s.tags?.includes(t))) return false;
      if (certifications.length > 0 && !certifications.every((c) => s.certifications?.includes(c))) return false;
      if (!query) return true;
      return [s.name, s.about, ...(s.tags ?? [])].some((x) =>
        String(x).toLowerCase().includes(query)
      );
    });
  }, [filters, q, suppliers]);

  const activeCount =
    (filters.cat !== "All" ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.lowMoq ? 1 : 0) +
    filters.tags.length +
    filters.certifications.length;

  const hasFilters = activeCount > 0 || q !== "";

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setQ("");
  };

  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="px-4 pt-5 pb-3">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-4">
          <h1
            className="serif font-semibold"
            style={{ color: COLORS.ink, fontSize: 26, letterSpacing: "-0.4px", lineHeight: "28.6px" }}
          >
            Find suppliers
          </h1>
          <span
            className="mono uppercase"
            style={{ color: COLORS.muted, fontSize: 11, letterSpacing: "1px" }}
          >
            {suppliers.length} verified
          </span>
        </div>

        {/* Search + Filter row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              className="w-full rounded-2xl pl-10 pr-10 py-3 text-sm focus:outline-none"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.text }}
              placeholder="Search suppliers, materials, tags…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: COLORS.bg }}
                aria-label="Clear search"
              >
                <ClearIcon />
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            type="button"
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-1.5 px-4 rounded-2xl text-sm font-medium flex-shrink-0 transition-colors"
            style={{
              background: activeCount > 0 ? COLORS.text : COLORS.surface,
              color: activeCount > 0 ? COLORS.bg : COLORS.text,
              border: `1px solid ${activeCount > 0 ? COLORS.text : COLORS.border}`,
            }}
          >
            <FilterIcon color={activeCount > 0 ? COLORS.bg : COLORS.text} />
            {activeCount > 0 ? `Filter · ${activeCount}` : "Filter"}
          </button>
        </div>

        {/* Clear all */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="mt-2 text-xs font-medium underline underline-offset-2"
            style={{ color: COLORS.muted }}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <p className="text-xs mb-3 px-1" style={{ color: COLORS.muted }}>
          {results.length === 0
            ? "No suppliers match"
            : `${results.length} ${results.length === 1 ? "supplier" : "suppliers"}`}
        </p>

        {results.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl"
            style={{ background: COLORS.surface }}
          >
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm font-medium" style={{ color: COLORS.text }}>
              Nothing matches those filters
            </p>
            <p className="text-xs mt-1 max-w-xs" style={{ color: COLORS.muted }}>
              Try adjusting your filters or search term.
            </p>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-medium"
                style={{ background: COLORS.text, color: COLORS.bg }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((s) => (
              <SupplierCard
                key={s.id}
                supplier={s}
                onClick={onSelect}
                onSave={onSave}
                saved={savedIds.includes(s.id)}
              />
            ))}
          </div>
        )}
      </div>

      <FilterOverlay
        open={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={results.length}
        locations={locations}
      />
    </div>
  );
}
