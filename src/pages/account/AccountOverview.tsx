import { useQuery } from '@tanstack/react-query';
import { Loader2, ShoppingBag, Clock3, CheckCircle2, Wallet } from 'lucide-react';
import * as shopApi from '@/lib/api/shop.api';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

const StatTile = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof ShoppingBag }) => (
  <div className="bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-sm p-5 flex items-center gap-4">
    <div className="w-11 h-11 rounded-full bg-[#EFFDF0] flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-[#1a3d1a]" />
    </div>
    <div>
      <div className="font-serif-display text-xl text-[#1a3d1a]">{value}</div>
      <div className="text-xs text-[#1a3d1a]/50">{label}</div>
    </div>
  </div>
);

const AccountOverview = () => {
  const { customer } = useCustomerAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders-overview'],
    queryFn: () => shopApi.listMyOrders({ limit: 50 }),
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
      </div>
    );
  }

  const orders = data.data;
  const totalOrders = data.total;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const totalSpent = orders.filter((o) => o.paymentStatus === 'Verified').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <h1 className="font-serif-display text-2xl text-[#1a3d1a]">স্বাগতম, {customer?.name}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="মোট অর্ডার" value={totalOrders} icon={ShoppingBag} />
        <StatTile label="পেন্ডিং অর্ডার" value={pendingOrders} icon={Clock3} />
        <StatTile label="সম্পন্ন অর্ডার" value={completedOrders} icon={CheckCircle2} />
        <StatTile label="মোট খরচ" value={`৳${totalSpent}`} icon={Wallet} />
      </div>
    </div>
  );
};

export default AccountOverview;
