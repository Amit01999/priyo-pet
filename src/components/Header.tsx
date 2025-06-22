import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, Menu, X } from 'lucide-react';
import logo from '../../public/logo1.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Our Vets', href: '#vets' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <img src={logo} alt="PrioPet" className="h-12 w-auto" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-900 hover:text-primary transition-colors duration-200 font-opensans"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a href="tel:01973968669">
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 border-secondary bg-secondary text-white hover:bg-secondary/90"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </Button>
            </a>

            <Button
              className="bg-primary hover:bg-primary/90 flex items-center space-x-2"
              onClick={() =>
                window.open('https://www.facebook.com/priyopetbd', '_blank')
              }
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 hover:text-primary transition-colors duration-200 font-opensans py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col space-y-3 mt-4">
              <a href="tel:01973968669">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 border-secondary bg-secondary text-white hover:bg-secondary/90"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </Button>
              </a>

              <Button className="bg-primary hover:bg-primary/90 flex items-center justify-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
