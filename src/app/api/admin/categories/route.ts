import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function GET(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const sql = getSql();
  const categories = await sql`
    SELECT id, name, slug, image, created_at FROM categories ORDER BY id DESC
  `;
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const image = typeof body?.image === "string" ? body.image : null;
  const slug = typeof body?.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(name);

  if (!name || !slug) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const sql = getSql();
  const [existing] = await sql`SELECT id FROM categories WHERE slug = ${slug}`;
  if (existing) {
    return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
  }

  const [category] = await sql`
    INSERT INTO categories (name, slug, image)
    VALUES (${name}, ${slug}, ${image})
    RETURNING id, name, slug, image, created_at
  `;
  return NextResponse.json({ category }, { status: 201 });
}
