import Link from "next/link";
import { ArrowRight, Hammer } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-10 mt-16 mb-16 flex flex-col items-center rounded-3xl bg-black/5 py-24 text-center">
      <Hammer className="h-12 w-12 text-gold" />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        Coming <span className="text-gold">Soon</span>
      </h1>
      <p className="mt-3 max-w-md text-sm text-black/60">
        This page is still being built. In the meantime, explore our full range of new and
        thrifted shoes.
      </p>
      <Link
        href="/shop"
        className="mt-8 flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-wide text-black uppercase transition hover:bg-gold/90"
      >
        Shop Shoes <ArrowRight className="h-4 w-4" />
      </Link>
      <Link href="/" className="mt-4 text-sm text-black/50 transition hover:text-gold">
        Back to Home
      </Link>
    </div>
  );
}
