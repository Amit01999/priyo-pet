import { Button } from '@/components/ui/button';
import { Calendar, Phone } from 'lucide-react';

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(22, 160, 133, 0.6), rgba(22, 160, 133, 0.5)), url('https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=1920&h=1080&fit=crop')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in mt-28 md:mt-24 lg:mt-28 ">
          <h1 className=" font-poppins font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Expert Veterinary Care with{' '}
            <span className="text-secondary pt-5">Love & Innovation</span>
          </h1>

          <p className="font-opensans text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Khulna's trusted clinic for advanced treatments and heartfelt care.
            <br />
            <span className="font-semibold">
              Because your pets deserve the best care.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() =>
                window.open('https://www.facebook.com/priyopetbd', '_blank')
              }
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book an Appointment
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-secondary bg-green-50 text-primary hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="w-5 h-5 mr-2" />
              Meet Our Vets
            </Button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16 animate-slide-in-right">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold font-poppins">1000+</div>
            <div className="text-sm opacity-90">Happy Pets Treated</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold font-poppins">5+</div>
            <div className="text-sm opacity-90">Years of Excellence</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold font-poppins">24/7</div>
            <div className="text-sm opacity-90">Emergency Care</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
