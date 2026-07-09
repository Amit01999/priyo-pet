import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, Menu, X } from 'lucide-react';
import logo from '../../public/logo1.png';

const SCROLL_THRESHOLD = 24;

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToCampaign = () => {
    setIsMenuOpen(false);
    navigate('/campaigns/rabies-vaccination-2026');
  };

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Our Vets', href: '#vets' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(26,61,26,0.18)] border-b border-[#1a3d1a]/[0.06]'
          : 'bg-[#EFFDF0] border-b border-transparent'
      }`}
    >
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
          <div className="hidden lg:flex items-center space-x-3">
            <a href="tel:01973968669">
              <Button className="flex items-center justify-center space-x-2 bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </Button>
            </a>

            <Button
              className="bg-[#E86A10] hover:bg-[#d45e0d] text-white rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              onClick={goToCampaign}
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
                <Button className="w-full flex items-center justify-center space-x-2 bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-md transition-all duration-300">
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </Button>
              </a>

              <Button
                onClick={goToCampaign}
                className="w-full bg-[#E86A10] hover:bg-[#d45e0d] text-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
              >
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
