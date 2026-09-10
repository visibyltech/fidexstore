"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const links = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Contact", href: "/" },
];

const deviceCategories = [
  "Smartphones",
  "Laptops",
  "Wearables",
  "Audio",
  "Power Banks",
  "Accessories",
];

const Navbar = () => {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between gap-6 border-b border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 md:px-10">
        <div className="flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee gap-16">
            <p className="whitespace-nowrap">
              Free shipping on orders over ₦200,000 | 30-Day Warranty on all devices
            </p>
            <p className="whitespace-nowrap">
              Free shipping on orders over ₦200,000 | 30-Day Warranty on all devices
            </p>
          </div>
        </div>
        {user ? (
          <div className="flex shrink-0 items-center gap-4">
            {user.role === "admin" && (
              <Link href="/admin" className="hover:text-gold">
                Admin Panel
              </Link>
            )}
            <span className="hidden text-white/40 sm:inline">Hi, {user.name.split(" ")[0]}</span>
            <button onClick={() => logout()} className="cursor-pointer hover:text-gold">
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" className="shrink-0 hover:text-gold">
            Sign In
          </Link>
        )}
      </div>

      {/* mobile row */}
      <div className="grid grid-cols-3 items-center px-4 py-4 md:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="justify-self-start text-white/80"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link href="/" className="justify-self-center">
          <Image src="/logo-icon.png" alt="Richmond Trust Devices" width={70} height={26} priority />
        </Link>

        <Link href="/cart" className="relative justify-self-end text-white/80">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-black">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-white/10 bg-black px-4 py-4 md:hidden">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              pathname === "/" ? "text-gold" : "text-white/80"
            }`}
          >
            Home
          </Link>

          <p className="px-3 pt-2 text-xs font-semibold tracking-wide text-white/40">Devices</p>
          {deviceCategories.map((category) => (
            <Link
              key={category}
              href="/shop"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-white/70 hover:text-gold"
            >
              {category}
            </Link>
          ))}

          {links.slice(1).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`mt-1 rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === link.href && link.href !== "/" ? "text-gold" : "text-white/80"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="mt-2 flex items-center gap-6 border-t border-white/10 px-3 pt-4 text-white/80">
            <Search className="h-5 w-5" />
            <Heart className="h-5 w-5" />
          </div>

          {user ? (
            <div className="mt-3 flex flex-col gap-1 border-t border-white/10 px-3 pt-4">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-lg py-2 text-sm text-white/70 hover:text-gold"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="rounded-lg py-2 text-left text-sm text-white/70 hover:text-gold"
              >
                Sign Out ({user.name.split(" ")[0]})
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-lg border-t border-white/10 px-3 pt-4 text-sm text-white/70 hover:text-gold"
            >
              Sign In
            </Link>
          )}
        </div>
      )}

      {/* desktop row */}
      <div className="hidden items-center justify-between px-10 py-4 md:flex">
        <Link href="/">
          <Image src="/logo-icon.png" alt="Richmond Trust Devices" width={90} height={34} priority />
        </Link>

        <div className="flex items-center gap-10 rounded-full bg-white/5 px-8 py-3 text-sm font-medium tracking-wide">
          <Link
            href="/"
            className={`cursor-pointer transition hover:text-gold ${
              pathname === "/" ? "text-gold" : "text-white/80"
            }`}
          >
            Home
          </Link>

          <div className="group relative">
            <Link
              href="/shop"
              className="flex cursor-pointer items-center gap-1 text-white/80 transition hover:text-gold"
            >
              Devices
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>

            <div className="invisible absolute top-full left-1/2 z-20 w-48 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-black p-2 shadow-lg">
                {deviceCategories.map((category) => (
                  <Link
                    key={category}
                    href="/shop"
                    className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-gold"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {links.slice(1).map((link) => {
            const isActive = pathname === link.href && link.href !== "/";

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`cursor-pointer transition hover:text-gold ${
                  isActive ? "text-gold" : "text-white/80"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-5 text-white/80">
          <Search className="h-5 w-5 cursor-pointer transition hover:text-gold" />
          <Heart className="h-5 w-5 cursor-pointer transition hover:text-gold" />
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 cursor-pointer transition hover:text-gold" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-black">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
