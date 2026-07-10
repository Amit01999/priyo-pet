import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
}

const EmptyState = ({ message, icon: Icon = Inbox }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="w-12 h-12 rounded-full bg-[#EFFDF0] flex items-center justify-center">
      <Icon className="w-5 h-5 text-[#1a3d1a]/40" />
    </div>
    <p className="text-[#1a3d1a]/45 text-sm">{message}</p>
  </div>
);

export default EmptyState;
