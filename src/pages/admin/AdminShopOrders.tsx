import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import PageHeader from '@/components/admin/PageHeader';
import SectionCard from '@/components/admin/SectionCard';
import EmptyState from '@/components/admin/EmptyState';
import ShopOrderDetailDialog from '@/components/admin/ShopOrderDetailDialog';
import { ORDER_STATUS_BADGE_CLASSES, PAYMENT_STATUS_BADGE_CLASSES } from '@/components/admin/statusStyles';
import * as adminShopApi from '@/lib/api/adminShop.api';
import type { Order, OrderStatus } from '@/lib/api/types';

const STATUS_FILTERS: (OrderStatus | 'all')[] = ['all', 'Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminShopOrders = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const params = {
    page,
    limit: 20,
    search: search || undefined,
    orderStatus: status === 'all' ? undefined : status,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-shop-orders', params],
    queryFn: () => adminShopApi.listOrdersAdmin(params),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Shop Orders" description="Track and fulfill customer orders" />

      <SectionCard className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3d1a]/40" />
          <Input
            placeholder="Search by order #, name, phone, reference..."
            className="pl-9 h-10 rounded-xl border-[#1a3d1a]/15"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as OrderStatus | 'all');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44 h-10 rounded-xl border-[#1a3d1a]/15">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'all' ? 'All statuses' : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SectionCard>

      <SectionCard>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="space-y-2">
              {data.data.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-wrap items-center gap-4 p-3 border border-[#1a3d1a]/[0.06] rounded-2xl hover:border-[#1a3d1a]/[0.12] hover:bg-[#F7FFF8] transition-colors"
                >
                  <div className="min-w-[140px]">
                    <p className="font-medium text-[#1a3d1a]">{order.orderNumber}</p>
                    <p className="text-xs text-[#1a3d1a]/45">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-sm text-[#1a3d1a]/70">{order.shippingName}</div>
                  <div className="text-sm text-[#1a3d1a]/50">{order.shippingPhone}</div>
                  <div className="font-semibold text-[#1a3d1a]">৳{order.total}</div>
                  <Badge className={PAYMENT_STATUS_BADGE_CLASSES[order.paymentStatus]}>{order.paymentStatus}</Badge>
                  <Badge className={ORDER_STATUS_BADGE_CLASSES[order.orderStatus]}>{order.orderStatus}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto rounded-full text-[#1a3d1a]/70 hover:text-[#1a3d1a] hover:bg-[#1a3d1a]/5"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>

            {data.totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-4 text-sm text-[#1a3d1a]/60">
                      Page {data.page} of {data.totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(data.totalPages, p + 1));
                      }}
                      className={page >= data.totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState message="No orders found." icon={ShoppingCart} />
        )}
      </SectionCard>

      <ShopOrderDetailDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default AdminShopOrders;
