import { useFormContext } from 'react-hook-form';
import { Smartphone, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toBengaliDigits } from '@/lib/bengaliDate';
import type { AppointmentFormValues } from '@/lib/validation/campaignFormSchema';
import type { PublicCampaign } from '@/lib/api/types';

const inputCls =
  'h-11 rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60 focus-visible:ring-[#1a3d1a]/25 focus:border-[#1a3d1a]/40 transition-colors';

interface StepPaymentProps {
  campaign: PublicCampaign;
}

const StepPayment = ({ campaign }: StepPaymentProps) => {
  const { control } = useFormContext<AppointmentFormValues>();
  const bkashNumber = campaign.paymentInfo?.bkashNumber || '—';
  const amountBdt = campaign.paymentInfo?.amountBdt ?? 70;

  return (
    <div className="space-y-6">
      <h3 className="font-serif-display text-xl md:text-2xl text-[#1a3d1a]">পেমেন্ট ভেরিফিকেশন</h3>

      <div className="bg-[#E86A10]/[0.06] border border-[#E86A10]/20 rounded-[20px] p-5 flex flex-col sm:flex-row gap-5 items-center">
        <img src="/bkash.png" alt="bKash QR Code" className="w-32 h-32 rounded-xl border border-[#1a3d1a]/10 bg-white p-1.5 flex-shrink-0" />
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Wallet className="w-4 h-4 text-[#E86A10]" />
            <span className="font-semibold text-[#1a3d1a]">বিকাশ (Send Money)</span>
          </div>
          <div className="font-serif-display text-2xl text-[#E86A10]">৳{toBengaliDigits(amountBdt)}</div>
          <div className="inline-flex items-center gap-2 bg-white border border-[#1a3d1a]/10 rounded-full px-4 py-1.5">
            <Smartphone className="w-3.5 h-3.5 text-[#1a3d1a]/60" />
            <span className="font-semibold text-[#1a3d1a] tracking-wide">{bkashNumber}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-[#1a3d1a]/65 leading-relaxed bg-[#F7FFF8] border border-[#1a3d1a]/[0.06] rounded-[16px] p-4">
        অনুগ্রহ করে বিকাশ (Send Money) এর মাধ্যমে ৳{toBengaliDigits(amountBdt)} প্রদান করুন। অর্থ পাঠানোর পর
        বিকাশের রেফারেন্স নম্বরটি নিচে লিখে ফর্ম জমা দিন।
      </p>

      <FormField
        control={control}
        name="paymentReference"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">বিকাশ রেফারেন্স নম্বর (Transaction ID) *</FormLabel>
            <FormControl>
              <Input placeholder="যেমন: 8N7A6B5C4D" className={inputCls} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="paymentConfirmedByUser"
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
                আমি নিশ্চিত করছি যে, আমি উল্লিখিত বিকাশ নম্বরে ৳{toBengaliDigits(amountBdt)} Send Money করেছি। *
              </span>
            </label>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StepPayment;
