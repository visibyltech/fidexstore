import Link from "next/link";

const ShopHeader = ({ title = "Shop everything" }: { title?: string }) => {
  return (
    <div className="border-b border-ink/10 bg-cream px-4 py-10 md:px-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs text-ink/60">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Shop</span>
      </nav>
      <h1 className="display-type mt-3 text-5xl text-ink md:text-7xl">{title}</h1>
    </div>
  );
};

export default ShopHeader;
