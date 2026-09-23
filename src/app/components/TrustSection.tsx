import Image from "next/image";
import { Check } from "lucide-react";

const points = [
  "Every item quality-checked before it's listed",
  "New drops added regularly, every week",
  "Sourced with care — style that's built to last",
];

const TrustSection = () => {
  return (
    <div className="mx-10 mt-16 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
        <Image src="/products-fidex/jeans.jpg" alt="Fidex denim and everyday wear" fill className="object-cover" />
      </div>

      <div>
        <h2 className="text-3xl font-semibold tracking-tight">
          Style. Confidence. <span className="text-gold">Everything You.</span>
        </h2>
        <p className="mt-4 text-black/60">
          At Fidex, every item — from clothing to grooming — is carefully
          picked before it reaches you, so you can shop with confidence.
        </p>

        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-black/80">
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
