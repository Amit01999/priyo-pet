import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, User, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PageHeader from '@/components/admin/PageHeader';
import SectionCard from '@/components/admin/SectionCard';
import EmptyState from '@/components/admin/EmptyState';
import * as adminShopApi from '@/lib/api/adminShop.api';

const AdminCustomers = () => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-shop-customers', search],
    queryFn: () => adminShopApi.listCustomersAdmin({ search: search || undefined, limit: 50 }),
  });

  const { data: profile } = useQuery({
    queryKey: ['admin-shop-customer', selectedId],
    queryFn: () => adminShopApi.getCustomerAdmin(selectedId as string),
    enabled: Boolean(selectedId),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="View customer profiles and order history" />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3d1a]/40" />
        <Input
          placeholder="Search customers..."
          className="pl-9 h-10 rounded-xl border-[#1a3d1a]/15"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <SectionCard>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#1a3d1a]" />
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="space-y-2">
            {data.data.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-3 border border-[#1a3d1a]/[0.06] rounded-2xl hover:border-[#1a3d1a]/[0.12] hover:bg-[#F7FFF8] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#EAF7EA] flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#1a3d1a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1a3d1a] truncate">{c.name}</p>
                  <p className="text-xs text-[#1a3d1a]/50">{c.email}</p>
                </div>
                <p className="text-sm text-[#1a3d1a]/50">{c.phone}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-[#1a3d1a]/70 hover:text-[#1a3d1a] hover:bg-[#1a3d1a]/5"
                  onClick={() => setSelectedId(c.id)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No customers found." icon={Users} />
        )}
      </SectionCard>

      <Dialog open={Boolean(selectedId)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-poppins text-[#1a3d1a]">{profile?.customer.name}</DialogTitle>
            <DialogDescription>{profile?.customer.email}</DialogDescription>
          </DialogHeader>
          {profile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-[#1a3d1a]/[0.06] rounded-2xl p-3 text-center">
                  <div className="font-bold text-xl text-[#1a3d1a]">{profile.stats.totalOrders}</div>
                  <div className="text-xs text-[#1a3d1a]/50">Total Orders</div>
                </div>
                <div className="border border-[#1a3d1a]/[0.06] rounded-2xl p-3 text-center">
                  <div className="font-bold text-xl text-[#1a3d1a]">৳{profile.stats.totalSpent}</div>
                  <div className="text-xs text-[#1a3d1a]/50">Total Spent</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#1a3d1a]/70 mb-2">Recent Orders</h3>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {profile.recentOrders.map((o) => (
                    <div key={o._id} className="flex justify-between text-sm border-b border-[#1a3d1a]/[0.06] pb-1.5">
                      <span>{o.orderNumber}</span>
                      <span className="text-[#1a3d1a]/50">{o.orderStatus}</span>
                      <span className="font-medium">৳{o.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
