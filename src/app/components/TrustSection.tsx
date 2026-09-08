import Image from "next/image";
import { Check } from "lucide-react";

const points = [
  "Every device inspected and tested before sale",
  "30-day warranty on all smartphones and laptops",
  "Genuine, original accessories only",
];

const TrustSection = () => {
  return (
    <div className="mx-10 mt-16 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
        <Image src="/hero1.jpg" alt="Devices we sell" fill className="object-cover" />
      </div>

      <div>
        <h2 className="text-3xl font-semibold tracking-tight">
          Trusted Quality. <span className="text-gold">Powerful Performance.</span>
        </h2>
        <p className="mt-4 text-white/60">
          At Richmond Trust Devices, every phone, laptop, and accessory is put
          through a rigorous inspection process before it reaches you — so you
          can buy with confidence.
        </p>

        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-white/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrustSection;
