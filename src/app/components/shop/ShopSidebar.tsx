import { Star } from "lucide-react";

const categories = [
  "All Products",
  "Smartphones",
  "Laptops",
  "Wearables",
  "Audio",
  "Power Banks",
  "Accessories",
];

const brands = [
  { name: "Samsung", count: 8 },
  { name: "Apple", count: 6 },
  { name: "Xiaomi", count: 3 },
  { name: "Infinix", count: 4 },
  { name: "Tecno", count: 2 },
  { name: "Ambrane", count: 3 },
];

const ShopSidebar = () => {
  return (
    <aside className="w-full shrink-0 md:w-64">
      <div>
        <h3 className="text-sm font-semibold tracking-wide uppercase">Categories</h3>
        <div className="mt-4 flex flex-col gap-3 text-sm">
          {categories.map((category, i) => (
            <p
              key={category}
              className={`w-fit cursor-pointer transition hover:text-gold ${
                i === 0 ? "font-medium text-gold" : "text-white/60"
              }`}
            >
              {category}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-8">
        <h3 className="text-sm font-semibold tracking-wide uppercase">Brand</h3>
        <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
          {brands.map((brand) => (
            <label key={brand.name} className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" className="accent-gold" />
              <span className="flex-1">{brand.name}</span>
              <span className="text-white/30">{brand.count}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-8">
        <h3 className="text-sm font-semibold tracking-wide uppercase">Price (₦)</h3>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Min"
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none"
          />
          <span className="text-white/40">-</span>
          <input
            type="text"
            placeholder="Max"
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-8">
        <h3 className="text-sm font-semibold tracking-wide uppercase">Customer Rating</h3>
        <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
          {[5, 4, 3].map((rating) => (
            <label key={rating} className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" className="accent-gold" />
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rating ? "fill-gold text-gold" : "text-white/20"
                    }`}
                  />
                ))}
              </span>
              <span>& Up</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ShopSidebar;
