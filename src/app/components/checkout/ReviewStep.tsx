"use client";

import { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { PaymentMethod } from "./PaymentMethodStep";
import { CartItem } from "../../context/CartContext";
import { DeliveryDetails } from "./DeliveryForm";
import { SITE } from "@/lib/site";
import { DEPOSIT_RATE, INSTALLMENT_PLANS, installmentBreakdown } from "@/lib/pricing";
import { compressImage } from "@/lib/compress-image";

type ReviewStepProps = {
  paymentMethod: PaymentMethod;
  items: CartItem[];
  delivery: DeliveryDetails;
  deliveryFee: number;
  subtotal: number;
  total: number;
  onBack: () => void;
  onPlaceOrder: (orderNumber: string) => void;
};

const BANK_ACCOUNTS = SITE.bankAccounts;



const ReviewStep = ({
  paymentMethod,
  items,
  delivery,
  deliveryFee,
  subtotal,
  total,
  onBack,
  onPlaceOrder,
}: ReviewStepProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [installmentWeeks, setInstallmentWeeks] = useState(4);
  const [klumpStatus, setKlumpStatus] = useState<
    "idle" | "verifying" | "failed" | "not-configured"
  >("idle");
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const breakdown = installmentBreakdown(total, installmentWeeks) ?? installmentBreakdown(total, 4)!;
  const selectedPlan = breakdown.plan;
  const installmentInterest = breakdown.interest;
  const installmentTotalPayable = breakdown.totalPayable;
  const installmentDeposit = breakdown.deposit;
  const installmentRemaining = breakdown.remaining;
  const installmentWeeklyPayment = breakdown.weeklyPayment;

  const handleReceiptChange = async (file: File | null) => {
    setOrderError("");
    if (!file) return setReceiptFile(null);
    try {
      setReceiptFile(await compressImage(file));
    } catch {
      setReceiptFile(null);
      setOrderError("We couldn't read that image. Try a screenshot in JPG or PNG format.");
    }
  };

  const requiresReceipt = paymentMethod === "bank-transfer" || paymentMethod === "installments";
  const canPlaceOrder =
    acceptedTerms && acceptedPrivacy && (!requiresReceipt || receiptFile !== null);

  const orderTotal = paymentMethod === "installments" ? installmentTotalPayable : total;

  const submitOrder = async (
    klumpReference?: string
  ): Promise<{ orderNumber: string } | { error: string }> => {
    const formData = new FormData();
    formData.set("paymentMethod", paymentMethod);
    formData.set("fullName", delivery.fullName);
    formData.set("email", delivery.email);
    formData.set("phone", delivery.phone);
    formData.set("address", delivery.address);
    formData.set("city", delivery.city);
    // Only product ids and quantities are sent: the server looks up prices
    // and recomputes every total itself.
    formData.set("items", JSON.stringify(items.map((item) => ({ id: item.id, qty: item.qty }))));
    formData.set("expectedTotal", String(orderTotal));

    if (paymentMethod === "installments") {
      formData.set("installmentWeeks", String(selectedPlan.weeks));
    }
    if (klumpReference) {
      formData.set("klumpReference", klumpReference);
    }

    if (receiptFile) {
      formData.set("receipt", receiptFile);
    }

    try {
      const res = await fetch("/api/orders", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error ?? "Failed to place order" };
      }
      return { orderNumber: data.order.orderNumber };
    } catch {
      return { error: "Failed to place order. Check your connection and try again." };
    }
  };

  const handleKlumpCheckout = () => {
    const publicKey = process.env.NEXT_PUBLIC_KLUMP_PUBLIC_KEY;
    if (!publicKey) {
      setKlumpStatus("not-configured");
      return;
    }

    if (typeof Klump === "undefined") {
      setKlumpStatus("failed");
      return;
    }

    const reference = `FX-${Date.now()}`;
    const [firstName, ...rest] = delivery.fullName.trim().split(" ");
    const lastName = rest.join(" ") || firstName;
    const origin = window.location.origin;

    new Klump({
      publicKey,
      data: {
        amount: subtotal + deliveryFee,
        shipping_fee: deliveryFee,
        currency: "NGN",
        first_name: firstName,
        last_name: lastName,
        email: delivery.email,
        phone: delivery.phone,
        merchant_reference: reference,
        items: items.map((item) => ({
          name: item.name,
          unit_price: item.price,
          quantity: item.qty,
          image_url: `${origin}${item.image}`,
        })),
      },
      onSuccess: async (data) => {
        setKlumpStatus("verifying");
        try {
          const res = await fetch(
            `/api/klump/verify?reference=${data.reference ?? reference}`
          );
          const result = await res.json();
          if (result?.data?.status === "successful") {
            const outcome = await submitOrder(data.reference ?? reference);
            if ("error" in outcome) {
              setOrderError(outcome.error);
              setKlumpStatus("failed");
            } else {
              onPlaceOrder(outcome.orderNumber);
            }
          } else {
            setKlumpStatus("failed");
          }
        } catch {
          setKlumpStatus("failed");
        }
      },
      onError: () => setKlumpStatus("failed"),
      onLoad: () => {},
      onOpen: () => {},
      onClose: () => {},
    });
  };

  const handlePlaceOrder = async () => {
    setOrderError("");

    if (paymentMethod === "klump") {
      handleKlumpCheckout();
      return;
    }

    setSubmitting(true);
    const outcome = await submitOrder();
    setSubmitting(false);

    if ("error" in outcome) {
      setOrderError(outcome.error);
    } else {
      onPlaceOrder(outcome.orderNumber);
    }
  };

  return (
    <div className="flex-1">
      <h2 className="display-type text-3xl">Review and pay</h2>

      {paymentMethod === "bank-transfer" && (
        <div className="mt-6 border-t border-ink/15 pt-6">
          <h3 className="text-lg font-semibold text-ink">Transfer to our account</h3>
          <p className="mt-2 text-sm text-ink/70">
            Please transfer the exact amount of{" "}
            <span className="font-semibold text-ink">₦{total.toLocaleString()}</span> to the
            account below. Your order will not ship until we receive payment.
          </p>

          <div className="mt-4 space-y-2 bg-cream p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/60">Account name</span>
              <span className="font-semibold">{BANK_ACCOUNTS[0].accountName}</span>
            </div>
            {BANK_ACCOUNTS.map((account) => (
              <div key={account.accountNumber} className="flex justify-between">
                <span className="text-ink/50">{account.bank}</span>
                <span className="font-semibold">{account.accountNumber}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 block text-sm font-medium text-ink/80">
            Upload your payment receipt *
          </p>
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-ink/20 py-8 text-sm text-ink/50 transition hover:border-gold hover:text-gold">
            <UploadCloud className="h-5 w-5" />
            {receiptFile?.name ?? "Choose a screenshot or photo of the receipt"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleReceiptChange(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      )}

      {paymentMethod === "installments" && (
        <div className="mt-6 border-t border-ink/15 pt-6">
          <h3 className="text-lg font-semibold text-ink">Your instalment plan</h3>
          <p className="mt-2 text-sm text-ink/70">
            Choose a payment plan that works for you. A {DEPOSIT_RATE * 100}% initial deposit is
            required to start your plan. Your order ships once payment is completed.
          </p>

          <label htmlFor="select-duration" className="mt-4 block text-sm font-medium text-ink/80">Select Duration</label>
          <select id="select-duration"
            value={installmentWeeks}
            onChange={(e) => setInstallmentWeeks(Number(e.target.value))}
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
          >
            {INSTALLMENT_PLANS.map((plan) => (
              <option key={plan.weeks} value={plan.weeks} className="bg-white">
                {plan.weeks} Weeks ({plan.interestRate}% Interest)
              </option>
            ))}
          </select>

          <div className="mt-4 space-y-2 bg-cream p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/50">Subtotal (inc. Delivery)</span>
              <span className="font-semibold">₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/50">Interest ({selectedPlan.interestRate}%)</span>
              <span className="font-semibold">+₦{installmentInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2">
              <span className="font-semibold text-ink/70">Total Payable</span>
              <span className="font-semibold text-gold">
                ₦{installmentTotalPayable.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Initial Deposit ({DEPOSIT_RATE * 100}%)</span>
              <span className="font-semibold text-green-600">
                ₦{installmentDeposit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/50">Remaining ({selectedPlan.weeks} payments)</span>
              <span className="font-semibold">
                ₦{installmentWeeklyPayment.toLocaleString()} / week
              </span>
            </div>
          </div>

          <p className="mt-4 block text-sm font-medium text-ink/80">
            Upload your initial deposit receipt *
          </p>
          <p className="mt-1 text-sm text-ink/70">
            Please transfer your initial deposit of{" "}
            <span className="font-semibold text-ink">
              ₦{installmentDeposit.toLocaleString()}
            </span>{" "}
            to the account below.
          </p>

          <div className="mt-3 space-y-2 bg-cream p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/60">Account name</span>
              <span className="font-semibold">{BANK_ACCOUNTS[0].accountName}</span>
            </div>
            {BANK_ACCOUNTS.map((account) => (
              <div key={account.accountNumber} className="flex justify-between">
                <span className="text-ink/50">{account.bank}</span>
                <span className="font-semibold">{account.accountNumber}</span>
              </div>
            ))}
          </div>

          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-ink/20 py-8 text-sm text-ink/50 transition hover:border-gold hover:text-gold">
            <UploadCloud className="h-5 w-5" />
            {receiptFile?.name ?? "Choose a screenshot or photo of the receipt"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleReceiptChange(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      )}

      {paymentMethod === "klump" && (
        <div className="mt-6 border-t border-ink/15 pt-6 text-sm text-ink/70">
          <h3 className="text-lg font-semibold text-ink">Pay later with Klump</h3>
          <p className="mt-2">
            Clicking &ldquo;Place order&rdquo; opens the secure Klump checkout widget for{" "}
            <span className="font-semibold text-ink">₦{total.toLocaleString()}</span>. Choose a
            payment plan there to complete your purchase.
          </p>
          {klumpStatus === "verifying" && (
            <p className="mt-3 flex items-center gap-2 text-gold">
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying your payment...
            </p>
          )}
          {klumpStatus === "not-configured" && (
            <p className="mt-3 text-red-600">
              Klump payments aren&apos;t set up yet on this store. Please choose a different
              payment method or contact support.
            </p>
          )}
          {klumpStatus === "failed" && (
            <p className="mt-3 text-red-600">
              We couldn&apos;t confirm this payment. Please try again or contact support.
            </p>
          )}
        </div>
      )}

      {orderError && (
        <p className="mt-4 bg-red-500/10 px-4 py-2 text-sm text-red-600">{orderError}</p>
      )}

      <div className="mt-6 space-y-3">
        <label className="flex cursor-pointer items-start gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          I accept the <span className="font-semibold text-ink">Terms & Conditions</span>{" "}
          including the No-Return & No-Refund policy.
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          I accept the <span className="font-semibold text-ink">Privacy Policy</span> and consent
          to data processing under Nigerian NDPR.
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="bg-ink/10 px-6 py-3 text-sm font-semibold transition hover:bg-ink/15"
        >
          Back
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={!canPlaceOrder || submitting || klumpStatus === "verifying"}
          className="flex flex-1 items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Placing order…" : `Place order: ₦${orderTotal.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
