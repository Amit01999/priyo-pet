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
      className="relative overflow-hidden bg-[#EFFDF0] pt-32 md:pt-40 pb-24 md:pb-32"
    >
      {/* Decorative organic shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#E86A10]/[0.08] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-32 w-[24rem] h-[24rem] rounded-full bg-[#1a3d1a]/[0.06] blur-3xl"
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-white border border-[#1a3d1a]/10 shadow-sm rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold text-[#1a3d1a] mb-8 animate-fade-up delay-100">
            <Sparkles className="w-3.5 h-3.5 text-[#E86A10]" />
            {content.hero.eyebrow}
          </span>

          <h1 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.08] text-[clamp(34px,6.5vw,76px)]">
            {headlineWords.map((word, i) => (
              <span
                key={`h-${i}`}
                className={`inline-block animate-word-pop delay-${Math.min(200 + i * 100, 500)}`}
              >
                {word}
                {i < headlineWords.length - 1 ? ' ' : ''}
              </span>
            ))}{' '}
            {highlightWords.map((word, i) => (
              <span
                key={`hl-${i}`}
                className={`inline-block text-[#E86A10] animate-word-pop delay-${Math.min(500 + i * 100, 700)}`}
              >
                {word}
                {i < highlightWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>

          <p className="animate-fade-up delay-700 text-[#1a3d1a]/60 text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            {content.hero.subtitle}
          </p>

          <div className="animate-fade-up delay-800 mt-8">
            <Button
              size="lg"
              onClick={scrollToForm}
              className="bg-[#E86A10] hover:bg-[#d45e0d] text-white px-8 py-6 text-base md:text-lg font-semibold rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <Calendar className="w-5 h-5 mr-2" />
              অ্যাপয়েন্টমেন্ট বুক করুন
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Key facts — premium cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mt-16 md:mt-20">
          {[
            {
              icon: Calendar,
              value: formatBengaliDateRange(campaign.dates),
              label: 'তারিখ',
              delay: 'delay-900',
            },
            {
              icon: Clock,
              value: '৪:০০ PM – ৮:০০ PM',
              label: 'ক্যাম্পেইনের সময়',
              delay: 'delay-1000',
            },
            {
              icon: MapPin,
              value: 'নিরালা, খুলনা',
              label: 'ভেন্যু',
              delay: 'delay-1100',
            },
          ].map(({ icon: Icon, value, label, delay }) => (
            <div
              key={label}
              className={`bg-white rounded-[28px] border border-[#1a3d1a]/[0.06] shadow-[0_20px_50px_-15px_rgba(26,61,26,0.15)] p-6 md:p-7 text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(26,61,26,0.25)] animate-fade-up ${delay}`}
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-[#EFFDF0] flex items-center justify-center mb-4 shadow-sm">
                <Icon className="w-5 h-5 text-[#E86A10]" />
              </div>
              <div className="font-serif-display text-[#1a3d1a] text-lg md:text-xl leading-snug">
                {value}
              </div>
              <div className="text-sm text-[#1a3d1a]/50 font-medium mt-1.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampaignHero;
