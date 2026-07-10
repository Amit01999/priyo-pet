import { useQuery } from '@tanstack/react-query';
import { Loader2, Package, ShoppingCart, Clock3, ShieldCheck, ShieldX, Wallet, AlertTriangle, Users } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import SectionCard from '@/components/admin/SectionCard';
import StatCard from '@/components/admin/StatCard';
import * as adminShopApi from '@/lib/api/adminShop.api';

const AdminShopDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-shop-dashboard-stats'],
    queryFn: adminShopApi.fetchShopDashboardStats,
    refetchInterval: 30000,
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Shop Dashboard" description="Store performance at a glance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={data.totalProducts} icon={Package} accent="primary" />
        <StatCard label="Total Orders" value={data.totalOrders} icon={ShoppingCart} accent="secondary" />
        <StatCard label="Pending Verification" value={data.byPaymentStatus['Pending Verification'] ?? 0} icon={Wallet} accent="secondary" />
        <StatCard label="Verified Payments" value={data.byPaymentStatus.Verified ?? 0} icon={ShieldCheck} accent="accent" />
        <StatCard label="Rejected Payments" value={data.byPaymentStatus.Rejected ?? 0} icon={ShieldX} accent="destructive" />
        <StatCard label="Revenue" value={`৳${data.revenue}`} icon={Wallet} accent="primary" />
        <StatCard label="Low Stock Products" value={data.lowStockProducts} icon={AlertTriangle} accent="destructive" />
        <StatCard label="New Customers (30d)" value={data.newCustomers} icon={Users} accent="accent" />
      </div>

      <SectionCard title="Orders by Status">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(data.byOrderStatus).map(([status, count]) => (
            <div
              key={status}
              className="border border-[#1a3d1a]/[0.06] rounded-2xl p-4 text-center hover:border-[#1a3d1a]/[0.12] transition-colors"
            >
              <div className="font-bold text-xl text-[#1a3d1a]">{count}</div>
              <div className="text-xs text-[#1a3d1a]/50 flex items-center justify-center gap-1 mt-1">
                <Clock3 className="w-3 h-3" /> {status}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default AdminShopDashboard;
