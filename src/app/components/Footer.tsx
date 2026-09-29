"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { SITE, whatsappUrl } from "@/lib/site";

const shopLinks = [
  { name: "Shop all", href: "/shop" },
  { name: "Clothing", href: "/shop?category=clothing" },
  { name: "Accessories", href: "/shop?category=accessories" },
  { name: "Grooming", href: "/shop?category=grooming" },
  { name: "Essentials", href: "/shop?category=essentials" },
];

const helpLinks = [
  { name: "Contact us", href: "/contact" },
  { name: "My account", href: "/account" },
  { name: "Wishlist", href: "/wishlist" },
  { name: "Cart", href: "/cart" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState("");

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setStatus("submitting");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);

    if (!res?.ok) {
      const data = await res?.json().catch(() => null);
      setError(data?.error ?? "We couldn't sign you up. Please try again.");
      setStatus("idle");
      return;
    }
    setStatus("done");
    setEmail("");
  };

  return (
    <footer className="mt-16 bg-ink text-cream md:mt-24">
      <div className="grid grid-cols-1 gap-12 px-4 pt-14 pb-10 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="display-type text-4xl md:text-5xl">Hear about new drops first.</h2>
          {status === "done" ? (
            <p className="mt-6 text-sm text-cream/80">
              You are on the list. We will email you when the next drop lands.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 flex max-w-md border-b border-cream/40 focus-within:border-cream">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full bg-transparent py-3 text-sm text-cream placeholder:text-cream/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="flex shrink-0 items-center gap-2 py-3 pl-4 text-sm font-medium text-cream transition hover:text-gold-light disabled:opacity-60"
              >
                {status === "submitting" ? "Signing up" : "Sign up"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
          {error && <p className="mt-2 text-sm text-gold-light">{error}</p>}
        </div>

        <nav aria-label="Shop" className="lg:col-span-2 lg:col-start-7">
          <h3 className="text-sm font-semibold">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            {shopLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="transition hover:text-cream">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Help" className="lg:col-span-2">
          <h3 className="text-sm font-semibold">Help</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            {helpLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="transition hover:text-cream">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="text-sm leading-relaxed text-cream/70 not-italic lg:col-span-2">
          <h3 className="text-sm font-semibold text-cream">Visit or call</h3>
          <p className="mt-4">{SITE.city}</p>
          <p className="mt-2">
            <a href={`tel:${SITE.phoneDisplay.replace(/\s/g, "")}`} className="transition hover:text-cream">
              {SITE.phoneDisplay}
            </a>
          </p>
          <p>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="transition hover:text-cream">
              WhatsApp us
            </a>
          </p>
          <p>
            <a href={`mailto:${SITE.email}`} className="transition hover:text-cream">
              {SITE.email}
            </a>
          </p>
          <div className="mt-2">
            {SITE.hours.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </address>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-cream/15 px-4 py-6 md:px-10">
        <Logo tone="light" size="lg" />
        <p className="text-xs text-cream/60">
          © {new Date().getFullYear()} {SITE.name}. {SITE.tagline}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
