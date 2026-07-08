import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: 'primary' | 'secondary' | 'accent' | 'destructive';
}

const ACCENT_STYLES: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
  destructive: 'bg-destructive/10 text-destructive',
};

const StatCard = ({ label, value, icon: Icon, accent = 'primary' }: StatCardProps) => {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn('w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0', ACCENT_STYLES[accent])}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-bold font-poppins text-gray-800">{value}</div>
          <div className="text-sm text-gray-500 font-opensans">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
