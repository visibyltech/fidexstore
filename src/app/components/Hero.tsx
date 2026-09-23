import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Sparkles, BadgeCheck, Truck, ShieldCheck } from "lucide-react";

const categories = [
  { name: "Clothing", slug: "clothing" },
  { name: "Accessories", slug: "accessories" },
  { name: "Grooming", slug: "grooming" },
  { name: "Essentials", slug: "essentials" },
];

const features = [
  { icon: BadgeCheck, label: "Quality Checked" },
  { icon: Sparkles, label: "Affordable Prices" },
  { icon: Truck, label: "New Drops Weekly" },
  { icon: ShieldCheck, label: "Satisfaction Guaranteed" },
];

const heroTiles = [
  { src: "/products-fidex/tshirt-black.jpg", alt: "Fidex black t-shirt" },
  { src: "/products-fidex/jeans.jpg", alt: "Fidex denim jeans" },
  { src: "/products-fidex/sneakers.jpg", alt: "Fidex canvas sneakers" },
  { src: "/products-fidex/watch.jpg", alt: "Fidex wristwatch" },
];

const Hero = () => {
  return (
    <div className="px-6 pt-6 md:px-10">
      <section className="grid grid-cols-1 gap-8 rounded-3xl bg-black/[0.03] p-8 md:grid-cols-2 md:p-14">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            Clothing &amp; Everyday Essentials
          </p>
          <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
            Style. Confidence.
            <br />
            <span className="text-gold">Everything You.</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-black/60">
            Clothing, accessories, grooming, and everyday essentials — curated
            for a look that&apos;s always on point, at prices that make sense.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="rounded-full border border-black/15 px-5 py-2 text-sm font-medium text-black/80 transition hover:border-gold hover:text-gold"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-wide text-black uppercase transition hover:bg-gold/90"
            >
              Shop Now
            </Link>
            <a
              href="https://wa.me/2348012345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-semibold tracking-wide uppercase transition hover:border-gold hover:text-gold"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-3">
          {heroTiles.map((tile, i) => (
            <div
              key={tile.src}
              className={`relative overflow-hidden rounded-2xl ${i === 0 ? "aspect-square" : "aspect-square"}`}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-cream px-4 py-3 text-black shadow-lg">
            <p className="text-sm font-semibold tracking-wide">Style. Confidence.</p>
            <p className="text-sm font-semibold tracking-wide text-gold">Everything You.</p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-3xl bg-black/[0.03] px-6 py-6 sm:grid-cols-4 md:px-10">
        {features.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0 text-gold" />
            <p className="text-xs font-medium tracking-wide text-black/70">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
