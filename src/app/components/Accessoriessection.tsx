"use client";

import { useEffect, useState } from "react";
import ProductPanel, { Product } from "./ProductPanel";
import type { ApiProduct } from "@/types/api";

const Accessoriessection = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/products?onSale=true&limit=4")
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
      heading="Featured Deals"
      subtitle="Explore our diverse range of accessories for modern living."
      products={products}
      showDots
    />
  );
};

export default Accessoriessection;
