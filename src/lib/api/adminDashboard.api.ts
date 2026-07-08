import { api, type ApiSuccess } from './client';
import type { DashboardStats } from './types';

export async function fetchDashboardStats(slug: string): Promise<DashboardStats> {
  const res = await api.get<ApiSuccess<DashboardStats>>(`/admin/campaigns/${slug}/dashboard/stats`);
  return res.data.data;
}
