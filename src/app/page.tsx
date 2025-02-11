import { UserButton } from "@clerk/nextjs";
import HeroHome from "./HomeComponents/hero-home";
import BusinessCategories from "./HomeComponents/business-categories";
import FeaturesPlanet from "./HomeComponents/features-planet";
import LargeTestimonial from "./HomeComponents/large-testimonial";
import Cta from "./HomeComponents/cta";
import Header from "./HomeComponents/header";
import Footer from "./HomeComponents/footer";
import DashboardHeader from "./dashboard/_components/DashboardHeader";

export default function Home() {
  return (
    <div>
      <Header/>
      <HeroHome />
      <BusinessCategories />
      <FeaturesPlanet />
      <LargeTestimonial />
      {/* <Cta /> */}
      <Footer />
    </div>
  );
}
