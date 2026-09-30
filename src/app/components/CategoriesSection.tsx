"use client";

import { useEffect, useState } from "react";
import ProductImage from "./ProductImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ApiCategory } from "@/types/api";
import { groupCategories } from "@/lib/categories";
import SectionHeading from "./SectionHeading";

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

  // Top-level categories only; subcategories are reachable from the shop page.
  const groups = groupCategories(categories);

  if (groups.length === 0) return null;

  return (
    <section className="px-4 pt-16 md:px-10 md:pt-24">
      <SectionHeading title="Shop by category" href="/shop" linkLabel="Shop all" />

      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-4">
        {groups.map(({ parent, children }) => (
          <Link key={parent.slug} href={`/shop?category=${parent.slug}`} className="group">
            <div className="relative aspect-3/4 overflow-hidden bg-cream">
              <ProductImage
                  src={parent.image}
                  alt={parent.name}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-base font-medium text-ink transition group-hover:text-gold">
                {parent.name}
              </span>
              <ArrowRight className="h-4 w-4 text-ink/40 transition group-hover:translate-x-0.5 group-hover:text-gold" />
            </div>
            {children.length > 0 && (
              <p className="mt-1 text-sm text-ink/50">{children.map((c) => c.name).join(", ")}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
