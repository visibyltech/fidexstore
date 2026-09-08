import Image from "next/image";
import Link from "next/link";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type ProductPanelProps = {
  heading: string;
  subtitle: string;
  products: Product[];
  ctaLabel?: string;
  showDots?: boolean;
};

const ProductPanel = ({ heading, subtitle, products, ctaLabel, showDots }: ProductPanelProps) => {
  return (
    <div className="mx-10 mt-16 rounded-3xl bg-white/4 px-6 py-10 md:px-10">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-wide uppercase">{heading}</h2>
        <p className="mt-2 text-sm text-white/50">{subtitle}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => (
          <div key={product.id}>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-xs font-medium tracking-wide text-white/70 uppercase">
              {product.name}
            </p>
            <p className="mt-1 text-sm font-semibold text-gold">
              ₦{product.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {ctaLabel && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-wide text-black uppercase transition hover:bg-gold/90"
          >
            {ctaLabel}
          </Link>
        </div>
      )}

      {showDots && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i === 0 ? "bg-gold" : "bg-white/20"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPanel;
