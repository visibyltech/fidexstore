"use client";

import { useState } from "react";
import ProductImage from "../ProductImage";
import Link from "next/link";
import { Heart, Star, Plus, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import type { ApiProduct } from "@/types/api";

export type ShopProduct = {
  id: number;
  category: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
};

export const toShopProduct = (product: ApiProduct): ShopProduct => ({
  id: product.id,
  category: product.category_name,
  name: product.name,
  image: product.image ?? "",
  price: product.price,
  oldPrice: product.old_price ?? undefined,
  rating: Number(product.rating),
  reviews: product.reviews_count,
});

const Rating = ({ rating, reviews }: { rating: number; reviews: number }) =>
  reviews > 0 ? (
    <p className="flex items-center gap-1 text-xs text-ink/60">
      <Star className="h-3 w-3 fill-ink text-ink" />
      {rating.toFixed(1)}
      <span className="text-ink/40">({reviews})</span>
    </p>
  ) : null;

const ShopProductCard = ({
  product,
  layout = "grid",
}: {
  product: ShopProduct;
  layout?: "grid" | "list";
}) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const item = { id: product.id, name: product.name, image: product.image, price: product.price };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const price = (
    <p className="flex items-baseline gap-2 text-sm">
      <span className="font-semibold text-ink">₦{product.price.toLocaleString()}</span>
      {product.oldPrice && (
        <span className="text-xs text-ink/40 line-through">₦{product.oldPrice.toLocaleString()}</span>
      )}
    </p>
  );

  // The link's ::after covers the whole card, so clicking anywhere opens the
  // product; the buttons sit above it with relative z-10.
  const nameLink = (
    <Link
      href={`/product/${product.id}`}
      className="transition group-hover:text-gold after:absolute after:inset-0 after:content-['']"
    >
      {product.name}
    </Link>
  );

  const wishlistButton = (
    <button
      onClick={() => toggleWishlist(item)}
      aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      aria-pressed={wishlisted}
      className="relative z-10 flex h-9 w-9 items-center justify-center bg-white text-ink transition hover:text-gold"
    >
      <Heart className={`h-4 w-4 ${wishlisted ? "fill-gold text-gold" : ""}`} />
    </button>
  );

  const addButton = (
    <button
      onClick={handleAddToCart}
      aria-label={`Add ${product.name} to cart`}
      className={`relative z-10 flex h-10 w-10 items-center justify-center text-white transition ${
        added ? "bg-gold" : "bg-ink hover:bg-gold"
      }`}
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );

  const saleBadge =
    discount > 0 ? (
      <span className="pointer-events-none absolute top-2 left-2 z-10 bg-gold px-2 py-1 text-xs font-semibold text-white">
        -{discount}%
      </span>
    ) : null;

  const image = (sizes: string) =>
    <ProductImage
        src={product.image}
        alt={product.name}
        fill
        sizes={sizes}
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
      />;

  if (layout === "list") {
    return (
      <article className="group relative flex items-center gap-4 border-b border-ink/10 pb-4">
        <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-cream">
          {saleBadge}
          {image("96px")}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-ink/50">{product.category}</p>
          <h3 className="mt-0.5 truncate text-sm font-medium text-ink">{nameLink}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            {price}
            <Rating rating={product.rating} reviews={product.reviews} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {wishlistButton}
          {addButton}
        </div>
      </article>
    );
  }

  return (
    <article className="group relative">
      <div className="relative aspect-4/5 overflow-hidden bg-cream">
        {saleBadge}
        <div className="absolute top-2 right-2 z-10">{wishlistButton}</div>
        {image("(min-width: 1024px) 25vw, 50vw")}
        <div className="absolute right-2 bottom-2 z-10">{addButton}</div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-ink/50">{product.category}</p>
        <h3 className="mt-0.5 text-sm font-medium text-ink">{nameLink}</h3>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          {price}
          <Rating rating={product.rating} reviews={product.reviews} />
        </div>
      </div>
    </article>
  );
};

export default ShopProductCard;
