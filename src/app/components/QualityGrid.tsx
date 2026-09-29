import Image from "next/image";
import Link from "next/link";

const tileImage = "object-cover transition duration-300 group-hover:scale-105";

const QualityGrid = () => {
  return (
    <div className="mx-10 mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
      <Link href="/shop" className="group relative h-100 overflow-hidden rounded-3xl md:h-auto">
        <Image
          src="/products-fidex/backpack.jpg"
          alt="Fidex accessories, ready for everyday carry"
          fill
          className={tileImage}
        />
        <div className="absolute inset-0 bg-black/50" />
        <p className="absolute bottom-8 left-8 text-2xl font-semibold tracking-wide text-white uppercase">
          New Drops Weekly
        </p>
      </Link>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/shop?category=accessories" className="group relative h-48 overflow-hidden rounded-3xl">
          <Image src="/products-fidex/sunglasses.jpg" alt="Fidex sunglasses" fill className={tileImage} />
        </Link>
        <Link href="/shop?category=accessories" className="group relative h-48 overflow-hidden rounded-3xl">
          <Image src="/products-fidex/cap.jpg" alt="Fidex cap" fill className={tileImage} />
        </Link>
        <Link href="/shop?category=grooming" className="group relative col-span-2 h-48 overflow-hidden rounded-3xl">
          <Image src="/products-fidex/grooming-set.jpg" alt="Fidex grooming set" fill className={tileImage} />
        </Link>
      </div>
    </div>
  );
};

export default QualityGrid;
