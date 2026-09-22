import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sql = getSql();

  const [category] = await sql`SELECT id, name, slug, parent_id FROM categories WHERE slug = ${slug}`;
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // A top-level category (e.g. "New Shoes") has no products of its own —
  // its leaf categories (e.g. "Women") do. Pull products from every leaf
  // under it as well as the category itself, so linking to a parent slug
  // shows everything beneath it.
  const products = await sql`
    SELECT p.id, p.name, p.slug, p.image, p.price, p.old_price, p.rating, p.reviews_count
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE (c.id = ${category.id} OR c.parent_id = ${category.id}) AND p.is_active = true
    ORDER BY p.created_at DESC
  `;

  return NextResponse.json({ category, products });
}
