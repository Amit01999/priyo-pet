import { Check, ShieldCheck } from 'lucide-react';
import { toBengaliDigits } from '@/lib/bengaliDate';
import type { CampaignContent } from '@/content/campaigns/rabies-2026.content';
import type { PublicCampaign } from '@/lib/api/types';

interface CampaignInfoProps {
  campaign: PublicCampaign;
  content: CampaignContent;
}

const CampaignInfo = ({ campaign, content }: CampaignInfoProps) => {
  return (
    <section
      id="about"
      className="relative bg-[#F7FFF8] rounded-t-[48px] -mt-10 py-24 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 w-[26rem] h-[26rem] rounded-full bg-[#1a3d1a]/[0.05] blur-3xl"
      />

      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#1a3d1a]/10 shadow-sm rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E86A10]" />
              {campaign.sponsor} × {campaign.organizer}
            </span>

            <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-7">
              {content.about.heading}{' '}
              <span className="text-[#E86A10]">{content.about.highlight}</span>
            </h2>

            {content.about.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[#1a3d1a]/60 text-base md:text-lg mb-5 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}

            <div className="space-y-3.5 mt-8">
              {content.about.highlights.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1a3d1a] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[#1a3d1a]/80 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stat tiles — organic two-column stagger */}
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            <div className="space-y-4 md:space-y-5">
              <div className="bg-[#1a3d1a] rounded-[28px] shadow-[0_25px_60px_-15px_rgba(26,61,26,0.45)] p-7 md:p-8 text-white text-center transition-all duration-500 hover:-translate-y-1.5 animate-fade-up delay-200">
                <div className="font-serif-display text-4xl md:text-5xl">
                  {toBengaliDigits(campaign.maxSlotsPerDay)}
                </div>
                <div className="text-sm text-white/70 mt-2">দৈনিক স্লট সংখ্যা</div>
              </div>
              <div className="bg-white rounded-[28px] border border-[#1a3d1a]/[0.06] shadow-[0_20px_50px_-15px_rgba(26,61,26,0.15)] p-7 md:p-8 text-center transition-all duration-500 hover:-translate-y-1.5 animate-fade-up delay-300">
                <div className="font-serif-display text-4xl md:text-5xl text-[#1a3d1a]">
                  {toBengaliDigits(campaign.slotDurationMinutes)}
                </div>
                <div className="text-sm text-[#1a3d1a]/50 mt-2">মিনিট প্রতি অ্যাপয়েন্টমেন্ট</div>
              </div>
            </div>
            <div className="space-y-4 md:space-y-5 mt-10">
              <div className="bg-white rounded-[28px] border border-[#1a3d1a]/[0.06] shadow-[0_20px_50px_-15px_rgba(26,61,26,0.15)] p-7 md:p-8 text-center transition-all duration-500 hover:-translate-y-1.5 animate-fade-up delay-400">
                <div className="font-serif-display text-4xl md:text-5xl text-[#1a3d1a]">
                  {toBengaliDigits(campaign.dates.length)}
                </div>
                <div className="text-sm text-[#1a3d1a]/50 mt-2">দিনব্যাপী ক্যাম্পেইন</div>
              </div>
              <div className="bg-[#E86A10] rounded-[28px] shadow-[0_25px_60px_-15px_rgba(232,106,16,0.45)] p-7 md:p-8 text-white text-center transition-all duration-500 hover:-translate-y-1.5 animate-fade-up delay-500">
                <div className="font-serif-display text-4xl md:text-5xl">৳০</div>
                <div className="text-sm text-white/75 mt-2">সম্পূর্ণ বিনামূল্যে</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignInfo;
