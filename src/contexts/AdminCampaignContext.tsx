import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAdminCampaigns, type AdminCampaignSummary } from '@/lib/api/adminSlots.api';

interface AdminCampaignContextValue {
  campaigns: AdminCampaignSummary[];
  selectedSlug: string | null;
  setSelectedSlug: (slug: string) => void;
  isLoading: boolean;
}

const AdminCampaignContext = createContext<AdminCampaignContextValue | null>(null);

export function AdminCampaignProvider({ children }: { children: ReactNode }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['admin-campaigns'],
    queryFn: listAdminCampaigns,
  });

  useEffect(() => {
    if (!selectedSlug && campaigns.length > 0) {
      setSelectedSlug(campaigns[0].slug);
    }
  }, [campaigns, selectedSlug]);

  return (
    <AdminCampaignContext.Provider value={{ campaigns, selectedSlug, setSelectedSlug, isLoading }}>
      {children}
    </AdminCampaignContext.Provider>
  );
}

export function useAdminCampaign(): AdminCampaignContextValue {
  const ctx = useContext(AdminCampaignContext);
  if (!ctx) throw new Error('useAdminCampaign must be used within AdminCampaignProvider');
  return ctx;
}
