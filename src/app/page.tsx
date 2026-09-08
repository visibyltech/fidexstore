import Accessoriessection from "./components/Accessoriessection";
import CategoriesSection from "./components/CategoriesSection";
import Devicesection from "./components/Devicesection";
import Hero from "./components/Hero";
import QualityGrid from "./components/QualityGrid";
import TrustSection from "./components/TrustSection";

export default function Home() {
  return (
    <div className="pb-16">
      <Hero />
      <CategoriesSection />
      <Devicesection />
      <TrustSection />
      <QualityGrid />
      <Accessoriessection />
    </div>
  );
}
