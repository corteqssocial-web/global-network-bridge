import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InternationalDiasporaHero from "@/components/InternationalDiasporaHero";
import DiasporaSearchBar from "@/components/DiasporaSearchBar";
import ConsultantCategories from "@/components/ConsultantCategories";
import FeaturedConsultants from "@/components/FeaturedConsultants";
import FeaturedEvents from "@/components/FeaturedEvents";
import AssociationsSection from "@/components/AssociationsSection";
import BusinessesSection from "@/components/BusinessesSection";
import Footer from "@/components/Footer";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";
import { useDiaspora } from "@/contexts/DiasporaContext";

const Index = () => {
  const { diaspora } = useDiaspora();
  const isInternational = diaspora !== "tr";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {isInternational ? (
        <>
          <InternationalDiasporaHero />
          <Footer />
        </>
      ) : (
        <>
          <HeroSection />
          <SectionErrorBoundary sectionName="DiasporaSearchBar">
            <DiasporaSearchBar />
          </SectionErrorBoundary>
          <ConsultantCategories />
          <FeaturedConsultants />
          <AssociationsSection />
          <BusinessesSection />
          <FeaturedEvents />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;
