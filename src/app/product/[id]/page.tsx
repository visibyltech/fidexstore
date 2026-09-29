"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductPanel, { Product } from "../../components/ProductPanel";
import type { ApiProduct, ApiProductDetail } from "@/types/api";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found">("loading");
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/products/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        setProduct(data.product);
        setQty(1);
        setActiveIndex(0);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("not-found");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product?.category) return;
    let cancelled = false;

    fetch(`/api/products?category=${product.category}&sort=rating&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const items: ApiProduct[] = data.products ?? [];
        setRelated(
          items
            .filter((p) => p.id !== product.id)
            .slice(0, 5)
            .map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.image ?? "" }))
        );
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });

    return () => {
      cancelled = true;
    };
  }, [product?.category, product?.id]);

  if (status === "loading") {
    return <p className="mx-10 mt-16 text-center text-sm text-black/50">Loading product…</p>;
  }

  if (status === "not-found" || !product) {
    return (
      <div className="mx-10 mt-8 mb-16 flex flex-col items-center justify-center rounded-3xl bg-black/5 py-24 text-center">
        <p className="text-lg font-semibold">Product not found</p>
        <p className="mt-2 text-sm text-black/50">This item may have sold out or been removed.</p>
        <Link
          href="/shop"
          className="mt-6 flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-black transition hover:bg-gold/90"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const image = product.image ?? "";
  const images = product.images?.length ? product.images : image ? [image] : [];
  const activeImage = images[activeIndex] ?? images[0];
  const rating = Math.round(Number(product.rating));
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock === 0;
  const maxQty = product.stock ?? Infinity;
  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;
  const item = { id: product.id, name: product.name, image, price: product.price };

  const handleAddToCart = () => {
    addToCart(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="pb-16">
      <div className="mx-10 mt-8">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-black/50">
          <Link href="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-gold">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/shop?category=${product.category}`} className="hover:text-gold">
                {product.category_name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-black/80">{product.name}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-black/5 bg-white">
              {discount > 0 && (
                <span className="absolute top-4 left-4 z-10 rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-black uppercase">
                  Sale
                </span>
              )}
              {activeImage && (
                <Image src={activeImage} alt={product.name} fill priority className="object-cover" />
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-3">
                {images.map((src, i) => (
                  <button
                    key={`${i}-${src}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                      i === activeIndex ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {product.category && (
              <Link
                href={`/shop?category=${product.category}`}
                className="text-xs tracking-wide text-black/40 uppercase hover:text-gold"
              >
                {product.category_name}
              </Link>
            )}
            <h1 className="mt-1 text-3xl font-semibold">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-gold text-gold" : "text-black/20"}`} />
                ))}
              </div>
              <span className="text-sm text-black/40">({product.reviews_count} reviews)</span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl font-semibold text-gold">₦{product.price.toLocaleString()}</span>
              {product.old_price && (
                <span className="text-base text-black/40 line-through">
                  ₦{product.old_price.toLocaleString()}
                </span>
              )}
              {discount > 0 && <span className="text-sm font-medium text-green-600">-{discount}%</span>}
            </div>

            {product.description && (
              <p className="mt-6 text-sm leading-relaxed whitespace-pre-line text-black/70">
                {product.description}
              </p>
            )}

            <p className={`mt-6 text-sm font-medium ${outOfStock ? "text-red-500" : "text-green-600"}`}>
              {outOfStock
                ? "Out of stock"
                : product.stock != null && product.stock <= 5
                  ? `Only ${product.stock} left`
                  : "In stock"}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-full bg-black/10 px-4 py-2.5">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="text-black/70 transition hover:text-gold"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  aria-label="Increase quantity"
                  className="text-black/70 transition hover:text-gold"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold uppercase transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  added ? "bg-green-500 text-black" : "bg-gold text-black hover:bg-gold/90"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(item)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                  wishlisted ? "bg-gold text-black" : "bg-black/5 text-black/60 hover:bg-gold hover:text-black"
                }`}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-black" : ""}`} />
              </button>
            </div>

            <Link
              href="/shop"
              className="mt-8 flex items-center gap-2 text-sm text-black/50 transition hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" /> Continue shopping
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <ProductPanel
          heading="You May Also Like"
          subtitle={`More from ${product.category_name}`}
          products={related}
        />
      )}
    </div>
  );
}
