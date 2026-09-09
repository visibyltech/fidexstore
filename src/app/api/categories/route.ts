import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET() {
  const sql = getSql();
  const categories = await sql`
    SELECT id, name, slug, image FROM categories ORDER BY name ASC
  `;
  return NextResponse.json({ categories });
}
