import Image from "next/image";
import Link from "next/link";

const tiles = [
  {
    href: "/shop?category=accessories",
    src: "/products-fidex/backpack.jpg",
    alt: "Canvas backpack",
    label: "Everyday carry",
    className: "col-span-2 row-span-2 aspect-square md:aspect-auto",
  },
  {
    href: "/shop?category=accessories",
    src: "/products-fidex/sunglasses.jpg",
    alt: "Aviator sunglasses",
    label: "Sunglasses",
    className: "aspect-square",
  },
  {
    href: "/shop?category=essentials",
    src: "/products-fidex/cap.jpg",
    alt: "Snapback cap",
    label: "Caps",
    className: "aspect-square",
  },
  {
    href: "/shop?category=grooming",
    src: "/products-fidex/grooming-set.jpg",
    alt: "Grooming kit",
    label: "Grooming",
    className: "col-span-2 aspect-2/1",
  },
];

const QualityGrid = () => {
  return (
    <section className="mt-16 bg-ink px-4 py-14 text-cream md:mt-24 md:px-10 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="display-type text-5xl uppercase md:text-7xl">
          The <span className="text-gold">weekly</span> drop
        </h2>
        <p className="max-w-xs text-sm text-cream/70">
          A few things we are wearing right now. Tap any photo to shop the category.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-1 md:grid-cols-4 md:grid-rows-2">
        {tiles.map((tile) => (
          <Link key={tile.src} href={tile.href} className={`group relative overflow-hidden ${tile.className}`}>
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute bottom-3 left-3 bg-cream px-3 py-1.5 text-sm font-medium text-ink transition group-hover:bg-gold group-hover:text-white">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QualityGrid;
