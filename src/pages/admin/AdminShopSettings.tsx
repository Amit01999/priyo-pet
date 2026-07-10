import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/admin/PageHeader';
import SectionCard from '@/components/admin/SectionCard';
import * as adminShopApi from '@/lib/api/adminShop.api';
import { getApiErrorMessage } from '@/lib/api/client';

const AdminShopSettings = () => {
  const queryClient = useQueryClient();
  const [deliveryCharge, setDeliveryCharge] = useState('');

  const { data, isLoading } = useQuery({ queryKey: ['admin-shop-settings'], queryFn: adminShopApi.getShopSettings });

  useEffect(() => {
    if (data) setDeliveryCharge(String(data.deliveryChargeBdt));
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => adminShopApi.updateShopSettings(Number(deliveryCharge)),
    onSuccess: () => {
      toast.success('Settings updated');
      queryClient.invalidateQueries({ queryKey: ['admin-shop-settings'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not update settings')),
  });

  return (
    <div className="space-y-6 max-w-md">
      <PageHeader title="Shop Settings" description="Store-wide configuration" />

      <SectionCard>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-[#1a3d1a]" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#1a3d1a]/70 mb-1.5 block">Delivery Charge (BDT)</label>
              <Input
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                min={0}
                className="h-10 rounded-xl border-[#1a3d1a]/15"
              />
            </div>
            <Button
              disabled={mutation.isPending}
              className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-sm transition-all duration-300 hover:scale-[1.02]"
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminShopSettings;
