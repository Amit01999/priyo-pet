import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Eye, Download, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as shopApi from '@/lib/api/shop.api';
import { getApiErrorMessage } from '@/lib/api/client';

const ORDER_STATUS_LABELS: Record<string, string> = {
  Pending: 'অপেক্ষমান',
  Approved: 'অনুমোদিত',
  Processing: 'প্রক্রিয়াধীন',
  Shipped: 'পাঠানো হয়েছে',
  Delivered: 'ডেলিভার হয়েছে',
  Cancelled: 'বাতিল',
};

const AccountOrders = () => {
  const queryClient = useQueryClient();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => shopApi.listMyOrders({ limit: 50 }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => shopApi.cancelMyOrder(id),
    onSuccess: () => {
      toast.success('অর্ডার বাতিল করা হয়েছে');
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'অর্ডার বাতিল করা যায়নি')),
  });

  const handleDownloadInvoice = async (id: string, orderNumber: string) => {
    setDownloadingId(id);
    try {
      const blob = await shopApi.fetchMyInvoicePdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'ইনভয়েস ডাউনলোড করা যায়নি'));
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif-display text-2xl text-[#1a3d1a]">আমার অর্ডার</h1>

      {data.data.length === 0 ? (
        <p className="text-[#1a3d1a]/50 py-12 text-center bg-white rounded-2xl border border-[#1a3d1a]/[0.06]">
          এখনো কোনো অর্ডার নেই।
        </p>
      ) : (
        <div className="space-y-3">
          {data.data.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-sm p-5 flex flex-wrap items-center gap-4 justify-between"
            >
              <div>
                <div className="font-serif-display text-[#1a3d1a]">{order.orderNumber}</div>
                <div className="text-xs text-[#1a3d1a]/50">{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="text-sm text-[#1a3d1a]/70">{order.items.length} টি পণ্য</div>
              <div className="font-semibold text-[#E86A10]">৳{order.total}</div>
              <Badge variant="outline" className="border-[#1a3d1a]/20 text-[#1a3d1a]">
                {order.paymentStatus}
              </Badge>
              <Badge className="bg-[#1a3d1a]/10 text-[#1a3d1a] border-transparent">
                {ORDER_STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
              </Badge>
              <div className="flex gap-2 ml-auto">
                <Button asChild size="sm" variant="outline" className="rounded-full border-[#1a3d1a]/20 text-[#1a3d1a]">
                  <Link to={`/account/orders/${order._id}`}>
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> বিস্তারিত
                  </Link>
                </Button>
                {order.paymentStatus === 'Verified' && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={downloadingId === order._id}
                    onClick={() => handleDownloadInvoice(order._id, order.orderNumber)}
                    className="rounded-full border-[#1a3d1a]/20 text-[#1a3d1a]"
                  >
                    {downloadingId === order._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                  </Button>
                )}
                {order.orderStatus === 'Pending' && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={cancelMutation.isPending}
                    onClick={() => cancelMutation.mutate(order._id)}
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" /> বাতিল করুন
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountOrders;
