"use client";

import ShopProductCard, { ShopProduct } from "./shop/ShopProductCard";
import SectionHeading from "./SectionHeading";

type ProductPanelProps = {
  heading: string;
  subtitle?: string;
  products: ShopProduct[];
  href?: string;
};

const ProductPanel = ({ heading, subtitle, products, href }: ProductPanelProps) => {
  if (products.length === 0) return null;

  return (
    <section className="px-4 pt-16 md:px-10 md:pt-24">
      <SectionHeading title={heading} description={subtitle} href={href} />

      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4">
        {products.map((product) => (
          <ShopProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductPanel;
