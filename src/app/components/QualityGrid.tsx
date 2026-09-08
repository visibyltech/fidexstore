import Image from "next/image";

const QualityGrid = () => {
  return (
    <div className="mx-10 mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="relative h-100 overflow-hidden rounded-3xl md:h-auto">
        <Image
          src="/pexels-phong-thanh-3607237-36680544.jpg"
          alt="Quality control"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <p className="absolute bottom-8 left-8 text-2xl font-semibold tracking-wide uppercase">
          Quality Control
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative h-48 overflow-hidden rounded-3xl">
          <Image src="/hero3.jpg" alt="Device testing" fill className="object-cover" />
        </div>
        <div className="relative h-48 overflow-hidden rounded-3xl">
          <Image src="/hero1.jpg" alt="Device lineup" fill className="object-cover" />
        </div>
        <div className="relative col-span-2 h-48 overflow-hidden rounded-3xl">
          <Image src="/hero2.jpg" alt="Devices ready for sale" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
};

export default QualityGrid;
