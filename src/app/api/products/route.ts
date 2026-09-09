import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

const SORT_COLUMNS: Record<string, string> = {
  newest: "p.created_at DESC",
  price_asc: "p.price ASC",
  price_desc: "p.price DESC",
  rating: "p.rating DESC",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const onSale = searchParams.get("onSale");
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
  const offset = (page - 1) * limit;

  const conditions = ["p.is_active = true"];
  const values: unknown[] = [];

  if (category) {
    values.push(category);
    conditions.push(`c.slug = $${values.length}`);
  }
  if (search) {
    values.push(`%${search}%`);
    conditions.push(`p.name ILIKE $${values.length}`);
  }
  if (minPrice && Number.isFinite(Number(minPrice))) {
    values.push(Number(minPrice));
    conditions.push(`p.price >= $${values.length}`);
  }
  if (maxPrice && Number.isFinite(Number(maxPrice))) {
    values.push(Number(maxPrice));
    conditions.push(`p.price <= $${values.length}`);
  }
  if (onSale === "true") {
    conditions.push("p.old_price IS NOT NULL");
  }

  const orderBy = SORT_COLUMNS[sort] ?? SORT_COLUMNS.newest;

  values.push(limit);
  const limitIndex = values.length;
  values.push(offset);
  const offsetIndex = values.length;

  const query = `
    SELECT p.id, p.name, p.slug, p.image, p.price, p.old_price,
           p.rating, p.reviews_count, c.slug AS category, c.name AS category_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE ${conditions.join(" AND ")}
    ORDER BY ${orderBy}
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
  `;

  const sql = getSql();
  const products = await sql.query(query, values);

  return NextResponse.json({ products, page, limit });
}
