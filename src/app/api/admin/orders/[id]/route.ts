import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const sql = getSql();
  const [order] = await sql`
    SELECT id, user_id, status, payment_method, full_name, email, phone, address, city,
           subtotal, delivery_fee, total,
           installment_weeks, installment_interest_rate, installment_deposit,
           receipt_filename, (receipt_data IS NOT NULL) AS has_receipt, created_at
    FROM orders WHERE id = ${orderId}
  `;
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const items = await sql`
    SELECT id, product_id, name, image, price, qty FROM order_items
    WHERE order_id = ${orderId} ORDER BY id
  `;

  return NextResponse.json({ order, items });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response;

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const status = body?.status;
  if (status !== "pending" && status !== "completed") {
    return NextResponse.json({ error: "status must be 'pending' or 'completed'" }, { status: 400 });
  }

  const sql = getSql();
  const [order] = await sql`
    UPDATE orders SET status = ${status} WHERE id = ${orderId} RETURNING id, status
  `;
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
