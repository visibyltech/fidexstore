"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import type { ApiCategory } from "@/types/api";
import { groupCategories } from "@/lib/categories";

const navLink = "text-sm text-ink/80 transition hover:text-gold";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    let cancelled = false;

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCategories(data.categories ?? []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryGroups = groupCategories(categories);
  const isFlatCatalog = categoryGroups.every((group) => group.children.length === 0);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 bg-white">
      <p className="bg-gold px-4 py-2 text-center text-xs text-white">
        New drops every week. WhatsApp us for same-day delivery in Lagos.
      </p>

      <div className="border-b border-ink/10">
        {/* mobile row */}
        <div className="flex items-center justify-between px-4 py-3 md:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="-ml-1 p-1 text-ink"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Logo />

          <Link href="/cart" className="text-sm font-medium text-ink">
            Cart ({itemCount})
          </Link>
        </div>

        {open && (
          <nav className="flex flex-col border-t border-ink/10 px-4 pb-6 md:hidden">
            <form onSubmit={submitSearch} className="mt-4 flex">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products"
                aria-label="Search products"
                className="w-full border border-ink/20 px-3 py-2.5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none"
              />
              <button type="submit" aria-label="Search" className="shrink-0 bg-ink px-4 text-white">
                <Search className="h-4 w-4" />
              </button>
            </form>

            <Link href="/shop" onClick={closeMenu} className="mt-4 border-b border-ink/10 py-3 text-base font-medium">
              Shop all
            </Link>
            {categoryGroups.map(({ parent, children }) => (
              <div key={parent.slug} className="border-b border-ink/10">
                <Link
                  href={`/shop?category=${parent.slug}`}
                  onClick={closeMenu}
                  className="block py-3 text-base font-medium"
                >
                  {parent.name}
                </Link>
                {!isFlatCatalog &&
                  children.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/shop?category=${category.slug}`}
                      onClick={closeMenu}
                      className="block pb-3 pl-4 text-sm text-ink/70"
                    >
                      {category.name}
                    </Link>
                  ))}
              </div>
            ))}
            <Link href="/contact" onClick={closeMenu} className="border-b border-ink/10 py-3 text-base font-medium">
              Contact
            </Link>
            <Link href="/wishlist" onClick={closeMenu} className="border-b border-ink/10 py-3 text-base font-medium">
              Wishlist ({wishlistCount})
            </Link>

            <div className="mt-4 flex flex-col gap-3 text-sm text-ink/70">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link href="/admin" onClick={closeMenu}>
                      Admin panel
                    </Link>
                  )}
                  <Link href="/account" onClick={closeMenu}>
                    My account
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="text-left"
                  >
                    Sign out ({user.name.split(" ")[0]})
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={closeMenu}>
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        )}

        {/* desktop row */}
        <div className="hidden grid-cols-[1fr_auto_1fr] items-center px-10 py-4 md:grid">
          <nav className="flex items-center gap-8">
            <div className="group relative">
              <Link href="/shop" className={`flex items-center gap-1 ${navLink} ${pathname === "/shop" ? "text-gold" : ""}`}>
                Shop <ChevronDown className="h-3.5 w-3.5" />
              </Link>

              <div className="invisible absolute top-full left-0 z-20 pt-4 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div
                  className={`border border-ink/10 bg-white p-5 ${
                    isFlatCatalog ? "flex w-56 flex-col gap-3" : "grid w-96 grid-cols-2 gap-6"
                  }`}
                >
                  {isFlatCatalog ? (
                    <>
                      {categoryGroups.map(({ parent }) => (
                        <Link key={parent.slug} href={`/shop?category=${parent.slug}`} className={navLink}>
                          {parent.name}
                        </Link>
                      ))}
                      <Link href="/shop" className="mt-1 border-t border-ink/10 pt-3 text-sm font-medium text-gold">
                        Shop all
                      </Link>
                    </>
                  ) : (
                    categoryGroups.map(({ parent, children }) => (
                      <div key={parent.slug} className="flex flex-col gap-2">
                        <Link href={`/shop?category=${parent.slug}`} className="text-sm font-semibold hover:text-gold">
                          {parent.name}
                        </Link>
                        {children.map((category) => (
                          <Link key={category.slug} href={`/shop?category=${category.slug}`} className={navLink}>
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {categoryGroups.slice(0, 3).map(({ parent }) => (
              <Link key={parent.slug} href={`/shop?category=${parent.slug}`} className={navLink}>
                {parent.name}
              </Link>
            ))}
            <Link href="/contact" className={`${navLink} ${pathname === "/contact" ? "text-gold" : ""}`}>
              Contact
            </Link>
          </nav>

          <Logo />

          <div className="flex items-center justify-end gap-6">
            <div className="relative">
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                aria-expanded={searchOpen}
                className="flex text-ink/80 transition hover:text-gold"
              >
                <Search className="h-4.5 w-4.5" />
              </button>

              {searchOpen && (
                <form
                  onSubmit={submitSearch}
                  className="absolute top-full right-0 z-20 mt-4 flex w-72 border border-ink/10 bg-white p-2"
                >
                  <input
                    autoFocus
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products"
                    aria-label="Search products"
                    className="w-full border border-ink/20 px-3 py-2 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none"
                  />
                  <button type="submit" aria-label="Submit search" className="shrink-0 bg-ink px-3 text-white">
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

            {user ? (
              <div className="group relative">
                <Link href="/account" className={navLink}>
                  Hi, {user.name.split(" ")[0]}
                </Link>
                <div className="invisible absolute top-full right-0 z-20 pt-4 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="flex w-44 flex-col gap-3 border border-ink/10 bg-white p-4">
                    {user.role === "admin" && (
                      <Link href="/admin" className={navLink}>
                        Admin panel
                      </Link>
                    )}
                    <Link href="/account" className={navLink}>
                      My account
                    </Link>
                    <button onClick={() => logout()} className={`text-left ${navLink}`}>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className={navLink}>
                Sign in
              </Link>
            )}

            <Link href="/wishlist" aria-label={`Wishlist, ${wishlistCount} items`} className="relative text-ink/80 transition hover:text-gold">
              <Heart className="h-4.5 w-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-gold"
            >
              Cart ({itemCount})
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
