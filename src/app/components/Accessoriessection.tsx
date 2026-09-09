import ProductPanel, { Product } from "./ProductPanel";

const accessories: Product[] = [
  { id: 7, name: "Ambrane Power Bank", price: 15000, image: "/crop-powerbank.jpg" },
  { id: 6, name: "Wireless Earbuds Pro", price: 25000, image: "/crop-airpods.jpg" },
  { id: 8, name: "Leather Wallet Case", price: 8000, image: "/crop-wallet.jpg" },
  { id: 9, name: "Mechanical Keyboard", price: 35000, image: "/crop-keyboard.jpg" },
];

const Accessoriessection = () => {
  return (
    <ProductPanel
      heading="Featured Deals"
      subtitle="Explore our diverse range of accessories for modern living."
      products={accessories}
      showDots
    />
  );
};

export default Accessoriessection;
