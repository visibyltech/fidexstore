"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ShopHeader from "./ShopHeader";
import ShopSidebar from "./ShopSidebar";
import ShopToolbar from "./ShopToolbar";
import ShopProductCard, { ShopProduct } from "./ShopProductCard";
import type { ApiCategory, ApiProduct } from "@/types/api";

const toShopProduct = (product: ApiProduct): ShopProduct => ({
  id: product.id,
  category: product.category_name,
  name: product.name,
  image: product.image ?? "",
  price: product.price,
  oldPrice: product.old_price ?? undefined,
  rating: Math.round(Number(product.rating)),
  reviews: product.reviews_count,
});

const ShopPageClient = () => {
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<string | null>(searchParams.get("category"));
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);

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
  }, [category, sort, minPrice, maxPrice]);

  const visibleProducts = minRating
    ? products.filter((product) => product.rating >= minRating)
    : products;

  return (
    <div className="pb-16">
      <ShopHeader />

      <div className="mx-10 mt-8 flex flex-col gap-8 md:flex-row">
        <ShopSidebar
          categories={categories}
          selectedCategory={category}
          onSelectCategory={setCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          minRating={minRating}
          onMinRatingChange={setMinRating}
        />

        <div className="flex-1">
          <ShopToolbar total={visibleProducts.length} sort={sort} onSortChange={setSort} />

          {loading ? (
            <p className="mt-8 text-center text-sm text-black/50">Loading products…</p>
          ) : visibleProducts.length === 0 ? (
            <p className="mt-8 text-center text-sm text-black/50">No products match your filters.</p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
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
