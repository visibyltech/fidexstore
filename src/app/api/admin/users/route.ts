import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const sql = getSql();
  const users = await sql`
    SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC
  `;
  return NextResponse.json({ users });
}
