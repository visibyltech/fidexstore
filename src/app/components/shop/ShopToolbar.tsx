"use client";

import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";

type ShopToolbarProps = {
  total: number;
  sort: string;
  onSortChange: (sort: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onToggleFilters: () => void;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

const ShopToolbar = ({
  total,
  sort,
  onSortChange,
  view,
  onViewChange,
  onToggleFilters,
}: ShopToolbarProps) => {
  const viewButton = (value: "grid" | "list", label: string, Icon: typeof List) => (
    <button
      onClick={() => onViewChange(value)}
      aria-label={label}
      aria-pressed={view === value}
      className={`p-2 transition ${view === value ? "bg-ink text-white" : "text-ink/50 hover:text-ink"}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
      <p className="text-sm text-ink/60">
        {total} {total === 1 ? "product" : "products"}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 border border-ink/20 px-3 py-2 text-sm font-medium md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        <label className="flex items-center gap-2 text-sm text-ink/60">
          <span className="hidden sm:inline">Sort by</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="hidden items-center border border-ink/20 sm:flex">
          {viewButton("grid", "Grid view", LayoutGrid)}
          {viewButton("list", "List view", List)}
        </div>
      </div>
    </div>
  );
};

export default ShopToolbar;
