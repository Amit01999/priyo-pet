import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: 'primary' | 'secondary' | 'accent' | 'destructive';
}

const ACCENT_STYLES: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'bg-[#EAF7EA] text-[#1a3d1a]',
  secondary: 'bg-[#FFF4E8] text-[#B5580A]',
  accent: 'bg-sky-50 text-sky-700',
  destructive: 'bg-red-50 text-red-600',
};

const StatCard = ({ label, value, icon: Icon, accent = 'primary' }: StatCardProps) => {
  return (
    <div className="group bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-[0_2px_14px_-6px_rgba(26,61,26,0.12)] hover:shadow-[0_10px_28px_-10px_rgba(26,61,26,0.22)] hover:-translate-y-0.5 transition-all duration-300 p-5 flex items-center gap-4">
      <div
        className={cn(
          'w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105',
          ACCENT_STYLES[accent]
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold font-poppins text-[#1a3d1a] leading-tight">{value}</div>
        <div className="text-xs text-[#1a3d1a]/50 font-opensans truncate">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
