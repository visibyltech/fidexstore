"use client";

import { useEffect, useState } from "react";
import ProductPanel from "./ProductPanel";
import { toShopProduct, ShopProduct } from "./shop/ShopProductCard";
import type { ApiProduct } from "@/types/api";

type ProductRailProps = {
  heading: string;
  subtitle?: string;
  // Query string for /api/products, e.g. "sort=newest&limit=4".
  query: string;
  href?: string;
};

const ProductRail = ({ heading, subtitle, query, href }: ProductRailProps) => {
  const [products, setProducts] = useState<ShopProduct[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/products?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const items: ApiProduct[] = data.products ?? [];
        setProducts(items.map(toShopProduct));
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return <ProductPanel heading={heading} subtitle={subtitle} products={products} href={href} />;
};

export default ProductRail;
