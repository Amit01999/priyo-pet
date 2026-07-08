import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { HEALTH_STATUS_OPTIONS } from '@/lib/validation/campaignFormSchema';
import type { AppointmentFormValues } from '@/lib/validation/campaignFormSchema';

const radioCls = 'border-[#1a3d1a]/40 text-[#1a3d1a]';
const optionLabelCls = 'flex items-center gap-2 cursor-pointer text-[#1a3d1a]/75';

const StepHealthInfo = () => {
  const { control } = useFormContext<AppointmentFormValues>();

  return (
    <div className="space-y-5">
      <h3 className="font-serif-display text-xl md:text-2xl text-[#1a3d1a]">
        পূর্ববর্তী টিকাদান ও বর্তমান স্বাস্থ্য তথ্য
      </h3>

      <FormField
        control={control}
        name="previousVaccinationInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">
              এর আগে কি র‍্যাবিস টিকা দেওয়া হয়েছে? *
              <span className="block text-xs font-normal text-[#1a3d1a]/50 mt-1">
                হ্যাঁ হলে শেষ টিকা দেওয়ার তারিখ এবং ভ্যাকসিনের নাম লিখুন (যদি জানা থাকে)। না হলে &quot;না&quot; লিখুন।
              </span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="উত্তর লিখুন..."
                className="min-h-[110px] rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60 focus-visible:ring-[#1a3d1a]/25 focus:border-[#1a3d1a]/40 transition-colors"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="currentHealthStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">বর্তমানে আপনার পোষা প্রাণী কি - *</FormLabel>
            <RadioGroup onValueChange={field.onChange} value={field.value} className="grid sm:grid-cols-2 gap-2 pt-1">
              {HEALTH_STATUS_OPTIONS.map((option) => (
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

export default StepHealthInfo;
