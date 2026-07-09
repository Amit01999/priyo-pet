import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, MapPin, Clock } from 'lucide-react';
import logo from '../../public/logo1.png';

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
    <footer className="relative bg-[#1a3d1a] text-white overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 w-[26rem] h-[26rem] rounded-full bg-[#E86A10]/[0.08] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-24 w-[22rem] h-[22rem] rounded-full bg-white/[0.03] blur-3xl"
      />

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <div>
              <img src={logo} alt="Priyo Pet & Vet Care" className="h-16 w-auto rounded-lg" />
              <p className="text-sm text-white/50 mt-2">Khulna, Bangladesh</p>
            </div>

            <p className="text-white/60 leading-relaxed">
              Because your pets deserve the best care. We provide expert
              veterinary services with genuine compassion and love.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-sm text-white/70">
                <Phone className="w-4 h-4 text-[#E86A10] flex-shrink-0" />
                <span>+8801973968669</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-[#E86A10] flex-shrink-0 mt-0.5" />
                <span>
                  House 105/A, Road 02, Nirjon Residential Area, Nirala,
                  <br /> Khulna, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/70">
                <Clock className="w-4 h-4 text-[#E86A10] flex-shrink-0" />
                <span>24/7 Emergency Services</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif-display text-lg mb-5">Our Services</h4>
            <ul className="space-y-2.5">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#services"
                    className="text-white/60 hover:text-[#E86A10] transition-colors duration-200 text-sm"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif-display text-lg mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white/60 hover:text-[#E86A10] transition-colors duration-200 text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif-display text-lg mb-5">Stay Connected</h4>
            <p className="text-white/60 text-sm mb-4">
              Subscribe to get pet care tips and clinic updates.
            </p>

            <div className="space-y-3">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/15 text-white placeholder:text-white/40 rounded-xl h-11 focus-visible:ring-[#E86A10]/40 focus:border-[#E86A10]/50"
              />
              <Button className="w-full bg-[#E86A10] hover:bg-[#d45e0d] rounded-full shadow-md transition-all duration-300 hover:scale-[1.02]">
                Subscribe
              </Button>
            </div>

            {/* Social Media */}
            <div className="mt-7">
              <p className="text-sm text-white/50 mb-3">Follow us on:</p>
              <div className="flex gap-3">
                {['FB', 'IG', 'WA'].map((label) => (
                  <div
                    key={label}
                    className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E86A10] transition-all duration-300 hover:scale-110 cursor-pointer"
                  >
                    <span className="text-xs font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Priyo Pet & Vet Care. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/50 hover:text-[#E86A10] transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-white/50 hover:text-[#E86A10] transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-white/50 hover:text-[#E86A10] transition-colors duration-200">
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
