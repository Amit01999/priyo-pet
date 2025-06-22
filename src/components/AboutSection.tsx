import { Button } from '@/components/ui/button';
import { Check, Heart, Star } from 'lucide-react';

const AboutSection = () => {
  const values = [
    'Expert veterinary professionals with years of experience',
    'State-of-the-art medical equipment and facilities',
    "Compassionate care tailored to each pet's unique needs",
    '24/7 emergency services for urgent situations',
    'Comprehensive wellness and preventive care programs',
  ];

  return (
    <section id="about" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
              <span className="text-primary font-semibold font-opensans">
                About Priyo Pet & Vet Care
              </span>
            </div>

            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-800 mb-6">
              Where Medical Excellence Meets
              <span className="text-primary"> Genuine Compassion</span>
            </h2>

            <p className="font-opensans text-gray-600 text-lg mb-6 leading-relaxed">
              At Priyo Pet & Vet Care, we believe every pet deserves exceptional
              medical care delivered with love and understanding. Our clinic
              combines cutting-edge veterinary technology with the warmth and
              compassion that makes us Khulna's most trusted animal healthcare
              provider.
            </p>

            <p className="font-opensans text-gray-600 mb-8 leading-relaxed">
              Founded with a mission to bridge the gap between advanced
              veterinary medicine and heartfelt pet care, we've been serving the
              Khulna community with dedication, ensuring every furry, feathered,
              or scaled friend receives the best possible treatment.
            </p>

            {/* Values List */}
            <div className="space-y-3 mb-8">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="font-opensans text-gray-700">{value}</span>
                </div>
              ))}
            </div>

            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full">
              Learn More About Our Mission
            </Button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop"
                alt="Cute kitten at vet clinic"
                className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full h-48 object-cover"
              />
              <img
                src="https://plus.unsplash.com/premium_photo-1700403586581-4aa6b8640492?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Happy pets at clinic"
                className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full h-64 object-cover"
              />
            </div>
            <div className="space-y-4 mt-8">
              <img
                src="https://images.unsplash.com/photo-1554456854-55a089fd4cb2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Professional vet care"
                className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1573435567032-ff5982925350?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Modern veterinary facility"
                className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary font-poppins mb-2">
              1000+
            </div>
            <div className="text-gray-600 font-opensans">Pets Treated</div>
          </div>
          <div className="text-center bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary font-poppins mb-2">
              5+
            </div>
            <div className="text-gray-600 font-opensans">Years Experience</div>
          </div>
          <div className="text-center bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary font-poppins mb-2">
              98%
            </div>
            <div className="text-gray-600 font-opensans">Success Rate</div>
          </div>
          <div className="text-center bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-secondary"
                  fill="currentColor"
                />
              ))}
            </div>
            <div className="text-gray-600 font-opensans">5-Star Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
