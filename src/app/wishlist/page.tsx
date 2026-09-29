"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function WishlistPage() {
  const { items, removeFromWishlist, itemCount } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="px-4 pt-10 md:px-10">
      <h1 className="display-type text-5xl text-ink md:text-6xl">
        Saved for later <span className="text-ink/30">({itemCount})</span>
      </h1>

      {items.length === 0 ? (
        <div className="mt-8 bg-cream px-6 py-16">
          <p className="text-lg font-semibold">No saved items yet.</p>
          <p className="mt-2 text-sm text-ink/60">Tap the heart on any product to keep it here.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold"
          >
            Browse the shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ul className="mt-8 border-t border-ink/10">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-4 border-b border-ink/10 py-5">
              <Link href={`/product/${item.id}`} className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream">
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/product/${item.id}`} className="font-medium transition hover:text-gold">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-ink/60">₦{item.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => addToCart(item)}
                  className="bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gold"
                >
                  Add to cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  aria-label={`Remove ${item.name} from wishlist`}
                  className="flex items-center gap-1 text-xs text-ink/50 transition hover:text-gold"
                >
                  <X className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
