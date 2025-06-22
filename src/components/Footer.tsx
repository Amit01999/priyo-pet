import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const services = [
    'General Checkups',
    'Surgery & Emergency',
    'Pet Vaccinations',
    'Dental Care',
    'Grooming & Wellness',
    'Lab Testing',
  ];

  const quickLinks = [
    'About Us',
    'Our Services',
    'Meet Our Vets',
    'Testimonials',
    'Book Appointment',
    'Emergency Care',
  ];

  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-lg">
                  Priyo Pet & Vet Care
                </h3>
                <p className="text-sm text-gray-300">Khulna, Bangladesh</p>
              </div>
            </div>

            <p className="text-gray-300 font-opensans leading-relaxed">
              Because your pets deserve the best care. We provide expert
              veterinary services with genuine compassion and love.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+8801973968669</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  House 105/A, Road 02, Nirjon Residential Area, Nirala,
                  <br /> Khulna, Bangladesh
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>24/7 Emergency Services</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4">
              Our Services
            </h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#services"
                    className="text-gray-300 hover:text-primary transition-colors duration-200 text-sm font-opensans"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-300 hover:text-primary transition-colors duration-200 text-sm font-opensans"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4">
              Stay Connected
            </h4>
            <p className="text-gray-300 text-sm mb-4 font-opensans">
              Subscribe to get pet care tips and clinic updates.
            </p>

            <div className="space-y-3">
              <Input
                placeholder="Enter your email"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary"
              />
              <Button className="w-full bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>

            {/* Social Media Placeholder */}
            <div className="mt-6">
              <p className="text-sm text-gray-300 mb-3">Follow us on:</p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200 cursor-pointer">
                  <span className="text-xs">FB</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200 cursor-pointer">
                  <span className="text-xs">IG</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200 cursor-pointer">
                  <span className="text-xs">WA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm font-opensans">
              © {new Date().getFullYear()} Priyo Pet & Vet Care. All rights
              reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
