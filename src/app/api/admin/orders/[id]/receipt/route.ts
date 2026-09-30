import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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

  // Receipts live in order_receipts; orders placed before that change kept
  // theirs inline on the order document.
  const db = getDb();
  const receiptDoc = await db.collection("order_receipts").doc(String(orderId)).get();
  let receipt = receiptDoc.data() as { data?: string; mime_type?: string } | undefined;
  if (!receipt?.data) {
    const order = (await db.collection("orders").doc(String(orderId)).get()).data();
    receipt = order?.receipt_data ? { data: order.receipt_data, mime_type: order.receipt_mime_type } : undefined;
  }
  if (!receipt?.data) {
    return NextResponse.json({ error: "No receipt for this order" }, { status: 404 });
  }

  return new NextResponse(Buffer.from(receipt.data, "base64"), {
    headers: {
      "Content-Type": receipt.mime_type || "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
