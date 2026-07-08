import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { HEAR_ABOUT_OPTIONS } from '@/lib/validation/campaignFormSchema';
import type { AppointmentFormValues } from '@/lib/validation/campaignFormSchema';
import { fetchSlotsForDate } from '@/lib/api/publicCampaign.api';
import { formatBengaliDayMonth, toBengaliDigits } from '@/lib/bengaliDate';
import SlotGrid from '@/components/campaign/SlotGrid';
import type { PublicCampaign } from '@/lib/api/types';

interface StepScheduleProps {
  campaign: PublicCampaign;
}

const StepSchedule = ({ campaign }: StepScheduleProps) => {
  const { control, watch, setValue, resetField } = useFormContext<AppointmentFormValues>();
  const selectedDate = watch('appointmentDate');
  const selectedSlot = watch('slotNumber');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-slots', campaign.slug, selectedDate],
    queryFn: () => fetchSlotsForDate(campaign.slug, selectedDate),
    enabled: Boolean(selectedDate),
    refetchInterval: 15000,
  });

  const radioCls = 'border-[#1a3d1a]/40 text-[#1a3d1a]';
  const optionLabelCls = 'flex items-center gap-2 cursor-pointer text-[#1a3d1a]/75';

  return (
    <div className="space-y-6">
      <h3 className="font-serif-display text-xl md:text-2xl text-[#1a3d1a]">সময় নির্বাচন</h3>

      <FormField
        control={control}
        name="appointmentDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">আপনি কোন দিনে আসতে চান? *</FormLabel>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                resetField('slotNumber', { defaultValue: undefined });
              }}
              value={field.value}
              className="flex flex-wrap gap-4 pt-1"
            >
              {campaign.dates.map((date) => (
                <label key={date} className={optionLabelCls}>
                  <RadioGroupItem value={date} className={radioCls} />
                  <span>{formatBengaliDayMonth(date)}</span>
                </label>
              ))}
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedDate && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <FormLabel className="text-[#1a3d1a]/80">একটি সময় স্লট নির্বাচন করুন *</FormLabel>
            {data && (
              <span className="text-sm text-[#1a3d1a] font-semibold bg-[#EFFDF0] rounded-full px-3 py-1">
                {toBengaliDigits(data.remaining)} / {toBengaliDigits(data.total)} স্লট খালি
              </span>
            )}
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-[#1a3d1a]/50 text-sm py-6 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> স্লট লোড হচ্ছে...
            </div>
          )}
          {isError && (
            <p className="text-sm text-destructive py-2">স্লট লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।</p>
          )}
          {data && (
            <SlotGrid
              mode="select"
              slots={data.slots}
              selectedSlot={selectedSlot ?? null}
              onSelect={(slotNumber) => setValue('slotNumber', slotNumber, { shouldValidate: true })}
            />
          )}
          <FormField control={control} name="slotNumber" render={() => <FormMessage className="mt-2" />} />
        </div>
      )}

      <FormField
        control={control}
        name="hearAboutCampaign"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">এই ক্যাম্পেইনের খবর কোথা থেকে জেনেছেন? *</FormLabel>
            <RadioGroup onValueChange={field.onChange} value={field.value} className="grid sm:grid-cols-2 gap-2 pt-1">
              {HEAR_ABOUT_OPTIONS.map((option) => (
                <label key={option.value} className={optionLabelCls}>
                  <RadioGroupItem value={option.value} className={radioCls} />
                  <span>{option.label}</span>
                </label>
              ))}
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StepSchedule;
