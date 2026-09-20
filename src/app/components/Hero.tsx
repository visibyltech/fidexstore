import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Sparkles, BadgeCheck, Repeat, ShieldCheck, Truck } from "lucide-react";

const categories = [
  { name: "Women", slug: "women" },
  { name: "Men", slug: "men" },
  { name: "Children", slug: "children" },
];

const features = [
  { icon: BadgeCheck, label: "Carefully Selected" },
  { icon: Sparkles, label: "Affordable Prices" },
  { icon: Truck, label: "New Arrivals Regularly" },
  { icon: Repeat, label: "Thrifted With Care" },
  { icon: ShieldCheck, label: "Satisfaction Guaranteed" },
];

const Hero = () => {
  return (
    <div className="px-6 pt-6 md:px-10">
      <section className="grid grid-cols-1 gap-8 rounded-3xl bg-white/[0.03] p-8 md:grid-cols-2 md:p-14">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            New &amp; Thrift Shoes
          </p>
          <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
            Step Into Style,
            <br />
            Step Out in <span className="text-gold">Confidence.</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-white/60">
            Quality shoes for every step of your journey — for men, women, and
            children. Fashion, comfort, and quality, at better prices.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/80 transition hover:border-gold hover:text-gold"
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
              href="https://wa.me/2348034555302"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold tracking-wide uppercase transition hover:border-gold hover:text-gold"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
          </div>
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-2xl md:aspect-auto">
          <Image
            src="/shoe-hero-wall.jpg"
            alt="Wall of new sneakers in the Chined Closet shop"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-5 left-5 rounded-xl bg-cream px-4 py-3 text-black shadow-lg">
            <p className="text-sm font-semibold tracking-wide">Good Style.</p>
            <p className="text-sm font-semibold tracking-wide text-gold">Better Prices.</p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-3xl bg-white/[0.03] px-6 py-6 sm:grid-cols-3 md:grid-cols-5 md:px-10">
        {features.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0 text-gold" />
            <p className="text-xs font-medium tracking-wide text-white/70">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
