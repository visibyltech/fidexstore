"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import OrderSummary from "../components/checkout/OrderSummary";

export default function CartPage() {
  const { items, updateQty, removeFromCart, itemCount } = useCart();

  return (
    <div className="px-4 pt-10 md:px-10">
      <h1 className="display-type text-5xl text-ink md:text-6xl">
        Your cart <span className="text-ink/30">({itemCount})</span>
      </h1>

      {items.length === 0 ? (
        <div className="mt-8 bg-cream px-6 py-16">
          <p className="text-lg font-semibold">Nothing in your cart yet.</p>
          <p className="mt-2 text-sm text-ink/60">Tap the + on any product to add it here.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold"
          >
            Browse the shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start">
          <ul className="flex-1 border-t border-ink/10">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 border-b border-ink/10 py-5">
                <Link href={`/product/${item.id}`} className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream">
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link href={`/product/${item.id}`} className="font-medium transition hover:text-gold">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-ink/60">₦{item.price.toLocaleString()} each</p>

                  <div className="mt-3 flex w-fit items-center border border-ink/20">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="px-2.5 py-1.5 text-ink/70 transition hover:text-gold"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm" aria-live="polite">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="px-2.5 py-1.5 text-ink/70 transition hover:text-gold"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <p className="font-semibold">₦{(item.price * item.qty).toLocaleString()}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="flex items-center gap-1 text-xs text-ink/50 transition hover:text-gold"
                  >
                    <X className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="w-full lg:w-96">
            <OrderSummary />
            <Link
              href="/checkout"
              className="mt-3 flex w-full items-center justify-center gap-2 bg-gold px-6 py-4 text-sm font-semibold text-white transition hover:bg-ink"
            >
              Go to checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
