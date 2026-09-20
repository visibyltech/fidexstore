import Image from "next/image";

const QualityGrid = () => {
  return (
    <div className="mx-10 mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="relative h-100 overflow-hidden rounded-3xl md:h-auto">
        <Image
          src="/shoe-sandals-rack.jpg"
          alt="A rack of sandals ready for sale"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <p className="absolute bottom-8 left-8 text-2xl font-semibold tracking-wide text-white uppercase">
          Fresh Off The Rack
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative h-48 overflow-hidden rounded-3xl">
          <Image src="/shoe-women-heels.jpg" alt="Women's heels" fill className="object-cover" />
        </div>
        <div className="relative h-48 overflow-hidden rounded-3xl">
          <Image src="/shoe-kids-flats.jpg" alt="Children's shoes" fill className="object-cover" />
        </div>
        <div className="relative col-span-2 h-48 overflow-hidden rounded-3xl">
          <Image src="/shoe-men-leather.jpg" alt="Men's leather shoes" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
};

export default QualityGrid;
