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
  const [existing] = await sql`
    SELECT id, name, slug, image, parent_id FROM categories WHERE id = ${categoryId}
  `;
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" && body.name.trim() ? body.name.trim() : existing.name;
  const slug =
    typeof body?.slug === "string" && body.slug.trim() ? slugify(body.slug) : existing.slug;
  const image = typeof body?.image === "string" ? body.image : existing.image;
  const parentId =
    body?.parent_id === undefined
      ? existing.parent_id
      : body.parent_id === null
        ? null
        : Number(body.parent_id);

  if (parentId !== null && !Number.isInteger(parentId)) {
    return NextResponse.json({ error: "Invalid parent_id" }, { status: 400 });
  }
  if (parentId === categoryId) {
    return NextResponse.json({ error: "A category cannot be its own parent" }, { status: 400 });
  }

  if (parentId !== null && parentId !== existing.parent_id) {
    const [hasChildren] = await sql`SELECT id FROM categories WHERE parent_id = ${categoryId} LIMIT 1`;
    if (hasChildren) {
      return NextResponse.json(
        { error: "This category already has subcategories — only two levels are supported" },
        { status: 400 }
      );
    }
    const [parent] = await sql`SELECT id, parent_id FROM categories WHERE id = ${parentId}`;
    if (!parent) {
      return NextResponse.json({ error: "Parent category not found" }, { status: 400 });
    }
    if (parent.parent_id !== null) {
      return NextResponse.json(
        { error: "Only two levels of categories are supported — pick a top-level parent" },
        { status: 400 }
      );
    }
  }

  if (slug !== existing.slug) {
    const [slugTaken] = await sql`
      SELECT id FROM categories WHERE slug = ${slug} AND id != ${categoryId}
    `;
    if (slugTaken) {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
    }
  }

  const [category] = await sql`
    UPDATE categories SET name = ${name}, slug = ${slug}, image = ${image}, parent_id = ${parentId}
    WHERE id = ${categoryId}
    RETURNING id, name, slug, image, parent_id
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
  const [hasChildren] = await sql`SELECT id FROM categories WHERE parent_id = ${categoryId} LIMIT 1`;
  if (hasChildren) {
    return NextResponse.json(
      { error: "Delete its subcategories first" },
      { status: 409 }
    );
  }

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
