import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronLeft, Package, Truck, Wallet, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import * as shopApi from '@/lib/api/shop.api';
import { PAYMENT_STATUS_BADGE_CLASSES, ORDER_STATUS_BADGE_CLASSES } from '@/lib/orderStatusBadges';
import type { OrderStatus } from '@/lib/api/types';

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Package;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-[0_2px_14px_-6px_rgba(26,61,26,0.1)] p-6">
    <h3 className="font-serif-display text-lg text-[#1a3d1a] mb-4 flex items-center gap-2">
      <span className="w-8 h-8 rounded-xl bg-[#EFFDF0] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#1a3d1a]" />
      </span>
      {title}
    </h3>
    {children}
  </div>
);

const AccountOrderDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({
    queryKey: ['my-order', id],
    queryFn: () => shopApi.getMyOrder(id),
    enabled: Boolean(id),
  });

  if (isLoading || !order) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-[#1a3d1a]/60 hover:text-[#1a3d1a] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> আমার অর্ডারে ফিরে যান
      </Link>

      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="font-serif-display text-2xl text-[#1a3d1a]">{order.orderNumber}</h1>
        <Badge className={PAYMENT_STATUS_BADGE_CLASSES[order.paymentStatus]}>{order.paymentStatus}</Badge>
        <Badge className={ORDER_STATUS_BADGE_CLASSES[order.orderStatus]}>{order.orderStatus}</Badge>
      </div>

      <SectionCard icon={Package} title="পণ্যসমূহ">
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <img
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#1a3d1a]/[0.06]"
              />
              <div className="flex-1">
                <p className="text-[#1a3d1a] font-medium">{item.name}</p>
                <p className="text-xs text-[#1a3d1a]/50">
                  {item.quantity} × ৳{item.unitPriceDiscounted}
                </p>
              </div>
              <div className="font-semibold text-[#1a3d1a]">৳{item.lineTotal}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#1a3d1a]/[0.08] mt-4 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-[#1a3d1a]/70">
            <span>সাবটোটাল</span>
            <span>৳{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-[#1a3d1a]/70">
            <span>ডেলিভারি চার্জ</span>
            <span>৳{order.deliveryCharge}</span>
          </div>
          <div className="flex justify-between font-serif-display text-lg text-[#1a3d1a] pt-1">
            <span>মোট</span>
            <span>৳{order.total}</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Truck} title="শিপিং তথ্য">
        <div className="space-y-1.5 text-sm text-[#1a3d1a]/80">
          <p>{order.shippingName}</p>
          <p>{order.shippingPhone}</p>
          <p>
            {order.shippingAddress}, {order.shippingDistrict}
          </p>
          {order.notes && <p className="text-[#1a3d1a]/50">নোট: {order.notes}</p>}
        </div>
      </SectionCard>

      <SectionCard icon={Wallet} title="পেমেন্ট তথ্য">
        <div className="space-y-1.5 text-sm text-[#1a3d1a]/80">
          <p>রেফারেন্স নম্বর: {order.paymentReference}</p>
          {order.paymentRejectionReason && (
            <p className="text-destructive">প্রত্যাখ্যানের কারণ: {order.paymentRejectionReason}</p>
          )}
        </div>
      </SectionCard>

      <SectionCard icon={History} title="স্ট্যাটাস টাইমলাইন">
        <div className="space-y-0">
          {order.statusHistory.map((entry, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="flex flex-col items-center">
                <span
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    ORDER_STATUS_BADGE_CLASSES[entry.status as OrderStatus]?.includes('bg-[#1a3d1a]')
                      ? 'bg-[#1a3d1a]'
                      : 'bg-[#E86A10]'
                  }`}
                />
                {i < order.statusHistory.length - 1 && <span className="w-px flex-1 bg-[#1a3d1a]/10 my-1" />}
              </div>
              <div className="pb-4">
                <span className="text-[#1a3d1a] font-medium">{entry.status}</span>
                <span className="text-[#1a3d1a]/45 ml-2">{new Date(entry.at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default AccountOrderDetail;
