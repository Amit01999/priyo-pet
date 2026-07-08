import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Lock, Unlock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SlotGrid from '@/components/campaign/SlotGrid';
import { useAdminCampaign } from '@/contexts/AdminCampaignContext';
import { fetchCampaign } from '@/lib/api/publicCampaign.api';
import * as slotsApi from '@/lib/api/adminSlots.api';
import { getApiErrorMessage } from '@/lib/api/client';

const AdminSlots = () => {
  const { selectedSlug } = useAdminCampaign();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [pendingSlot, setPendingSlot] = useState<number | null>(null);
  const [maxSlotsInput, setMaxSlotsInput] = useState('');
  const queryClient = useQueryClient();

  const { data: campaign } = useQuery({
    queryKey: ['public-campaign', selectedSlug],
    queryFn: () => fetchCampaign(selectedSlug as string),
    enabled: Boolean(selectedSlug),
  });

  const activeDate = selectedDate ?? campaign?.dates[0] ?? null;

  const { data: slotsResult, isLoading } = useQuery({
    queryKey: ['admin-slots', selectedSlug, activeDate],
    queryFn: () => slotsApi.fetchAdminSlots(selectedSlug as string, activeDate as string),
    enabled: Boolean(selectedSlug && activeDate),
  });

  const invalidateSlots = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-slots', selectedSlug, activeDate] });
    queryClient.invalidateQueries({ queryKey: ['public-slots', selectedSlug, activeDate] });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats', selectedSlug] });
  };

  const handleBlock = async (slotNumber: number) => {
    if (!selectedSlug || !activeDate) return;
    setPendingSlot(slotNumber);
    try {
      await slotsApi.blockSlot(selectedSlug, activeDate, slotNumber, 'Blocked by admin');
      toast.success(`Slot #${slotNumber} blocked`);
      invalidateSlots();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not block slot'));
    } finally {
      setPendingSlot(null);
    }
  };

  const handleUnblock = async (slotNumber: number) => {
    if (!selectedSlug || !activeDate) return;
    setPendingSlot(slotNumber);
    try {
      await slotsApi.unblockSlot(selectedSlug, activeDate, slotNumber);
      toast.success(`Slot #${slotNumber} unblocked`);
      invalidateSlots();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not unblock slot'));
    } finally {
      setPendingSlot(null);
    }
  };

  const handleDayStatus = async (status: 'open' | 'closed') => {
    if (!selectedSlug || !activeDate) return;
    try {
      await slotsApi.updateDayStatus(selectedSlug, activeDate, status);
      toast.success(`Day marked ${status}`);
      queryClient.invalidateQueries({ queryKey: ['public-campaign', selectedSlug] });
      invalidateSlots();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not update day status'));
    }
  };

  const handleUpdateMaxSlots = async () => {
    if (!selectedSlug || !maxSlotsInput) return;
    try {
      await slotsApi.updateCampaignConfig(selectedSlug, { maxSlotsPerDay: Number(maxSlotsInput) });
      toast.success('Daily slot limit updated');
      queryClient.invalidateQueries({ queryKey: ['public-campaign', selectedSlug] });
      invalidateSlots();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not update slot limit'));
    }
  };

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const dayStatus = campaign.dayStatus[activeDate ?? ''] ?? 'open';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-poppins font-bold text-2xl text-gray-800">Slot Management</h1>
        <Select value={activeDate ?? undefined} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select date" />
          </SelectTrigger>
          <SelectContent>
            {campaign.dates.map((date) => (
              <SelectItem key={date} value={date}>
                {date}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-poppins text-lg">
            {activeDate} — {slotsResult?.remaining ?? '—'} / {slotsResult?.total ?? campaign.maxSlotsPerDay} available
          </CardTitle>
          <Button
            size="sm"
            variant={dayStatus === 'open' ? 'destructive' : 'default'}
            className={dayStatus === 'closed' ? 'bg-primary hover:bg-primary/90' : ''}
            onClick={() => handleDayStatus(dayStatus === 'open' ? 'closed' : 'open')}
          >
            {dayStatus === 'open' ? (
              <>
                <Lock className="w-4 h-4 mr-1.5" /> Close Day
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-1.5" /> Open Day
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading || !slotsResult ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <SlotGrid
              mode="manage"
              slots={slotsResult.slots}
              onBlock={handleBlock}
              onUnblock={handleUnblock}
              pendingSlot={pendingSlot}
            />
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-poppins text-lg">Campaign Configuration</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Daily slot limit</label>
            <Input
              type="number"
              min={1}
              placeholder={String(campaign.maxSlotsPerDay)}
              value={maxSlotsInput}
              onChange={(e) => setMaxSlotsInput(e.target.value)}
              className="w-32"
            />
          </div>
          <Button onClick={handleUpdateMaxSlots} className="bg-primary hover:bg-primary/90">
            Update
          </Button>
          <p className="text-xs text-gray-500 w-full">
            Slot duration ({campaign.slotDurationMinutes} min) can only be changed while no appointments exist yet for
            this campaign.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSlots;
