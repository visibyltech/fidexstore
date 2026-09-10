import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function GET(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const sql = getSql();
  const products = await sql`
    SELECT p.id, p.name, p.slug, p.description, p.image, p.price, p.old_price,
           p.rating, p.reviews_count, p.stock, p.is_active, p.category_id,
           c.slug AS category, c.name AS category_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ORDER BY p.created_at DESC
  `;
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const categoryId = Number(body?.categoryId);
  const price = Number(body?.price);

  if (!name || !Number.isInteger(categoryId) || !Number.isFinite(price)) {
    return NextResponse.json(
      { error: "name, categoryId and price are required" },
      { status: 400 }
    );
  }

  const slug = typeof body?.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(name);
  const description = typeof body?.description === "string" ? body.description : null;
  const image = typeof body?.image === "string" ? body.image : null;
  const oldPrice = body?.oldPrice != null && Number.isFinite(Number(body.oldPrice)) ? Number(body.oldPrice) : null;
  const stock = Number.isInteger(body?.stock) ? body.stock : 0;

  const sql = getSql();

  const [category] = await sql`SELECT id FROM categories WHERE id = ${categoryId}`;
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const [existingSlug] = await sql`SELECT id FROM products WHERE slug = ${slug}`;
  if (existingSlug) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
  }

  const [product] = await sql`
    INSERT INTO products (category_id, name, slug, description, image, price, old_price, stock)
    VALUES (${categoryId}, ${name}, ${slug}, ${description}, ${image}, ${price}, ${oldPrice}, ${stock})
    RETURNING id, name, slug, description, image, price, old_price, stock, is_active, category_id
  `;
  return NextResponse.json({ product }, { status: 201 });
}
