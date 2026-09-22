import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET() {
  const sql = getSql();
  const categories = await sql`
    SELECT id, name, slug, image, parent_id FROM categories ORDER BY parent_id NULLS FIRST, name ASC
  `;
  return NextResponse.json({ categories });
}
