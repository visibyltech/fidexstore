"use client";

import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";

type ShopToolbarProps = {
  total: number;
  sort: string;
  onSortChange: (sort: string) => void;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const ShopToolbar = ({ total, sort, onSortChange }: ShopToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-black/5 px-5 py-3">
      <p className="text-sm text-black/60">
        Showing {total} of {total} products
      </p>

      <button className="flex items-center gap-2 rounded-md bg-black/10 px-4 py-2 text-sm font-medium transition hover:bg-black/15 md:hidden">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-black/60">
          Sort by:
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-md border border-black/10 bg-black/5 px-3 py-1.5 text-black focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 rounded-md bg-black/10 p-1">
          <div className="rounded bg-gold p-1.5 text-black">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <div className="rounded p-1.5 text-black/60">
            <List className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopToolbar;
