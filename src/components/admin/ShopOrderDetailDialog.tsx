import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/api/types';
import * as adminShopApi from '@/lib/api/adminShop.api';
import { getApiErrorMessage } from '@/lib/api/client';
import { ORDER_STATUS_BADGE_CLASSES, PAYMENT_STATUS_BADGE_CLASSES } from './statusStyles';

interface ShopOrderDetailDialogProps {
  order: Order | null;
  onClose: () => void;
}

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending: ['Approved', 'Cancelled'],
  Approved: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

const ShopOrderDetailDialog = ({ order, onClose }: ShopOrderDetailDialogProps) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [downloading, setDownloading] = useState(false);
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-shop-orders'] });
    queryClient.invalidateQueries({ queryKey: ['admin-shop-dashboard-stats'] });
  };

  const statusMutation = useMutation({
    mutationFn: (status: OrderStatus) => adminShopApi.updateOrderStatus(order!._id, status),
    onSuccess: () => {
      toast.success('Order status updated');
      invalidate();
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not update status')),
  });

  const verifyMutation = useMutation({
    mutationFn: () => adminShopApi.verifyOrderPayment(order!._id),
    onSuccess: () => {
      toast.success('Payment verified — order approved');
      invalidate();
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not verify payment')),
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminShopApi.rejectOrderPayment(order!._id, rejectReason || undefined),
    onSuccess: () => {
      toast.success('Payment rejected — order cancelled');
      invalidate();
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not reject payment')),
  });

  const handleDownloadInvoice = async () => {
    if (!order) return;
    setDownloading(true);
    try {
      const blob = await adminShopApi.fetchOrderInvoicePdf(order._id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.orderNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not download invoice'));
    } finally {
      setDownloading(false);
    }
  };

  if (!order) return null;

  const availableTransitions = ORDER_STATUS_TRANSITIONS[order.orderStatus] ?? [];

  return (
    <Dialog open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[24px] border-[#1a3d1a]/[0.06]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-poppins text-[#1a3d1a]">
            {order.orderNumber}
            <Badge className={ORDER_STATUS_BADGE_CLASSES[order.orderStatus]}>{order.orderStatus}</Badge>
          </DialogTitle>
          <DialogDescription>Full order details</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm bg-[#F7FFF8] rounded-2xl p-4 border border-[#1a3d1a]/[0.05]">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <span className="font-semibold text-[#1a3d1a]/50 sm:w-40 flex-shrink-0">Shipping Name</span>
            <span className="text-[#1a3d1a]">{order.shippingName}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <span className="font-semibold text-[#1a3d1a]/50 sm:w-40 flex-shrink-0">Phone</span>
            <span className="text-[#1a3d1a]">{order.shippingPhone}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <span className="font-semibold text-[#1a3d1a]/50 sm:w-40 flex-shrink-0">Address</span>
            <span className="text-[#1a3d1a]">
              {order.shippingAddress}, {order.shippingDistrict}
            </span>
          </div>
          {order.notes && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="font-semibold text-[#1a3d1a]/50 sm:w-40 flex-shrink-0">Notes</span>
              <span className="text-[#1a3d1a]">{order.notes}</span>
            </div>
          )}
        </div>

        <div className="border border-[#1a3d1a]/[0.06] rounded-2xl p-4 space-y-2">
          <span className="text-sm font-semibold text-[#1a3d1a]/70">Items</span>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <img
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover border border-[#1a3d1a]/[0.06]"
              />
              <span className="flex-1 text-[#1a3d1a]">
                {item.name}
                {item.variantLabel ? ` (${item.variantLabel})` : ''} × {item.quantity}
              </span>
              <span className="font-semibold text-[#1a3d1a]">৳{item.lineTotal}</span>
            </div>
          ))}
          <div className="text-sm text-right pt-2 border-t border-[#1a3d1a]/[0.06] text-[#1a3d1a]/70">
            <div>Subtotal: ৳{order.subtotal}</div>
            <div>Delivery: ৳{order.deliveryCharge}</div>
            <div className="font-semibold text-[#1a3d1a]">Total: ৳{order.total}</div>
          </div>
        </div>

        <div className="border border-[#1a3d1a]/[0.06] rounded-2xl p-4 space-y-2 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1a3d1a]/70">Payment Information</span>
            <Badge className={PAYMENT_STATUS_BADGE_CLASSES[order.paymentStatus]}>{order.paymentStatus}</Badge>
          </div>
          <div className="text-sm text-[#1a3d1a]">Reference: {order.paymentReference}</div>
          {order.paymentRejectionReason && (
            <div className="text-sm text-destructive">Rejection Reason: {order.paymentRejectionReason}</div>
          )}

          {order.paymentStatus === 'Pending Verification' && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                size="sm"
                className="bg-[#1a3d1a] hover:bg-[#2a5a2a] rounded-full"
                disabled={verifyMutation.isPending}
                onClick={() => verifyMutation.mutate()}
              >
                {verifyMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Verify Payment
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full"
                disabled={rejectMutation.isPending}
                onClick={() => setShowRejectReason((v) => !v)}
              >
                Reject Payment
              </Button>
            </div>
          )}

          {showRejectReason && (
            <div className="pt-1 space-y-2">
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason (optional) — included in the rejection email"
                className="min-h-[60px] bg-white rounded-xl border-[#1a3d1a]/15"
              />
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full"
                disabled={rejectMutation.isPending}
                onClick={() => rejectMutation.mutate()}
              >
                {rejectMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Confirm Rejection
              </Button>
            </div>
          )}

          {order.paymentStatus === 'Verified' && (
            <div className="pt-1">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-[#1a3d1a]/15 text-[#1a3d1a] hover:bg-[#1a3d1a]/5"
                disabled={downloading}
                onClick={handleDownloadInvoice}
              >
                {downloading && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Download Invoice PDF
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row flex-wrap gap-2 sm:justify-start">
          {availableTransitions.map((status) => (
            <Button
              key={status}
              size="sm"
              disabled={statusMutation.isPending}
              variant={status === 'Cancelled' ? 'destructive' : 'default'}
              className={`rounded-full ${status !== 'Cancelled' ? 'bg-[#1a3d1a] hover:bg-[#2a5a2a]' : ''}`}
              onClick={() => statusMutation.mutate(status)}
            >
              Mark as {status}
            </Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShopOrderDetailDialog;
