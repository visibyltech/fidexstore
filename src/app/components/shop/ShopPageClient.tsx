"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import ShopHeader from "./ShopHeader";
import ShopSidebar from "./ShopSidebar";
import ShopToolbar from "./ShopToolbar";
import ShopProductCard, { ShopProduct, toShopProduct } from "./ShopProductCard";
import type { ApiCategory, ApiProduct } from "@/types/api";

const ShopPageClient = () => {
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<string | null>(searchParams.get("category"));
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Re-sync from the URL when navigating here again (e.g. clicking a
  // different category or a new search from the navbar while already on
  // this page) — otherwise the stale local filter state would win. Adjusting
  // state during render (rather than in an effect) avoids an extra render pass.
  const [syncedParams, setSyncedParams] = useState(searchParams.toString());
  if (searchParams.toString() !== syncedParams) {
    setSyncedParams(searchParams.toString());
    setCategory(searchParams.get("category"));
    setSearch(searchParams.get("search") ?? "");
  }

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      params.set("sort", sort);
      params.set("limit", "50");

      setLoading(true);
      fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          const items: ApiProduct[] = data.products ?? [];
          setProducts(items.map(toShopProduct));
        })
        .catch((err) => {
          if (err.name !== "AbortError") setProducts([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [category, search, sort, minPrice, maxPrice]);

  const visibleProducts = minRating
    ? products.filter((product) => product.rating >= minRating)
    : products;

  return (
    <div>
      <ShopHeader title={search ? `Results for "${search}"` : "Shop everything"} />

      <div className="flex flex-col gap-8 px-4 pt-8 md:flex-row md:gap-12 md:px-10">
        <div className={mobileFiltersOpen ? "block" : "hidden md:block"}>
          <ShopSidebar
            categories={categories}
            selectedCategory={category}
            onSelectCategory={(slug) => {
              setCategory(slug);
              setMobileFiltersOpen(false);
            }}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            minRating={minRating}
            onMinRatingChange={setMinRating}
          />
        </div>

        <div className="flex-1">
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mb-4 flex items-center gap-1 text-sm text-ink/60 hover:text-gold"
            >
              <X className="h-3.5 w-3.5" /> Clear search
            </button>
          )}

          <ShopToolbar
            total={visibleProducts.length}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
            onToggleFilters={() => setMobileFiltersOpen((v) => !v)}
          />

          {loading ? (
            <p className="mt-8 text-sm text-ink/50">Loading products…</p>
          ) : visibleProducts.length === 0 ? (
            <p className="mt-8 text-sm text-ink/60">Nothing matches those filters. Try widening the price range or picking another category.</p>
          ) : view === "list" ? (
            <div className="mt-6 flex flex-col gap-4">
              {visibleProducts.map((product) => (
                <ShopProductCard key={product.id} product={product} layout="list" />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 md:gap-x-4">
              {visibleProducts.map((product) => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPageClient;
