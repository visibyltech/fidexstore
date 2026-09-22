import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sql = getSql();

  const [category] = await sql`
    SELECT id, name, slug, image, parent_id FROM categories WHERE slug = ${slug}
  `;

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ category });
}
