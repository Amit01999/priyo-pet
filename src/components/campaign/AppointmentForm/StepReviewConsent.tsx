import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import {
  ANIMAL_TYPE_OPTIONS,
  GENDER_OPTIONS,
  AGE_OPTIONS,
  HEALTH_STATUS_OPTIONS,
  HEAR_ABOUT_OPTIONS,
} from '@/lib/validation/campaignFormSchema';
import type { AppointmentFormValues } from '@/lib/validation/campaignFormSchema';
import { formatBengaliDayMonth, formatBengaliTime, toBengaliDigits } from '@/lib/bengaliDate';
import type { CampaignContent } from '@/content/campaigns/rabies-2026.content';

function labelFor(options: readonly { value: string; label: string }[], value?: string): string {
  return options.find((o) => o.value === value)?.label ?? '—';
}

interface StepReviewConsentProps {
  content: CampaignContent;
  selectedSlotTime?: string;
}

const StepReviewConsent = ({ content, selectedSlotTime }: StepReviewConsentProps) => {
  const { control, watch } = useFormContext<AppointmentFormValues>();
  const values = watch();

  const rows: { label: string; value: string }[] = [
    { label: 'অভিভাবকের নাম', value: values.guardianName },
    { label: 'মোবাইল নম্বর', value: values.mobileNumber },
    { label: 'বিকল্প মোবাইল নম্বর', value: values.alternateMobileNumber || '—' },
    { label: 'ইমেইল', value: values.email },
    { label: 'পোষা প্রাণীর নাম', value: values.petName },
    { label: 'প্রাণীর ধরন', value: (values.animalType ?? []).map((v) => labelFor(ANIMAL_TYPE_OPTIONS, v)).join(', ') },
    { label: 'জাত', value: values.breed || '—' },
    { label: 'লিঙ্গ', value: labelFor(GENDER_OPTIONS, values.gender) },
    { label: 'বয়স', value: labelFor(AGE_OPTIONS, values.age) },
    { label: 'ওজন', value: values.weight },
    { label: 'রং/বিশেষ পরিচিতি', value: values.colorMarkings },
    { label: 'পূর্ববর্তী টিকাদান তথ্য', value: values.previousVaccinationInfo },
    { label: 'বর্তমান স্বাস্থ্য অবস্থা', value: labelFor(HEALTH_STATUS_OPTIONS, values.currentHealthStatus) },
    {
      label: 'অ্যাপয়েন্টমেন্টের দিন ও সময়',
      value: values.appointmentDate
        ? `${formatBengaliDayMonth(values.appointmentDate)}${
            selectedSlotTime ? `, ${formatBengaliTime(selectedSlotTime)}` : ''
          }${values.slotNumber ? ` (স্লট #${toBengaliDigits(values.slotNumber)})` : ''}`
        : '—',
    },
    { label: 'কীভাবে জেনেছেন', value: labelFor(HEAR_ABOUT_OPTIONS, values.hearAboutCampaign) },
  ];

  return (
    <div className="space-y-6">
      <h3 className="font-serif-display text-xl md:text-2xl text-[#1a3d1a]">পর্যালোচনা ও সম্মতি</h3>

      <div className="bg-[#F7FFF8] rounded-[20px] border border-[#1a3d1a]/[0.06] p-5 space-y-2.5 max-h-72 overflow-y-auto">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-sm">
            <span className="font-semibold text-[#1a3d1a]/50 sm:w-48 flex-shrink-0">{row.label}</span>
            <span className="text-[#1a3d1a] break-words">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E86A10]/25 rounded-[20px] p-5">
        <h4 className="font-serif-display text-lg text-[#1a3d1a] mb-2">সম্মতিপত্র</h4>
        <p className="text-sm text-[#1a3d1a]/65 leading-relaxed whitespace-pre-line">
          {content.consentText}
        </p>
      </div>

      <FormField
        control={control}
        name="consentAcknowledged"
        render={({ field }) => (
          <FormItem>
            <label className="flex items-start gap-3 cursor-pointer">
              <FormControl>
                <Checkbox
                  className="mt-0.5 border-[#1a3d1a]/40 data-[state=checked]:bg-[#1a3d1a] data-[state=checked]:border-[#1a3d1a] data-[state=checked]:text-white"
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              </FormControl>
              <span className="text-[#1a3d1a]/80 text-sm leading-relaxed">
                আমি উপরের সম্মতিপত্র পড়েছি এবং তাতে সম্মত আছি। *
              </span>
            </label>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StepReviewConsent;
