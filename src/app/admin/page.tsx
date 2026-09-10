"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [counts, setCounts] = useState<{ products: number; categories: number } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((res) => res.json()),
      fetch("/api/admin/categories").then((res) => res.json()),
    ]).then(([products, categories]) => {
      setCounts({
        products: products.products?.length ?? 0,
        categories: categories.categories?.length ?? 0,
      });
    });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Link href="/admin/products" className="rounded-2xl bg-white/5 p-6 transition hover:bg-white/10">
        <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">Products</p>
        <p className="mt-2 text-3xl font-semibold text-gold">{counts?.products ?? "…"}</p>
        <p className="mt-4 text-sm text-white/60">Manage products →</p>
      </Link>

      <Link href="/admin/categories" className="rounded-2xl bg-white/5 p-6 transition hover:bg-white/10">
        <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">Categories</p>
        <p className="mt-2 text-3xl font-semibold text-gold">{counts?.categories ?? "…"}</p>
        <p className="mt-4 text-sm text-white/60">Manage categories →</p>
      </Link>
    </div>
  );
}
