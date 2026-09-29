"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import OrderSummary, { DELIVERY_FEE } from "../components/checkout/OrderSummary";
import DeliveryForm, { DeliveryDetails } from "../components/checkout/DeliveryForm";
import PaymentMethodStep, { PaymentMethod } from "../components/checkout/PaymentMethodStep";
import ReviewStep from "../components/checkout/ReviewStep";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  // src/proxy.ts already redirects signed-out visitors before the page
  // loads; this catches signing out while already on checkout.
  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/checkout");
  }, [loading, user, router]);

  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [delivery, setDelivery] = useState<DeliveryDetails>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  // Pre-fill name and email from the signed-in account, without overwriting
  // anything the customer has already typed.
  const [prefilledFor, setPrefilledFor] = useState<number | null>(null);
  if (user && prefilledFor !== user.id) {
    setPrefilledFor(user.id);
    setDelivery((d) => ({ ...d, fullName: d.fullName || user.name, email: d.email || user.email }));
  }

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank-transfer");

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  const handlePlaceOrder = (placedOrderNumber: string) => {
    setOrderNumber(placedOrderNumber);
    setOrderPlaced(true);
    clearCart();
  };

  if (loading || !user) {
    return <p className="mx-4 md:mx-10 mt-16 mb-16 text-center text-sm text-ink/50">Loading…</p>;
  }

  if (orderPlaced) {
    return (
      <div className="mx-4 md:mx-10 mt-8 mb-16 flex flex-col items-center bg-cream py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-gold" />
        <h1 className="mt-6 text-2xl font-semibold">Order Placed Successfully!</h1>
        <p className="mt-2 text-sm text-ink/60">
          Your order <span className="font-semibold text-gold">{orderNumber}</span> has been
          received. We&apos;ll reach out with confirmation shortly.
        </p>
        <Link
          href="/shop"
          className="mt-8 flex items-center gap-2 bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink"
        >
          Continue shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-4 md:mx-10 mt-8 mb-16 flex flex-col items-center bg-cream py-24 text-center">
        <h1 className="display-type text-4xl">Your cart is empty</h1>
        <p className="mt-2 text-sm text-ink/60">Add items to your cart before checking out.</p>
        <Link
          href="/shop"
          className="mt-6 flex items-center gap-2 bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink"
        >
          Browse the shop <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-10 md:px-10">
      <h1 className="display-type text-5xl text-ink md:text-6xl">Checkout</h1>

      <div className="mt-8 max-w-2xl">
        <CheckoutStepper currentStep={step} />
      </div>

      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        {step === 1 && (
          <DeliveryForm
            details={delivery}
            onChange={setDelivery}
            onContinue={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <PaymentMethodStep
            selected={paymentMethod}
            onSelect={setPaymentMethod}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <ReviewStep
            paymentMethod={paymentMethod}
            items={items}
            delivery={delivery}
            deliveryFee={DELIVERY_FEE}
            subtotal={subtotal}
            total={total}
            onBack={() => setStep(2)}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        <div className="w-full lg:w-96">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
