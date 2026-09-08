import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";

type ShopToolbarProps = {
  total: number;
};

const ShopToolbar = ({ total }: ShopToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/5 px-5 py-3">
      <p className="text-sm text-white/60">
        Showing {total} of {total} products
      </p>

      <button className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15 md:hidden">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-white/60">
          Sort by:
          <select className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-white focus:outline-none">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="flex items-center gap-1 rounded-md bg-white/10 p-1">
          <div className="rounded bg-gold p-1.5 text-black">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <div className="rounded p-1.5 text-white/60">
            <List className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopToolbar;
