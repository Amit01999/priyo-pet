import { useQuery } from '@tanstack/react-query';
import {
  Loader2,
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Ban,
  Wallet,
  ShieldCheck,
  ShieldX,
  TicketCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/admin/StatCard';
import { useAdminCampaign } from '@/contexts/AdminCampaignContext';
import { fetchDashboardStats } from '@/lib/api/adminDashboard.api';

const AdminDashboard = () => {
  const { selectedSlug } = useAdminCampaign();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats', selectedSlug],
    queryFn: () => fetchDashboardStats(selectedSlug as string),
    enabled: Boolean(selectedSlug),
    refetchInterval: 30000,
  });

  if (!selectedSlug || isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const remainingSlots = data.dayBreakdown.reduce((sum, day) => sum + day.remaining, 0);

  return (
    <div className="space-y-6">
      <h1 className="font-poppins font-bold text-2xl text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={data.totalApplications} icon={Users} accent="primary" />
        <StatCard label="Pending" value={data.byStatus.Pending ?? 0} icon={Clock3} accent="secondary" />
        <StatCard label="Approved Bookings" value={data.byStatus.Confirmed ?? 0} icon={CheckCircle2} accent="accent" />
        <StatCard label="Cancelled" value={data.byStatus.Cancelled ?? 0} icon={XCircle} accent="destructive" />
        <StatCard label="Completed" value={data.byStatus.Completed ?? 0} icon={CalendarCheck} accent="primary" />
        <StatCard label="Today's Appointments" value={data.todaysAppointments} icon={CalendarCheck} accent="secondary" />
        <StatCard
          label="Pending Verification"
          value={data.byPaymentStatus['Pending Verification'] ?? 0}
          icon={Wallet}
          accent="secondary"
        />
        <StatCard label="Verified Payments" value={data.byPaymentStatus.Verified ?? 0} icon={ShieldCheck} accent="accent" />
        <StatCard label="Rejected Payments" value={data.byPaymentStatus.Rejected ?? 0} icon={ShieldX} accent="destructive" />
        <StatCard label="Remaining Slots" value={remainingSlots} icon={TicketCheck} accent="primary" />
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-poppins text-lg">Slot Availability by Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.dayBreakdown.map((day) => (
              <div key={day.date} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-800">{day.date}</span>
                  {day.remaining === 0 && (
                    <span className="text-xs font-semibold text-destructive flex items-center gap-1">
                      <Ban className="w-3.5 h-3.5" /> Full
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div>
                    <div className="font-bold text-gray-800">{day.capacity}</div>
                    <div className="text-gray-500 text-xs">Capacity</div>
                  </div>
                  <div>
                    <div className="font-bold text-primary">{day.booked}</div>
                    <div className="text-gray-500 text-xs">Booked</div>
                  </div>
                  <div>
                    <div className="font-bold text-destructive">{day.blocked}</div>
                    <div className="text-gray-500 text-xs">Blocked</div>
                  </div>
                  <div>
                    <div className="font-bold text-secondary">{day.remaining}</div>
                    <div className="text-gray-500 text-xs">Available</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
