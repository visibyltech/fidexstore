import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

const PAYMENT_METHODS = ["bank-transfer", "installments", "klump"];
const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;

type OrderItemInput = {
  id?: number;
  name?: string;
  image?: string;
  price?: number;
  qty?: number;
};

// Public route — checkout works for guests. If a session cookie is present
// the order is linked to that user; otherwise it's recorded from the
// delivery form details alone, same as any guest checkout.
export async function POST(request: NextRequest) {
  const sessionUser = await getSessionUser(request);

  const formData = await request.formData();

  const paymentMethod = String(formData.get("paymentMethod") ?? "");
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  if (!fullName || !email || !phone || !address || !city) {
    return NextResponse.json({ error: "Missing delivery details" }, { status: 400 });
  }

  const subtotal = Number(formData.get("subtotal"));
  const deliveryFee = Number(formData.get("deliveryFee"));
  const total = Number(formData.get("total"));
  if (!Number.isFinite(subtotal) || !Number.isFinite(deliveryFee) || !Number.isFinite(total)) {
    return NextResponse.json({ error: "Invalid order totals" }, { status: 400 });
  }

  let items: OrderItemInput[];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return NextResponse.json({ error: "Invalid items" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  for (const item of items) {
    if (!item.name || !Number.isFinite(item.price) || !Number.isFinite(item.qty)) {
      return NextResponse.json({ error: "Invalid item in cart" }, { status: 400 });
    }
  }

  const installmentWeeksRaw = formData.get("installmentWeeks");
  const installmentInterestRateRaw = formData.get("installmentInterestRate");
  const installmentDepositRaw = formData.get("installmentDeposit");
  const installmentWeeks = installmentWeeksRaw != null ? Number(installmentWeeksRaw) : null;
  const installmentInterestRate =
    installmentInterestRateRaw != null ? Number(installmentInterestRateRaw) : null;
  const installmentDeposit = installmentDepositRaw != null ? Number(installmentDepositRaw) : null;

  let receiptFilename: string | null = null;
  let receiptMimeType: string | null = null;
  let receiptData: string | null = null;

  const receiptFile = formData.get("receipt");
  if (receiptFile instanceof File && receiptFile.size > 0) {
    if (receiptFile.size > MAX_RECEIPT_BYTES) {
      return NextResponse.json({ error: "Receipt file is too large (max 5MB)" }, { status: 400 });
    }
    const buffer = Buffer.from(await receiptFile.arrayBuffer());
    receiptFilename = receiptFile.name;
    receiptMimeType = receiptFile.type || "application/octet-stream";
    receiptData = buffer.toString("base64");
  }

  if ((paymentMethod === "bank-transfer" || paymentMethod === "installments") && !receiptData) {
    return NextResponse.json({ error: "A payment receipt is required" }, { status: 400 });
  }

  const sql = getSql();
  const [order] = await sql`
    INSERT INTO orders (
      user_id, payment_method, full_name, email, phone, address, city,
      subtotal, delivery_fee, total,
      installment_weeks, installment_interest_rate, installment_deposit,
      receipt_filename, receipt_mime_type, receipt_data
    ) VALUES (
      ${sessionUser?.id ?? null}, ${paymentMethod}, ${fullName}, ${email}, ${phone}, ${address}, ${city},
      ${subtotal}, ${deliveryFee}, ${total},
      ${installmentWeeks}, ${installmentInterestRate}, ${installmentDeposit},
      ${receiptFilename}, ${receiptMimeType}, ${receiptData}
    )
    RETURNING id
  `;

  for (const item of items) {
    await sql`
      INSERT INTO order_items (order_id, product_id, name, image, price, qty)
      VALUES (${order.id}, ${item.id ?? null}, ${item.name}, ${item.image ?? null}, ${item.price}, ${item.qty})
    `;
  }

  return NextResponse.json(
    { order: { id: order.id, orderNumber: `CC-${order.id}` } },
    { status: 201 }
  );
}
