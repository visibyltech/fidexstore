import Image from "next/image";

const QualityGrid = () => {
  return (
    <div className="mx-10 mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="relative h-100 overflow-hidden rounded-3xl md:h-auto">
        <Image
          src="/products-fidex/backpack.jpg"
          alt="Fidex accessories, ready for everyday carry"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <p className="absolute bottom-8 left-8 text-2xl font-semibold tracking-wide text-white uppercase">
          New Drops Weekly
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative h-48 overflow-hidden rounded-3xl">
          <Image src="/products-fidex/sunglasses.jpg" alt="Fidex sunglasses" fill className="object-cover" />
        </div>
        <div className="relative h-48 overflow-hidden rounded-3xl">
          <Image src="/products-fidex/cap.jpg" alt="Fidex cap" fill className="object-cover" />
        </div>
        <div className="relative col-span-2 h-48 overflow-hidden rounded-3xl">
          <Image src="/products-fidex/grooming-set.jpg" alt="Fidex grooming set" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
};

export default QualityGrid;
