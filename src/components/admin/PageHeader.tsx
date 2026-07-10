import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

const PageHeader = ({ title, description, actions }: PageHeaderProps) => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 className="font-poppins font-bold text-2xl md:text-[28px] text-[#1a3d1a] tracking-tight">{title}</h1>
      {description && <p className="text-sm text-[#1a3d1a]/55 mt-1">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
