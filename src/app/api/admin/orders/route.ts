import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const sql = getSql();
  const orders = await sql`
    SELECT id, user_id, status, payment_method, full_name, email, phone, city,
           total, (receipt_data IS NOT NULL) AS has_receipt, created_at
    FROM orders
    ORDER BY created_at DESC
  `;
  return NextResponse.json({ orders });
}
