"use client";

import { useEffect, useState } from "react";
import ProductPanel, { Product } from "./ProductPanel";
import type { ApiProduct } from "@/types/api";

const Devicesection = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/products?sort=rating&limit=5")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const items: ApiProduct[] = data.products ?? [];
        setProducts(
          items.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image ?? "",
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProductPanel
      heading="Best Sellers"
      subtitle="Explore our diverse range of devices trusted by thousands."
      products={products}
      ctaLabel="Shop Now"
    />
  );
};

export default Devicesection;
