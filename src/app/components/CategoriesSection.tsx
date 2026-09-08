import Image from "next/image";

const categories = [
  { name: "Smartphones", image: "/crop-phone.jpg" },
  { name: "Laptops", image: "/crop-laptop.jpg" },
  { name: "Wearables", image: "/crop-watch.jpg" },
  { name: "Audio", image: "/crop-airpods.jpg" },
  { name: "Power Banks", image: "/crop-powerbank.jpg" },
  { name: "Accessories", image: "/crop-wallet.jpg" },
];

const CategoriesSection = () => {
  return (
    <div className="mx-10 mt-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-wide uppercase">Categories</h2>
        <p className="mt-2 text-sm text-white/50">
          Explore our range of trusted, professionally vetted devices.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
        {categories.map((category) => (
          <div key={category.name} className="text-center">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-xs font-medium tracking-wide text-white/70 uppercase">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
