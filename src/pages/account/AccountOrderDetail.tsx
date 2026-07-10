import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import * as shopApi from '@/lib/api/shop.api';

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
      <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-[#1a3d1a]/60 hover:text-[#1a3d1a]">
        <ChevronLeft className="w-4 h-4" /> আমার অর্ডারে ফিরে যান
      </Link>

      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="font-serif-display text-2xl text-[#1a3d1a]">{order.orderNumber}</h1>
        <Badge variant="outline" className="border-[#1a3d1a]/20 text-[#1a3d1a]">
          {order.paymentStatus}
        </Badge>
        <Badge className="bg-[#1a3d1a]/10 text-[#1a3d1a] border-transparent">{order.orderStatus}</Badge>
      </div>

      <div className="bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-sm p-6">
        <h3 className="font-serif-display text-lg text-[#1a3d1a] mb-4">পণ্যসমূহ</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
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
      </div>

      <div className="bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-sm p-6">
        <h3 className="font-serif-display text-lg text-[#1a3d1a] mb-4">শিপিং তথ্য</h3>
        <div className="space-y-1.5 text-sm text-[#1a3d1a]/80">
          <p>{order.shippingName}</p>
          <p>{order.shippingPhone}</p>
          <p>
            {order.shippingAddress}, {order.shippingDistrict}
          </p>
          {order.notes && <p className="text-[#1a3d1a]/50">নোট: {order.notes}</p>}
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-sm p-6">
        <h3 className="font-serif-display text-lg text-[#1a3d1a] mb-4">পেমেন্ট তথ্য</h3>
        <div className="space-y-1.5 text-sm text-[#1a3d1a]/80">
          <p>রেফারেন্স নম্বর: {order.paymentReference}</p>
          {order.paymentRejectionReason && (
            <p className="text-destructive">প্রত্যাখ্যানের কারণ: {order.paymentRejectionReason}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-sm p-6">
        <h3 className="font-serif-display text-lg text-[#1a3d1a] mb-4">স্ট্যাটাস টাইমলাইন</h3>
        <div className="space-y-3">
          {order.statusHistory.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#1a3d1a] flex-shrink-0" />
              <span className="text-[#1a3d1a] font-medium">{entry.status}</span>
              <span className="text-[#1a3d1a]/50">{new Date(entry.at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountOrderDetail;
