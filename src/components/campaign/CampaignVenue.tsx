import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import type { PublicCampaign } from '@/lib/api/types';

interface CampaignVenueProps {
  campaign: PublicCampaign;
}

const CampaignVenue = ({ campaign }: CampaignVenueProps) => {
  const details = [
    { icon: MapPin, title: 'ঠিকানা', body: campaign.venue },
    { icon: Clock, title: 'সময়', body: '৪:০০ PM – ৮:০০ PM' },
    { icon: Phone, title: 'যোগাযোগ', body: '01973968669 (ফোন / হোয়াটসঅ্যাপ)' },
  ];

  return (
    <section id="venue" className="relative bg-[#F7FFF8] py-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-[24rem] h-[24rem] rounded-full bg-[#E86A10]/[0.07] blur-3xl"
      />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-14 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 bg-white border border-[#1a3d1a]/10 shadow-sm rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
            <Navigation className="w-3.5 h-3.5 text-[#E86A10]" />
            লোকেশন
          </span>
          <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
            ভেন্যু <span className="text-[#E86A10]">তথ্য</span>
          </h2>
          <p className="text-[#1a3d1a]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            নিচের ঠিকানায় ক্যাম্পেইন অনুষ্ঠিত হবে। যাত্রা শুরুর আগে ম্যাপে অবস্থান যাচাই করে নিন।
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          <div className="bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_20px_50px_-15px_rgba(26,61,26,0.15)] p-8 md:p-10 space-y-7 animate-fade-up delay-200">
            {details.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#EFFDF0] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-5 h-5 text-[#1a3d1a]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1a3d1a] mb-1">{title}</h4>
                  <p className="text-[#1a3d1a]/60 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[32px] overflow-hidden border border-[#1a3d1a]/[0.06] shadow-[0_20px_50px_-15px_rgba(26,61,26,0.2)] min-h-[300px] animate-fade-up delay-300">
            <iframe
              title="Campaign Venue Location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(campaign.venueMapQuery)}&output=embed`}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              className="border-0 w-full h-full min-h-[300px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignVenue;
