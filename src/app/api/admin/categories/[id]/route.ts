import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId)) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

  const sql = getSql();
  const [existing] = await sql`SELECT id, name, slug, image FROM categories WHERE id = ${categoryId}`;
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" && body.name.trim() ? body.name.trim() : existing.name;
  const slug =
    typeof body?.slug === "string" && body.slug.trim() ? slugify(body.slug) : existing.slug;
  const image = typeof body?.image === "string" ? body.image : existing.image;

  if (slug !== existing.slug) {
    const [slugTaken] = await sql`
      SELECT id FROM categories WHERE slug = ${slug} AND id != ${categoryId}
    `;
    if (slugTaken) {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
    }
  }

  const [category] = await sql`
    UPDATE categories SET name = ${name}, slug = ${slug}, image = ${image}
    WHERE id = ${categoryId}
    RETURNING id, name, slug, image
  `;
  return NextResponse.json({ category });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId)) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

  const sql = getSql();
  const [inUse] = await sql`SELECT id FROM products WHERE category_id = ${categoryId} LIMIT 1`;
  if (inUse) {
    return NextResponse.json(
      { error: "Cannot delete a category that still has products" },
      { status: 409 }
    );
  }

  const result = await sql`DELETE FROM categories WHERE id = ${categoryId} RETURNING id`;
  if (!result.length) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
