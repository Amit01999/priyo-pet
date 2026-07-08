import { api, type ApiSuccess } from './client';
import type { SlotsForDateResult } from './types';

export async function fetchAdminSlots(slug: string, date: string): Promise<SlotsForDateResult> {
  const res = await api.get<ApiSuccess<SlotsForDateResult>>(`/admin/campaigns/${slug}/slots`, {
    params: { date },
  });
  return res.data.data;
}

export async function blockSlot(slug: string, date: string, slotNumber: number, reason?: string): Promise<void> {
  await api.patch(`/admin/campaigns/${slug}/slots/block`, { date, slotNumber, reason });
}

export async function unblockSlot(slug: string, date: string, slotNumber: number): Promise<void> {
  await api.patch(`/admin/campaigns/${slug}/slots/unblock`, { date, slotNumber });
}

export async function updateDayStatus(slug: string, date: string, status: 'open' | 'closed'): Promise<void> {
  await api.patch(`/admin/campaigns/${slug}/day-status`, { date, status });
}

export async function updateCampaignConfig(
  slug: string,
  updates: { maxSlotsPerDay?: number; slotDurationMinutes?: number }
): Promise<void> {
  await api.patch(`/admin/campaigns/${slug}/config`, updates);
}

export interface AdminCampaignSummary {
  _id: string;
  slug: string;
  title: string;
  dates: string[];
  isActive: boolean;
}

export async function listAdminCampaigns(): Promise<AdminCampaignSummary[]> {
  const res = await api.get<ApiSuccess<AdminCampaignSummary[]>>('/admin/campaigns');
  return res.data.data;
}
