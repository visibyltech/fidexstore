import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

const categories = [
  { name: "Clothing", slug: "clothing" },
  { name: "Accessories", slug: "accessories" },
  { name: "Grooming", slug: "grooming" },
  { name: "Essentials", slug: "essentials" },
];

const Hero = () => {
  return (
    <section className="grid grid-cols-1 border-b border-ink/10 lg:grid-cols-12">
      <div className="flex flex-col justify-between bg-cream px-4 py-10 md:px-10 md:py-14 lg:col-span-5">
        <div>
          <h1 className="display-type text-[clamp(3.25rem,14vw,5.5rem)] text-ink uppercase lg:text-[clamp(3.5rem,5.6vw,6.5rem)]">
            Style.
            <br />
            Confidence.
            <br />
            <span className="text-gold">Everything you.</span>
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-ink/70">
            Clothing, accessories, grooming and everyday essentials. Every piece is checked by hand
            before it goes up, and new drops land every week.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/shop"
              className="group flex items-center gap-3 bg-gold px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href={whatsappUrl("Hi Fidex, I'd like to place an order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-gold"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>

        <nav aria-label="Shop by category" className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/15 pt-5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group flex items-center gap-1 text-sm text-ink/70 transition hover:text-gold"
            >
              {category.name}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-1 bg-white lg:col-span-7">
        <HeroTile
          href="/shop?category=clothing"
          src="/products-fidex/tshirt-black.jpg"
          alt="Black crew-neck t-shirt"
          label="Clothing"
          className="row-span-2 aspect-3/4 lg:aspect-auto"
          priority
        />
        <HeroTile
          href="/shop?category=essentials"
          src="/products-fidex/sneakers.jpg"
          alt="White canvas sneakers"
          label="Essentials"
          className="aspect-square lg:aspect-auto"
        />
        <HeroTile
          href="/shop?category=accessories"
          src="/products-fidex/watch.jpg"
          alt="Analogue wristwatch"
          label="Accessories"
          className="aspect-square lg:aspect-auto"
        />
      </div>
    </section>
  );
};

type HeroTileProps = {
  href: string;
  src: string;
  alt: string;
  label: string;
  className?: string;
  priority?: boolean;
};

const HeroTile = ({ href, src, alt, label, className = "", priority }: HeroTileProps) => (
  <Link href={href} className={`group relative overflow-hidden bg-cream lg:min-h-56 ${className}`}>
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(min-width: 1024px) 30vw, 50vw"
      className="object-cover transition duration-500 group-hover:scale-[1.03]"
    />
    <span className="absolute bottom-4 left-4 bg-white px-3 py-1.5 text-sm font-medium text-ink transition group-hover:bg-gold group-hover:text-white">
      {label}
    </span>
  </Link>
);

export default Hero;
