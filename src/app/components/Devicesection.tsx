import ProductPanel, { Product } from "./ProductPanel";

const devices: Product[] = [
  { id: 1, name: "Samsung Galaxy S21", price: 300000, image: "/hero2.jpg" },
  { id: 2, name: "iPhone Collection", price: 450000, image: "/hero3.jpg" },
  { id: 3, name: "Premium Phone Set", price: 280000, image: "/hero1.jpg" },
  { id: 4, name: "MacBook Air", price: 650000, image: "/crop-laptop.jpg" },
  { id: 5, name: "Smartwatch Pro", price: 120000, image: "/crop-watch.jpg" },
];

const Devicesection = () => {
  return (
    <ProductPanel
      heading="Best Sellers"
      subtitle="Explore our diverse range of devices trusted by thousands."
      products={devices}
      ctaLabel="Shop Now"
    />
  );
};

export default Devicesection;
