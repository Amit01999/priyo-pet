import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { AppointmentFormValues } from '@/lib/validation/campaignFormSchema';

const inputCls =
  'h-11 rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60 focus-visible:ring-[#1a3d1a]/25 focus:border-[#1a3d1a]/40 transition-colors';

const StepGuardianInfo = () => {
  const { control } = useFormContext<AppointmentFormValues>();

  return (
    <div className="space-y-5">
      <h3 className="font-serif-display text-xl md:text-2xl text-[#1a3d1a]">
        পোষা প্রাণীর অভিভাবকের তথ্য
      </h3>

      <FormField
        control={control}
        name="guardianName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">পোষা প্রানীর অভিভাবকের নাম *</FormLabel>
            <FormControl>
              <Input placeholder="আপনার পূর্ণ নাম লিখুন" className={inputCls} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1a3d1a]/80">মোবাইল নম্বর *</FormLabel>
              <FormControl>
                <Input placeholder="01XXXXXXXXX" inputMode="tel" className={inputCls} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="alternateMobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1a3d1a]/80">বিকল্প মোবাইল নম্বর (যদি থাকে)</FormLabel>
              <FormControl>
                <Input placeholder="01XXXXXXXXX" inputMode="tel" className={inputCls} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">ইমেইল *</FormLabel>
            <FormControl>
              <Input type="email" placeholder="you@example.com" className={inputCls} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StepGuardianInfo;
