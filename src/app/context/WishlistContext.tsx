"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { applyLiveProducts, fetchLiveProducts } from "@/lib/catalog-sync";

export type WishlistItem = {
  id: number;
  name: string;
  image: string;
  price: number;
};

type WishlistContextType = {
  items: WishlistItem[];
  isWishlisted: (id: number) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  itemCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "fidex-wishlist";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      let stored: WishlistItem[] = [];
      try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        stored = Array.isArray(parsed) ? parsed : [];
        setItems(stored);
      } catch {
        // ignore corrupted storage
      } finally {
        setHydrated(true);
      }

      // Same refresh as the cart: fix stale photos/prices, drop removed products.
      if (stored.length > 0) {
        fetchLiveProducts(stored.map((item) => item.id)).then((live) =>
          setItems((prev) => applyLiveProducts(prev, live))
        );
      }
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage failures (e.g. private browsing quota)
    }
  }, [items, hydrated]);

  const isWishlisted = (id: number) => items.some((item) => item.id === id);

  const toggleWishlist: WishlistContextType["toggleWishlist"] = (item) => {
    setItems((prev) =>
      prev.some((existing) => existing.id === item.id)
        ? prev.filter((existing) => existing.id !== item.id)
        : [...prev, item]
    );
  };

  const removeFromWishlist = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <WishlistContext.Provider
      value={{ items, isWishlisted, toggleWishlist, removeFromWishlist, itemCount: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
