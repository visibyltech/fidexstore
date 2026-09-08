import ShopHeader from "../components/shop/ShopHeader";
import ShopSidebar from "../components/shop/ShopSidebar";
import ShopToolbar from "../components/shop/ShopToolbar";
import ShopProductCard, { ShopProduct } from "../components/shop/ShopProductCard";

const products: ShopProduct[] = [
  { id: 1, category: "Smartphones", name: "Samsung Galaxy S21", image: "/hero2.jpg", price: 300000, oldPrice: 340000, rating: 5, reviews: 12 },
  { id: 2, category: "Smartphones", name: "iPhone Collection", image: "/hero3.jpg", price: 450000, rating: 4, reviews: 8 },
  { id: 3, category: "Smartphones", name: "Premium Phone Set", image: "/hero1.jpg", price: 280000, oldPrice: 320000, rating: 5, reviews: 15 },
  { id: 4, category: "Laptops", name: "MacBook Air", image: "/crop-laptop.jpg", price: 650000, rating: 4, reviews: 6 },
  { id: 5, category: "Wearables", name: "Smartwatch Pro", image: "/crop-watch.jpg", price: 120000, oldPrice: 145000, rating: 5, reviews: 10 },
  { id: 6, category: "Audio", name: "Wireless Earbuds Pro", image: "/crop-airpods.jpg", price: 25000, rating: 4, reviews: 20 },
  { id: 7, category: "Power Banks", name: "Ambrane Power Bank", image: "/crop-powerbank.jpg", price: 15000, oldPrice: 18000, rating: 4, reviews: 9 },
  { id: 8, category: "Accessories", name: "Leather Wallet Case", image: "/crop-wallet.jpg", price: 8000, rating: 3, reviews: 4 },
  { id: 9, category: "Accessories", name: "Mechanical Keyboard", image: "/crop-keyboard.jpg", price: 35000, oldPrice: 40000, rating: 4, reviews: 7 },
  { id: 10, category: "Smartphones", name: "Samsung Galaxy S21", image: "/hero2.jpg", price: 300000, rating: 5, reviews: 12 },
  { id: 11, category: "Wearables", name: "Smartwatch Pro", image: "/crop-watch.jpg", price: 120000, oldPrice: 135000, rating: 4, reviews: 5 },
  { id: 12, category: "Audio", name: "Wireless Earbuds Pro", image: "/crop-airpods.jpg", price: 25000, rating: 5, reviews: 18 },
];

export default function ShopPage() {
  return (
    <div className="pb-16">
      <ShopHeader />

      <div className="mx-10 mt-8 flex flex-col gap-8 md:flex-row">
        <ShopSidebar />

        <div className="flex-1">
          <ShopToolbar total={products.length} />

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
