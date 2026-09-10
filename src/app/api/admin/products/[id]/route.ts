import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const sql = getSql();
  const [product] = await sql`
    SELECT id, name, slug, description, image, price, old_price, stock, is_active, category_id
    FROM products WHERE id = ${productId}
  `;
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const sql = getSql();
  const [existing] = await sql`SELECT * FROM products WHERE id = ${productId}`;
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);

  if (body?.categoryId != null) {
    const categoryId = Number(body.categoryId);
    if (!Number.isInteger(categoryId)) {
      return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
    }
    const [category] = await sql`SELECT id FROM categories WHERE id = ${categoryId}`;
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
  }

  const name = typeof body?.name === "string" && body.name.trim() ? body.name.trim() : existing.name;
  const categoryId = body?.categoryId != null ? Number(body.categoryId) : existing.category_id;
  const slug = typeof body?.slug === "string" && body.slug.trim() ? slugify(body.slug) : existing.slug;
  const description = typeof body?.description === "string" ? body.description : existing.description;
  const image = typeof body?.image === "string" ? body.image : existing.image;
  const price = body?.price != null && Number.isFinite(Number(body.price)) ? Number(body.price) : existing.price;
  const oldPrice =
    body?.oldPrice !== undefined
      ? body.oldPrice === null
        ? null
        : Number.isFinite(Number(body.oldPrice))
          ? Number(body.oldPrice)
          : existing.old_price
      : existing.old_price;
  const stock = Number.isInteger(body?.stock) ? body.stock : existing.stock;
  const isActive = typeof body?.isActive === "boolean" ? body.isActive : existing.is_active;

  if (slug !== existing.slug) {
    const [slugTaken] = await sql`SELECT id FROM products WHERE slug = ${slug} AND id != ${productId}`;
    if (slugTaken) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
  }

  const [product] = await sql`
    UPDATE products SET
      category_id = ${categoryId},
      name = ${name},
      slug = ${slug},
      description = ${description},
      image = ${image},
      price = ${price},
      old_price = ${oldPrice},
      stock = ${stock},
      is_active = ${isActive},
      updated_at = now()
    WHERE id = ${productId}
    RETURNING id, name, slug, description, image, price, old_price, stock, is_active, category_id
  `;
  return NextResponse.json({ product });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const sql = getSql();
  const result = await sql`DELETE FROM products WHERE id = ${productId} RETURNING id`;
  if (!result.length) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
