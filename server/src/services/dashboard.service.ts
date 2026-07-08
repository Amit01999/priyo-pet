import { Appointment } from '../models/Appointment.model.js';
import type { CampaignDoc } from '../models/Campaign.model.js';
import { todayInDhaka } from '../config/timezone.js';
import { getSlotsForDate } from './slot.service.js';

export interface DashboardStats {
  totalApplications: number;
  byStatus: Record<string, number>;
  todaysAppointments: number;
  today: string;
  dayBreakdown: { date: string; capacity: number; booked: number; blocked: number; remaining: number }[];
}

export async function getDashboardStats(campaign: CampaignDoc): Promise<DashboardStats> {
  const today = todayInDhaka();

  const [totalApplications, statusCounts, todaysAppointments, dayBreakdown] = await Promise.all([
    Appointment.countDocuments({ campaignId: campaign._id }),
    Appointment.aggregate([
      { $match: { campaignId: campaign._id } },
      { $group: { _id: '$bookingStatus', count: { $sum: 1 } } },
    ]),
    Appointment.countDocuments({ campaignId: campaign._id, appointmentDate: today, isActive: true }),
    Promise.all(
      campaign.dates.map(async (date) => {
        const result = await getSlotsForDate(campaign, date);
        const booked = result.slots.filter((s) => s.status === 'booked').length;
        const blocked = result.slots.filter((s) => s.status === 'blocked').length;
        return { date, capacity: result.total, booked, blocked, remaining: result.remaining };
      })
    ),
  ]);

  const byStatus: Record<string, number> = { Pending: 0, Confirmed: 0, Cancelled: 0, Completed: 0 };
  for (const row of statusCounts as { _id: string; count: number }[]) {
    byStatus[row._id] = row.count;
  }

  return { totalApplications, byStatus, todaysAppointments, today, dayBreakdown };
}
