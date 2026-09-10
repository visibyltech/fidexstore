"use client";

import { useState } from "react";
import { CreditCard, UploadCloud, Zap, ShieldCheck, Loader2, Truck } from "lucide-react";
import { PaymentMethod } from "./PaymentMethodStep";
import { CartItem } from "../../context/CartContext";
import { DeliveryDetails } from "./DeliveryForm";

type ReviewStepProps = {
  paymentMethod: PaymentMethod;
  items: CartItem[];
  delivery: DeliveryDetails;
  deliveryFee: number;
  subtotal: number;
  total: number;
  onBack: () => void;
  onPlaceOrder: () => void;
};

const BANK_ACCOUNTS = [
  { bank: "GTBank", accountName: "Richmond Trust Devices", accountNumber: "0123456789" },
  { bank: "Globus Bank", accountName: "Richmond Trust Devices", accountNumber: "2003633137" },
];

const INSTALLMENT_PLANS = [
  { weeks: 2, interestRate: 3 },
  { weeks: 4, interestRate: 6 },
  { weeks: 6, interestRate: 9 },
  { weeks: 8, interestRate: 12 },
];

const DEPOSIT_RATE = 0.3;

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
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [installmentWeeks, setInstallmentWeeks] = useState(4);
  const [klumpStatus, setKlumpStatus] = useState<
    "idle" | "verifying" | "failed" | "not-configured"
  >("idle");

  const selectedPlan =
    INSTALLMENT_PLANS.find((plan) => plan.weeks === installmentWeeks) ?? INSTALLMENT_PLANS[1];
  const installmentInterest = Math.round(total * (selectedPlan.interestRate / 100));
  const installmentTotalPayable = total + installmentInterest;
  const installmentDeposit = Math.round(installmentTotalPayable * DEPOSIT_RATE);
  const installmentRemaining = installmentTotalPayable - installmentDeposit;
  const installmentWeeklyPayment = Math.round(installmentRemaining / selectedPlan.weeks);

  const requiresReceipt = paymentMethod === "bank-transfer" || paymentMethod === "installments";
  const canPlaceOrder =
    acceptedTerms && acceptedPrivacy && (!requiresReceipt || receiptName !== null);

  const orderTotal = paymentMethod === "installments" ? installmentTotalPayable : total;

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

    const reference = `RTD-${Date.now()}`;
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
            onPlaceOrder();
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

  const handlePlaceOrder = () => {
    if (paymentMethod === "klump") {
      handleKlumpCheckout();
    } else {
      onPlaceOrder();
    }
  };

  return (
    <div className="flex-1 rounded-2xl bg-white/5 p-6">
      <h2 className="text-lg font-semibold">Review & Pay</h2>

      {paymentMethod === "bank-transfer" && (
        <div className="mt-6 rounded-xl border border-gold/40 bg-gold/5 p-5">
          <div className="flex items-center gap-2 text-gold">
            <CreditCard className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Bank Account Details</h3>
          </div>
          <p className="mt-2 text-sm text-white/70">
            Please transfer the exact amount of{" "}
            <span className="font-semibold text-white">₦{total.toLocaleString()}</span> to the
            account below. Your order will not ship until we receive payment.
          </p>

          <div className="mt-4 space-y-2 rounded-lg bg-black/30 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Account Name</span>
              <span className="font-semibold">{BANK_ACCOUNTS[0].accountName}</span>
            </div>
            {BANK_ACCOUNTS.map((account) => (
              <div key={account.accountNumber} className="flex justify-between">
                <span className="text-white/50">{account.bank}</span>
                <span className="font-semibold">{account.accountNumber}</span>
              </div>
            ))}
          </div>

          <label className="mt-4 block text-xs font-semibold tracking-wide text-white/60 uppercase">
            Upload Payment Receipt *
          </label>
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-8 text-sm text-white/50 transition hover:border-gold hover:text-gold">
            <UploadCloud className="h-5 w-5" />
            {receiptName ?? "Click to upload screenshot"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setReceiptName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>
      )}

      {paymentMethod === "installments" && (
        <div className="mt-6 rounded-xl border border-gold/40 bg-gold/5 p-5">
          <div className="flex items-center gap-2 text-gold">
            <Truck className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Installment Plan Details</h3>
          </div>
          <p className="mt-2 text-sm text-white/70">
            Choose a payment plan that works for you. A {DEPOSIT_RATE * 100}% upfront deposit is
            required before shipping.
          </p>

          <label className="mt-4 block text-xs font-semibold tracking-wide text-white/60 uppercase">
            Select Duration
          </label>
          <select
            value={installmentWeeks}
            onChange={(e) => setInstallmentWeeks(Number(e.target.value))}
            className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          >
            {INSTALLMENT_PLANS.map((plan) => (
              <option key={plan.weeks} value={plan.weeks} className="bg-black">
                {plan.weeks} Weeks ({plan.interestRate}% Interest)
              </option>
            ))}
          </select>

          <div className="mt-4 space-y-2 rounded-lg bg-black/30 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Subtotal (inc. Delivery)</span>
              <span className="font-semibold">₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Interest ({selectedPlan.interestRate}%)</span>
              <span className="font-semibold">+₦{installmentInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="font-semibold text-white/70">Total Payable</span>
              <span className="font-semibold text-gold">
                ₦{installmentTotalPayable.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-400">Upfront Deposit ({DEPOSIT_RATE * 100}%)</span>
              <span className="font-semibold text-green-400">
                ₦{installmentDeposit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Remaining ({selectedPlan.weeks} payments)</span>
              <span className="font-semibold">
                ₦{installmentWeeklyPayment.toLocaleString()} / week
              </span>
            </div>
          </div>

          <label className="mt-4 block text-xs font-semibold tracking-wide text-white/60 uppercase">
            Upload Initial Deposit Receipt *
          </label>
          <p className="mt-1 text-sm text-white/70">
            Please transfer your deposit of{" "}
            <span className="font-semibold text-white">
              ₦{installmentDeposit.toLocaleString()}
            </span>{" "}
            to the account below.
          </p>

          <div className="mt-3 space-y-2 rounded-lg bg-black/30 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Account Name</span>
              <span className="font-semibold">{BANK_ACCOUNTS[0].accountName}</span>
            </div>
            {BANK_ACCOUNTS.map((account) => (
              <div key={account.accountNumber} className="flex justify-between">
                <span className="text-white/50">{account.bank}</span>
                <span className="font-semibold">{account.accountNumber}</span>
              </div>
            ))}
          </div>

          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-8 text-sm text-white/50 transition hover:border-gold hover:text-gold">
            <UploadCloud className="h-5 w-5" />
            {receiptName ?? "Click to upload screenshot"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setReceiptName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>
      )}

      {paymentMethod === "klump" && (
        <div className="mt-6 rounded-xl border border-gold/40 bg-gold/5 p-5 text-sm text-white/70">
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Klump Buy Now, Pay Later</h3>
          </div>
          <p className="mt-2">
            Clicking &ldquo;Place Order&rdquo; opens the secure Klump checkout widget for{" "}
            <span className="font-semibold text-white">₦{total.toLocaleString()}</span>. Choose a
            payment plan there to complete your purchase.
          </p>
          {klumpStatus === "verifying" && (
            <p className="mt-3 flex items-center gap-2 text-gold">
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying your payment...
            </p>
          )}
          {klumpStatus === "not-configured" && (
            <p className="mt-3 text-red-400">
              Klump payments aren&apos;t set up yet on this store. Please choose a different
              payment method or contact support.
            </p>
          )}
          {klumpStatus === "failed" && (
            <p className="mt-3 text-red-400">
              We couldn&apos;t confirm this payment. Please try again or contact support.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 space-y-3">
        <label className="flex cursor-pointer items-start gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          I accept the <span className="font-semibold text-white">Terms & Conditions</span>{" "}
          including the No-Return & No-Refund policy.
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          I accept the <span className="font-semibold text-white">Privacy Policy</span> and consent
          to data processing under Nigerian NDPR.
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold transition hover:bg-white/15"
        >
          Back
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={!canPlaceOrder || klumpStatus === "verifying"}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-black transition hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Zap className="h-4 w-4" /> Place Order — ₦{orderTotal.toLocaleString()}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
