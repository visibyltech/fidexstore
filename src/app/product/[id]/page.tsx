"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Heart, Minus, Plus, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductPanel from "../../components/ProductPanel";
import { toShopProduct, ShopProduct } from "../../components/shop/ShopProductCard";
import { whatsappUrl } from "@/lib/site";
import type { ApiProduct, ApiProductDetail } from "@/types/api";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found">("loading");
  const [related, setRelated] = useState<ShopProduct[]>([]);
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

    fetch(`/api/products?category=${product.category}&sort=rating&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const items: ApiProduct[] = data.products ?? [];
        setRelated(
          items
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map(toShopProduct)
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
    return <p className="px-4 py-24 text-center text-sm text-ink/60 md:px-10">Loading product…</p>;
  }

  if (status === "not-found" || !product) {
    return (
      <div className="px-4 py-24 text-center md:px-10">
        <h1 className="display-type text-5xl text-ink">Product not found</h1>
        <p className="mt-3 text-sm text-ink/60">It may have sold out or been taken down.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the shop
        </Link>
      </div>
    );
  }

  const image = product.image ?? "";
  const images = product.images?.length ? product.images : image ? [image] : [];
  const activeImage = images[activeIndex] ?? images[0];
  const rating = Number(product.rating);
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
    <div>
      <nav aria-label="Breadcrumb" className="px-4 pt-6 text-xs text-ink/60 md:px-10">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-gold">Shop</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-gold">
              {product.category_name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-10 px-4 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="relative aspect-4/5 overflow-hidden bg-cream">
            {discount > 0 && (
              <span className="absolute top-3 left-3 z-10 bg-gold px-2.5 py-1 text-sm font-semibold text-white">
                -{discount}%
              </span>
            )}
            {activeImage && (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-2 grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={`${i}-${src}`}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Show image ${i + 1} of ${images.length}`}
                  aria-current={i === activeIndex}
                  className={`relative aspect-square overflow-hidden bg-cream transition ${
                    i === activeIndex ? "ring-2 ring-ink ring-offset-2" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 lg:pt-4">
          {product.category && (
            <Link href={`/shop?category=${product.category}`} className="text-sm text-ink/60 hover:text-gold">
              {product.category_name}
            </Link>
          )}
          <h1 className="display-type mt-2 text-5xl text-ink md:text-6xl">{product.name}</h1>

          {product.reviews_count > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-ink/70">
              <Star className="h-4 w-4 fill-ink text-ink" />
              {rating.toFixed(1)}
              <span className="text-ink/50">from {product.reviews_count} reviews</span>
            </p>
          )}

          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-ink">₦{product.price.toLocaleString()}</span>
            {product.old_price && (
              <span className="text-lg text-ink/40 line-through">₦{product.old_price.toLocaleString()}</span>
            )}
          </p>

          {product.description && (
            <p className="mt-6 leading-relaxed whitespace-pre-line text-ink/75">{product.description}</p>
          )}

          <p className={`mt-6 text-sm font-medium ${outOfStock ? "text-gold" : "text-ink/70"}`}>
            {outOfStock
              ? "Sold out"
              : product.stock != null && product.stock <= 5
                ? `Only ${product.stock} left`
                : "In stock, ready to ship"}
          </p>

          <div className="mt-4 flex items-stretch gap-2">
            <div className="flex items-center border border-ink/20">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="px-3 py-3 text-ink/70 transition hover:text-gold"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                aria-label="Increase quantity"
                className="px-3 py-3 text-ink/70 transition hover:text-gold"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                added ? "bg-gold" : "bg-ink hover:bg-gold"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to cart
                </>
              ) : (
                "Add to cart"
              )}
            </button>

            <button
              onClick={() => toggleWishlist(item)}
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={wishlisted}
              className="flex w-12 items-center justify-center border border-ink/20 text-ink transition hover:border-ink"
            >
              <Heart className={`h-5 w-5 ${wishlisted ? "fill-gold text-gold" : ""}`} />
            </button>
          </div>

          <dl className="mt-10 border-t border-ink/10 text-sm">
            <div className="flex justify-between gap-6 border-b border-ink/10 py-3">
              <dt className="text-ink/60">Delivery</dt>
              <dd className="text-right text-ink">Same-day in Lagos when ordered on WhatsApp</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-ink/10 py-3">
              <dt className="text-ink/60">Payment</dt>
              <dd className="text-right text-ink">Transfer, Klump, or weekly instalments</dd>
            </div>
          </dl>

          <a
            href={whatsappUrl(`Hi Fidex, I have a question about ${product.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-medium text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-gold"
          >
            Ask about this item on WhatsApp
          </a>
        </div>
      </div>

      <ProductPanel heading="You may also like" products={related} href={product.category ? `/shop?category=${product.category}` : "/shop"} />
    </div>
  );
}
