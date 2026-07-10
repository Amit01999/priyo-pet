import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import VetsSection from '@/components/VetsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BookingSection from '@/components/BookingSection';
import Footer from '@/components/Footer';
import DoctorCards from '@/components/DoctorCards';
import FeaturedProducts from '@/components/FeaturedProducts';
import { useScrollToHash } from '@/hooks/useScrollToHash';

const Index = () => {
  useScrollToHash();

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      {/* <ServicesSection /> */}
      <DoctorCards />
      <FeaturedProducts />
      <TestimonialsSection />
      <BookingSection />
      <Footer />
    </div>
  );
};

export default Index;
