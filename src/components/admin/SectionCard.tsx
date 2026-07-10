import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

const SectionCard = ({ children, className, title, description, actions }: SectionCardProps) => (
  <div
    className={cn(
      'bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-[0_2px_14px_-6px_rgba(26,61,26,0.12)] p-5',
      className
    )}
  >
    {(title || actions) && (
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          {title && <h3 className="font-poppins font-semibold text-[#1a3d1a]">{title}</h3>}
          {description && <p className="text-xs text-[#1a3d1a]/50 mt-0.5">{description}</p>}
        </div>
        {actions}
      </div>
    )}
    {children}
  </div>
);

export default SectionCard;
