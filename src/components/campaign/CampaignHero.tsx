import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { formatBengaliDateRange } from '@/lib/bengaliDate';
import type { PublicCampaign } from '@/lib/api/types';
import type { CampaignContent } from '@/content/campaigns/rabies-2026.content';

interface CampaignHeroProps {
  campaign: PublicCampaign;
  content: CampaignContent;
}

const CampaignHero = ({ campaign, content }: CampaignHeroProps) => {
  const scrollToForm = () => {
    document
      .getElementById('appointment-form')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const headlineWords = content.hero.headline.split(' ');
  const highlightWords = content.hero.highlight.split(' ');

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#EFFDF0] pt-24 md:pt-28 pb-14 md:pb-20"
    >
      {/* Background Image Pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/hero-bg2.png')" }}
      />

      {/* Decorative organic shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-[24rem] h-[24rem] rounded-full bg-[#E86A10]/[0.08] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-28 w-[20rem] h-[20rem] rounded-full bg-[#1a3d1a]/[0.06] blur-3xl"
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-white border border-[#1a3d1a]/10 shadow-sm rounded-full px-4 py-1.5 text-sm font-semibold text-[#1a3d1a] mb-5 animate-fade-up delay-100">
            <Sparkles className="w-3.5 h-3.5 text-[#E86A10]" />
            {content.hero.eyebrow}
          </span>

          <h1 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.15] text-[clamp(42px,11vw,68px)]">
            {headlineWords.map((word, i) => (
              <span
                key={`h-${i}`}
                className={`inline-block animate-word-pop delay-${Math.min(200 + i * 100, 500)}`}
              >
                {word}
                {i < headlineWords.length - 1 ? ' ' : ''}
              </span>
            ))}
            <br />
            <span className="whitespace-nowrap">
              {highlightWords.map((word, i) => (
                <span
                  key={`hl-${i}`}
                  className={`inline-block text-[#E86A10] animate-word-pop delay-${Math.min(500 + i * 100, 700)}`}
                >
                  {word}
                  {i < highlightWords.length - 1 ? ' ' : ''}
                </span>
              ))}
            </span>
          </h1>

          <p className="animate-fade-up delay-700 text-[#1a3d1a]/60 text-lg mt-3.5 max-w-xl mx-auto leading-relaxed">
            {content.hero.subtitle}
          </p>
          {/* Booking Deadline */}
          <div className="animate-fade-up delay-750 mt-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E86A10]/20 bg-[#FFF7F1] px-5 py-2.5 shadow-sm">
              <Clock className="h-4 w-4 text-[#E86A10]" />
              <span className="text-sm md:text-base font-medium text-[#E86A10]">
                <span className=" text-[#1a3d1a]">
                  অ্যাপয়েন্টমেন্ট বুকিংয়ের শেষ তারিখ:
                </span>{' '}
                ১৫ জুলাই
              </span>
            </div>
          </div>
          <div className="animate-fade-up delay-800 mt-5">
            <Button
              size="lg"
              onClick={scrollToForm}
              className="bg-[#E86A10] hover:bg-[#d45e0d] text-white px-7 py-5 text-lg font-semibold rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              অ্যাপয়েন্টমেন্ট বুক করুন
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Key facts — premium cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 max-w-3xl mx-auto mt-9 md:mt-11">
          {[
            {
              icon: Calendar,
              value: formatBengaliDateRange(campaign.dates),
              label: 'তারিখ',
              delay: 'delay-900',
              accent: '#1a3d1a',
            },
            {
              icon: Clock,
              value: '৪:০০ PM – ৮:০০ PM',
              label: 'ক্যাম্পেইনের সময়',
              delay: 'delay-1000',
              accent: '#E86A10',
            },
            {
              icon: MapPin,
              value: 'নিরালা, খুলনা',
              label: 'ভেন্যু',
              delay: 'delay-1100',
              accent: '#1a3d1a',
            },
          ].map(({ icon: Icon, value, label, delay, accent }) => (
            <div
              key={label}
              className={`group flex items-center gap-4 rounded-2xl border border-[#1a3d1a]/8 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${delay}`}
            >
              <div
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: accent }}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>

              <div>
                <div className="text-sm font-medium text-[#1a3d1a]/55">
                  {label}
                </div>

                <div className="mt-1 font-serif-display text-xl text-[#1a3d1a]">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampaignHero;
