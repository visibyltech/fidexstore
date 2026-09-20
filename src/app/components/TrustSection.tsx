import Image from "next/image";
import { Check } from "lucide-react";

const points = [
  "Every pair carefully selected before it's listed",
  "New arrivals added regularly, every week",
  "Thrifted with care — gently used, greatly loved",
];

const TrustSection = () => {
  return (
    <div className="mx-10 mt-16 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
        <Image src="/shoe-men-leather.jpg" alt="A pair of leather shoes from Chined Closet" fill className="object-cover" />
      </div>

      <div>
        <h2 className="text-3xl font-semibold tracking-tight">
          Good Style. <span className="text-gold">Better Prices.</span>
        </h2>
        <p className="mt-4 text-white/60">
          At Chined Closet, every pair — new or thrifted — is carefully
          selected before it reaches you, so you can shop with confidence.
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
