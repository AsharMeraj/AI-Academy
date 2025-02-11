import HeroHome from "./HomeComponents/hero-home";
import BusinessCategories from "./HomeComponents/business-categories";
import FeaturesPlanet from "./HomeComponents/features-planet";
import LargeTestimonial from "./HomeComponents/large-testimonial";
import Header from "./HomeComponents/header";
import Footer from "./HomeComponents/footer";

export default function Home() {
  return (
    <div>
      <Header/>
      <HeroHome />
      <BusinessCategories />
      <FeaturesPlanet />
      <LargeTestimonial />
      <Footer />
    </div>
  );
}
