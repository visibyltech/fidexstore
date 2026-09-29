import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="bg-cream px-4 py-20 md:px-10 md:py-28">
      <p className="display-type text-[7rem] leading-none text-gold md:text-[12rem]">404</p>
      <h1 className="display-type mt-4 text-4xl text-ink md:text-5xl">We couldn&apos;t find that page.</h1>
      <p className="mt-4 max-w-md text-ink/70">
        The link may be old or the item may have sold out. Everything we have in stock is in the shop.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <Link
          href="/shop"
          className="group flex items-center gap-2 bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gold"
        >
          Go to the shop <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-gold"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
