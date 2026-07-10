import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  Menu,
  X,
  Store,
  ShoppingCart,
  User,
  Package,
  LogOut,
} from 'lucide-react';
import logo from '../../public/logo1.png';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import * as shopApi from '@/lib/api/shop.api';
import { scrollToSectionId } from '@/lib/scrollToSection';

const SCROLL_THRESHOLD = 24;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customer, logout } = useCustomerAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: shopApi.fetchCart,
    enabled: Boolean(customer),
  });
  const cartCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

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

  const isHome = location.pathname === '/';

  const getNavHref = (href: string) => {
    if (href === '#home') return isHome ? '#home' : '/';
    return isHome ? href : `/${href}`;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const id = href.slice(1);

    if (!isHome) {
      navigate(id === 'home' ? '/' : `/#${id}`);
      return;
    }

    window.history.replaceState(null, '', `#${id}`);
    scrollToSectionId(id);
  };

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
                href={getNavHref(item.href)}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-gray-900 hover:text-primary transition-colors duration-200 font-opensans"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/shop"
              className="flex items-center gap-1.5 text-gray-900 hover:text-primary transition-colors duration-200 font-opensans"
            >
              <Store className="w-4 h-4" /> Shop
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/cart"
              className="relative p-2 text-[#1a3d1a] hover:text-[#E86A10] transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#E86A10] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center justify-center space-x-2 bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <User className="w-4 h-4" />
                  <span>{customer ? customer.name.split(' ')[0] : ''}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {customer ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/account">
                        <User className="w-4 h-4 mr-2" /> My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account/orders">
                        <Package className="w-4 h-4 mr-2" /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/account/login">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account/register">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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
                  href={getNavHref(item.href)}
                  className="text-gray-700 hover:text-primary transition-colors duration-200 font-opensans py-2"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-1.5 text-gray-700 hover:text-primary transition-colors duration-200 font-opensans py-2"
              >
                <Store className="w-4 h-4" /> Shop
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-1.5 text-gray-700 hover:text-primary transition-colors duration-200 font-opensans py-2"
              >
                <ShoppingCart className="w-4 h-4" /> Cart
                {cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
            </nav>
            <div className="flex flex-col space-y-3 mt-4">
              {customer ? (
                <>
                  <Button
                    asChild
                    className="w-full flex items-center justify-center space-x-2 bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-md transition-all duration-300"
                  >
                    <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-4 h-4" />
                      <span>My Account</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 rounded-full border-[#1a3d1a]/20 text-[#1a3d1a]"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className="w-full flex items-center justify-center space-x-2 bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-md transition-all duration-300"
                  >
                    <Link
                      to="/account/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 rounded-full border-[#1a3d1a]/20 text-[#1a3d1a]"
                  >
                    <Link
                      to="/account/register"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </>
              )}

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
