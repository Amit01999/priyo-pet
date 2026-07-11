import { useQuery } from '@tanstack/react-query';
import { Loader2, ShoppingBag, Clock3, CheckCircle2, Wallet } from 'lucide-react';
import * as shopApi from '@/lib/api/shop.api';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

const ACCENT_STYLES = {
  primary: 'bg-[#EAF7EA] text-[#1a3d1a]',
  secondary: 'bg-[#FFF4E8] text-[#B5580A]',
  accent: 'bg-sky-50 text-sky-700',
  destructive: 'bg-red-50 text-red-600',
} as const;

const StatTile = ({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: typeof ShoppingBag;
  accent: keyof typeof ACCENT_STYLES;
}) => (
  <div className="group bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-[0_2px_14px_-6px_rgba(26,61,26,0.12)] hover:shadow-[0_10px_28px_-10px_rgba(26,61,26,0.22)] hover:-translate-y-0.5 transition-all duration-300 p-5 flex items-center gap-4">
    <div
      className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${ACCENT_STYLES[accent]}`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <div className="font-serif-display text-xl text-[#1a3d1a] leading-tight">{value}</div>
      <div className="text-xs text-[#1a3d1a]/50 truncate">{label}</div>
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
      <div className="bg-gradient-to-br from-[#1a3d1a] to-[#2a5a2a] rounded-[24px] p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E86A10]/20 rounded-full blur-3xl" />
        <h1 className="relative font-serif-display text-2xl md:text-3xl text-white">স্বাগতম, {customer?.name}</h1>
        <p className="relative text-white/60 text-sm mt-1">আপনার অ্যাকাউন্টের সারসংক্ষেপ দেখুন</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="মোট অর্ডার" value={totalOrders} icon={ShoppingBag} accent="primary" />
        <StatTile label="পেন্ডিং অর্ডার" value={pendingOrders} icon={Clock3} accent="secondary" />
        <StatTile label="সম্পন্ন অর্ডার" value={completedOrders} icon={CheckCircle2} accent="accent" />
        <StatTile label="মোট খরচ" value={`৳${totalSpent}`} icon={Wallet} accent="primary" />
      </div>
    </div>
  );
};

export default AccountOverview;
