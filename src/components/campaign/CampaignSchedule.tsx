import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Users, CalendarDays } from 'lucide-react';
import { fetchSlotsForDate } from '@/lib/api/publicCampaign.api';
import { formatBengaliDate, formatBengaliTime, toBengaliDigits } from '@/lib/bengaliDate';
import type { PublicCampaign } from '@/lib/api/types';

interface CampaignScheduleProps {
  campaign: PublicCampaign;
}

const DayScheduleCard = ({
  campaign,
  date,
  index,
}: {
  campaign: PublicCampaign;
  date: string;
  index: number;
}) => {
  const { data } = useQuery({
    queryKey: ['public-slots', campaign.slug, date],
    queryFn: () => fetchSlotsForDate(campaign.slug, date),
    refetchInterval: 30000,
  });

  const isClosed = campaign.dayStatus[date] === 'closed';
  const remaining = data?.remaining;
  const total = data?.total ?? campaign.maxSlotsPerDay;
  const isFull = remaining === 0;

  return (
    <div
      className="group relative bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_20px_50px_-15px_rgba(26,61,26,0.15)] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_70px_-15px_rgba(26,61,26,0.28)] animate-fade-up"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1a3d1a] to-[#2a5a2a]" />
      <div className="p-8 md:p-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#EFFDF0] flex items-center justify-center mb-5 shadow-sm transition-transform duration-500 group-hover:scale-110">
          <Calendar className="w-7 h-7 text-[#1a3d1a]" />
        </div>
        <h3 className="font-serif-display text-2xl md:text-3xl text-[#1a3d1a] mb-2">
          {formatBengaliDate(date)}
        </h3>
        <p className="text-[#1a3d1a]/50 text-sm mb-7 flex items-center justify-center gap-1.5">
          <Clock className="w-4 h-4" />
          {formatBengaliTime(campaign.dailyStartTime)} থেকে শুরু
        </p>

        {isClosed ? (
          <span className="inline-block bg-[#1a3d1a]/5 text-[#1a3d1a]/40 rounded-full px-5 py-2.5 text-sm font-semibold">
            বুকিং বন্ধ
          </span>
        ) : isFull ? (
          <span className="inline-block bg-[#E86A10]/10 text-[#E86A10] rounded-full px-5 py-2.5 text-sm font-semibold">
            সব স্লট পূর্ণ
          </span>
        ) : (
          <div className="inline-flex items-center gap-2 bg-[#1a3d1a] text-white rounded-full px-5 py-2.5 text-sm font-semibold shadow-md">
            <Users className="w-4 h-4" />
            {remaining !== undefined ? (
              <span>
                {toBengaliDigits(remaining)} / {toBengaliDigits(total)} স্লট খালি
              </span>
            ) : (
              <span>স্লট লোড হচ্ছে…</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CampaignSchedule = ({ campaign }: CampaignScheduleProps) => {
  return (
    <section id="schedule" className="relative bg-white py-24 overflow-hidden">
      {/* Subtle dot texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(26,61,26,0.05) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-14 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 bg-[#EFFDF0] border border-[#1a3d1a]/10 rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
            <CalendarDays className="w-3.5 h-3.5 text-[#E86A10]" />
            সময়সূচী
          </span>
          <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
            ইভেন্ট <span className="text-[#E86A10]">সময়সূচী</span>
          </h2>
          <p className="text-[#1a3d1a]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            নিচে থেকে আপনার পছন্দের দিন দেখুন এবং খালি স্লট সংখ্যা যাচাই করে অ্যাপয়েন্টমেন্ট বুক করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          {campaign.dates.map((date, index) => (
            <DayScheduleCard key={date} campaign={campaign} date={date} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampaignSchedule;
