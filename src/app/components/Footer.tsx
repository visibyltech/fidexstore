"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, Mail, MessageCircle, Check } from "lucide-react";
import Logo from "./Logo";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Contact", href: "/contact" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSubmitting(true);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong");
      return;
    }
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="mt-16 border-t border-black/10 bg-black/[0.02] px-10 pt-14 pb-6">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div>
          <Logo withTagline />
          <p className="mt-4 max-w-xs text-sm text-black/60">
            New and thrift shoes for men, women, and children — carefully
            selected, gently loved, always in style.
          </p>

          <div className="mt-6 space-y-3 text-sm text-black/70">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              11, Demurin Street, off Ikorodu Road, Ketu, Lagos.
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold" />
              +234 803 455 5302
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 shrink-0 text-gold" />
              WhatsApp: +234 803 455 5302
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold" />
              hello@chinedcloset.com
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <div>
                Mon-Sat: 9:00am - 7:00pm
                <br />
                Sun: 12:00pm - 5:00pm
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide uppercase">Quick Links</h4>
          <div className="mt-4 flex flex-col gap-3 text-sm text-black/60">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="w-fit cursor-pointer transition hover:text-gold"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide uppercase">Stay Updated</h4>
          <p className="mt-4 text-sm text-black/60">
            Subscribe to hear about new arrivals and fresh thrift drops first.
          </p>

          <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-md border border-black/10 bg-black/5 px-4 py-2 text-sm text-black placeholder:text-black/40 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                subscribed ? "bg-green-500 text-black" : "bg-gold text-black hover:bg-gold/90"
              }`}
            >
              {subscribed ? (
                <>
                  <Check className="h-4 w-4" /> Subscribed
                </>
              ) : submitting ? (
                "Subscribing…"
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      </div>

      <div className="mt-12 border-t border-black/10 pt-6 text-center text-xs text-black/40">
        © 2026 Chined Closet. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
