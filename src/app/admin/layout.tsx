"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return <div className="mx-4 md:mx-10 mt-16 mb-16 text-center text-sm text-ink/50">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-4 md:mx-10 mt-16 mb-16 bg-cream py-16 text-center">
        <h1 className="display-type text-4xl">Sign in required</h1>
        <p className="mt-2 text-sm text-ink/60">
          You need to sign in with an admin account to access this page.
        </p>
        <Link
          href="/login?next=/admin"
          className="mt-6 inline-block bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-4 md:mx-10 mt-16 mb-16 bg-cream py-16 text-center">
        <h1 className="display-type text-4xl">Access denied</h1>
        <p className="mt-2 text-sm text-ink/60">This area is for administrators only.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-10 md:px-10">
      <h1 className="display-type text-5xl md:text-6xl">Admin</h1>

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-ink/10 pb-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 text-sm font-medium transition ${
              pathname === link.href ? "bg-ink text-white" : "text-ink/60 hover:text-gold"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
