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
      className="relative overflow-hidden bg-[#EFFDF0] pt-24 md:pt-28 pb-14 md:pb-16"
    >
      {/* Background Image Pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
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
              className={`relative flex items-stretch bg-white rounded-2xl overflow-hidden shadow-[0_15px_35px_-18px_rgba(26,61,26,0.3)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-18px_rgba(26,61,26,0.4)] animate-fade-up ${delay}`}
            >
              <div
                className="relative flex items-center justify-center w-16 md:w-20 flex-shrink-0"
                style={{ backgroundColor: accent }}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                {/* ticket-stub notches */}
                <span
                  aria-hidden
                  className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-[#EFFDF0] translate-x-1/2"
                />
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 right-0 w-3 h-3 rounded-full bg-[#EFFDF0] translate-x-1/2"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center text-left px-4 py-4 md:py-4">
                <div className="font-serif-display text-[#1a3d1a] text-xl md:text-lg leading-snug">
                  {value}
                </div>
                <div className="text-base md:text-xs text-[#1a3d1a]/45 font-medium mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampaignHero;
