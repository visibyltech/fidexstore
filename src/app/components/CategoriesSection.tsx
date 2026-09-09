"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ApiCategory } from "@/types/api";

const CategoriesSection = () => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCategories(data.categories ?? []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-10 mt-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-wide uppercase">Categories</h2>
        <p className="mt-2 text-sm text-white/50">
          Explore our range of trusted, professionally vetted devices.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
        {categories.map((category) => (
          <Link key={category.slug} href={`/shop?category=${category.slug}`} className="text-center">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              {category.image && (
                <Image src={category.image} alt={category.name} fill className="object-cover" />
              )}
            </div>
            <p className="mt-2 text-xs font-medium tracking-wide text-white/70 uppercase">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
