import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getDb, nextId } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { DELIVERY_FEE, installmentBreakdown } from "@/lib/pricing";
import { verifyKlumpTransaction } from "@/lib/klump";

const PAYMENT_METHODS = ["bank-transfer", "installments", "klump"];
const MAX_QTY_PER_ITEM = 50;
// Receipts are stored base64-encoded in their own Firestore document (1 MiB
// cap, base64 adds ~33%). The checkout compresses photos before upload.
const MAX_RECEIPT_BYTES = 700 * 1024;

type OrderItemInput = { id?: unknown; qty?: unknown };

const badRequest = (error: string, status = 400) => NextResponse.json({ error }, { status });

// Checkout requires a signed-in account (src/proxy.ts redirects signed-out
// visitors away from /checkout); every order is linked to its user.
//
// The browser only sends product ids and quantities. Names, prices and every
// total are looked up and computed here, so a tampered request can't change
// what an order costs.
export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "orders", { limit: 10, windowMs: 10 * 60_000 });
  if (limited) return limited;

  const { user: sessionUser, response } = await requireUser(request);
  if (!sessionUser) return response;

  const formData = await request.formData();

  const paymentMethod = String(formData.get("paymentMethod") ?? "");
  if (!PAYMENT_METHODS.includes(paymentMethod)) return badRequest("Invalid payment method");

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  if (!fullName || !email || !phone || !address || !city) return badRequest("Missing delivery details");

  let itemInputs: OrderItemInput[];
  try {
    itemInputs = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return badRequest("Invalid items");
  }
  if (!Array.isArray(itemInputs) || itemInputs.length === 0) return badRequest("Cart is empty");

  // Merge duplicate lines and validate quantities.
  const quantities = new Map<number, number>();
  for (const input of itemInputs) {
    const id = Number(input.id);
    const qty = Number(input.qty);
    if (!Number.isInteger(id) || !Number.isInteger(qty) || qty < 1) return badRequest("Invalid item in cart");
    quantities.set(id, (quantities.get(id) ?? 0) + qty);
  }

  const db = getDb();
  const productDocs = await Promise.all(
    [...quantities.keys()].map((id) => db.collection("products").doc(String(id)).get())
  );

  const items: { id: number; product_id: number; name: string; image: string | null; price: number; qty: number }[] = [];
  let subtotal = 0;
  for (const doc of productDocs) {
    const product = doc.data();
    const qty = quantities.get(Number(doc.id))!;
    if (!product || !product.is_active) {
      return badRequest("An item in your cart is no longer available. Please remove it and try again.", 409);
    }
    if (qty > MAX_QTY_PER_ITEM) return badRequest(`You can order at most ${MAX_QTY_PER_ITEM} of ${product.name}.`);
    if (typeof product.stock === "number" && qty > product.stock) {
      return badRequest(
        product.stock === 0
          ? `${product.name} is sold out.`
          : `Only ${product.stock} of ${product.name} left. Please lower the quantity.`,
        409
      );
    }
    subtotal += product.price * qty;
    items.push({
      id: await nextId("order_items"),
      product_id: product.id,
      name: product.name,
      image: product.image ?? null,
      price: product.price,
      qty,
    });
  }

  const deliveryFee = DELIVERY_FEE;
  let total = subtotal + deliveryFee;

  let installmentWeeks: number | null = null;
  let installmentInterestRate: number | null = null;
  let installmentDeposit: number | null = null;
  if (paymentMethod === "installments") {
    const breakdown = installmentBreakdown(total, Number(formData.get("installmentWeeks")));
    if (!breakdown) return badRequest("Invalid instalment plan");
    installmentWeeks = breakdown.plan.weeks;
    installmentInterestRate = breakdown.plan.interestRate;
    installmentDeposit = breakdown.deposit;
    total = breakdown.totalPayable;
  }

  // If prices changed since the customer loaded checkout, don't silently
  // charge a different amount: ask them to review the new total.
  const expectedTotal = Number(formData.get("expectedTotal"));
  if (Number.isFinite(expectedTotal) && expectedTotal !== total) {
    return badRequest(
      `Prices have changed since you started checkout. The new total is ₦${total.toLocaleString()}. Please review your cart and try again.`,
      409
    );
  }

  let klumpReference: string | null = null;
  if (paymentMethod === "klump") {
    klumpReference = String(formData.get("klumpReference") ?? "").trim() || null;
    if (!klumpReference) return badRequest("Missing Klump payment reference");

    const alreadyUsed = await db.collection("orders").where("klump_reference", "==", klumpReference).limit(1).get();
    if (!alreadyUsed.empty) return badRequest("This Klump payment has already been used for an order", 409);

    const verification = await verifyKlumpTransaction(klumpReference);
    if (!verification.ok) return badRequest(verification.error, verification.status === 500 ? 500 : 402);
    if (verification.amount !== null && verification.amount < subtotal + deliveryFee) {
      return badRequest("The Klump payment amount does not match this order", 402);
    }
  }

  let receipt: { filename: string; mimeType: string; data: string } | null = null;
  const receiptFile = formData.get("receipt");
  if (receiptFile instanceof File && receiptFile.size > 0) {
    if (receiptFile.size > MAX_RECEIPT_BYTES) {
      return badRequest("The receipt image is too large. Please upload a screenshot instead of a full-size photo.");
    }
    if (!receiptFile.type.startsWith("image/")) return badRequest("The receipt must be an image");
    receipt = {
      filename: receiptFile.name,
      mimeType: receiptFile.type,
      data: Buffer.from(await receiptFile.arrayBuffer()).toString("base64"),
    };
  }

  if ((paymentMethod === "bank-transfer" || paymentMethod === "installments") && !receipt) {
    return badRequest("A payment receipt is required");
  }

  const orderId = await nextId("orders");

  // The receipt goes in its own document so the order stays small.
  if (receipt) {
    await db.collection("order_receipts").doc(String(orderId)).set({
      order_id: orderId,
      filename: receipt.filename,
      mime_type: receipt.mimeType,
      data: receipt.data,
      created_at: new Date().toISOString(),
    });
  }

  await db
    .collection("orders")
    .doc(String(orderId))
    .set({
      id: orderId,
      user_id: sessionUser.id,
      status: "pending",
      payment_method: paymentMethod,
      full_name: fullName,
      email,
      phone,
      address,
      city,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      installment_weeks: installmentWeeks,
      installment_interest_rate: installmentInterestRate,
      installment_deposit: installmentDeposit,
      klump_reference: klumpReference,
      has_receipt: receipt !== null,
      receipt_filename: receipt?.filename ?? null,
      items,
      created_at: new Date().toISOString(),
    });

  return NextResponse.json({ order: { id: orderId, orderNumber: `FX-${orderId}` } }, { status: 201 });
}
