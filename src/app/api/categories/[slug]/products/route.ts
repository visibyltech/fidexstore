import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sql = getSql();

  const [category] = await sql`SELECT id, name, slug FROM categories WHERE slug = ${slug}`;
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const products = await sql`
    SELECT id, name, slug, image, price, old_price, rating, reviews_count
    FROM products
    WHERE category_id = ${category.id} AND is_active = true
    ORDER BY created_at DESC
  `;

  return NextResponse.json({ category, products });
}
