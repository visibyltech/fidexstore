"use client";

import { Star } from "lucide-react";
import type { ApiCategory } from "@/types/api";
import { groupCategories } from "@/lib/categories";

type ShopSidebarProps = {
  categories: ApiCategory[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  minRating: number | null;
  onMinRatingChange: (value: number | null) => void;
};

const RATING_OPTIONS = [4.5, 4, 3];

const ShopSidebar = ({
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minRating,
  onMinRatingChange,
}: ShopSidebarProps) => {
  const categoryGroups = groupCategories(categories);

  const categoryButton = (slug: string | null, label: string, nested = false) => {
    const active = selectedCategory === slug;
    return (
      <button
        key={slug ?? "all"}
        onClick={() => onSelectCategory(slug)}
        aria-pressed={active}
        className={`flex w-full items-center justify-between py-1.5 text-left text-sm transition hover:text-gold ${
          nested ? "pl-4" : ""
        } ${active ? "font-semibold text-ink" : "text-ink/60"}`}
      >
        {label}
        {active && <span className="h-1.5 w-1.5 bg-gold" aria-hidden />}
      </button>
    );
  };

  return (
    <aside className="w-full shrink-0 md:w-56">
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Category</legend>
        <div className="mt-3">
          {categoryButton(null, "All products")}
          {categoryGroups.map(({ parent, children }) => (
            <div key={parent.slug}>
              {categoryButton(parent.slug, parent.name)}
              {children.map((category) => categoryButton(category.slug, category.name, true))}
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8 border-t border-ink/10 pt-6">
        <legend className="float-left w-full text-sm font-semibold text-ink">Price (₦)</legend>
        <div className="clear-both flex items-center gap-2 pt-3">
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="Min"
            aria-label="Minimum price"
            className="w-full border border-ink/20 px-3 py-2 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none"
          />
          <span className="text-ink/40">to</span>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Max"
            aria-label="Maximum price"
            className="w-full border border-ink/20 px-3 py-2 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none"
          />
        </div>
      </fieldset>

      <fieldset className="mt-8 border-t border-ink/10 pt-6">
        <legend className="float-left w-full text-sm font-semibold text-ink">Customer rating</legend>
        <div className="clear-both flex flex-col gap-2.5 pt-3 text-sm text-ink/70">
          {RATING_OPTIONS.map((rating) => (
            <label key={rating} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={minRating === rating}
                onChange={() => onMinRatingChange(minRating === rating ? null : rating)}
                className="accent-gold"
              />
              <Star className="h-3.5 w-3.5 fill-ink text-ink" />
              {rating} and up
            </label>
          ))}
        </div>
      </fieldset>
    </aside>
  );
};

export default ShopSidebar;
