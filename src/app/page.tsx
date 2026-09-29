import CategoriesSection from "./components/CategoriesSection";
import Hero from "./components/Hero";
import ProductRail from "./components/ProductRail";
import QualityGrid from "./components/QualityGrid";
import Ticker from "./components/Ticker";
import TrustSection from "./components/TrustSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <CategoriesSection />
      <ProductRail heading="New arrivals" query="sort=newest&limit=4" href="/shop" />
      <TrustSection />
      <ProductRail
        heading="Thrift picks"
        subtitle="Carefully selected finds at a lower price."
        query="onSale=true&limit=4"
        href="/shop"
      />
      <QualityGrid />
    </>
  );
}
