import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, ArrowLeft } from 'lucide-react';
import logo from '../../../public/logo1.png';

const CampaignHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#1a3d1a] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.35)] z-50">
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="PriyoPet" className="h-10 md:h-12 w-auto rounded-md" />
        </Link>

        <div className="flex items-center gap-2 md:gap-5">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-white/65 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            মূল ওয়েবসাইটে ফিরুন
          </Link>
          <a href="tel:01973968669">
            <Button
              size="sm"
              className="flex items-center gap-2 bg-[#E86A10] hover:bg-[#d45e0d] text-white rounded-full px-4 md:px-5 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">কল করুন</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default CampaignHeader;
