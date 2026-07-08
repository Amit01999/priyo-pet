import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ANIMAL_TYPE_OPTIONS, GENDER_OPTIONS, AGE_OPTIONS } from '@/lib/validation/campaignFormSchema';
import type { AppointmentFormValues } from '@/lib/validation/campaignFormSchema';

const inputCls =
  'h-11 rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60 focus-visible:ring-[#1a3d1a]/25 focus:border-[#1a3d1a]/40 transition-colors';
const checkboxCls =
  'border-[#1a3d1a]/40 data-[state=checked]:bg-[#1a3d1a] data-[state=checked]:border-[#1a3d1a] data-[state=checked]:text-white';
const radioCls = 'border-[#1a3d1a]/40 text-[#1a3d1a]';
const optionLabelCls = 'flex items-center gap-2 cursor-pointer text-[#1a3d1a]/75';

const StepPetInfo = () => {
  const { control } = useFormContext<AppointmentFormValues>();

  return (
    <div className="space-y-5">
      <h3 className="font-serif-display text-xl md:text-2xl text-[#1a3d1a]">পোষা প্রাণীর তথ্য</h3>

      <FormField
        control={control}
        name="petName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">পোষা প্রাণীর নাম *</FormLabel>
            <FormControl>
              <Input placeholder="আপনার পোষা প্রাণীর নাম" className={inputCls} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="animalType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">প্রাণীর ধরন *</FormLabel>
            <div className="flex flex-wrap gap-4 pt-1">
              {ANIMAL_TYPE_OPTIONS.map((option) => {
                const checked = field.value?.includes(option.value) ?? false;
                return (
                  <label key={option.value} className={optionLabelCls}>
                    <Checkbox
                      className={checkboxCls}
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        const current = field.value ?? [];
                        field.onChange(
                          isChecked ? [...current, option.value] : current.filter((v) => v !== option.value)
                        );
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="breed"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">জাত (Breed)</FormLabel>
            <FormControl>
              <Input placeholder="যেমন: দেশি, জার্মান শেফার্ড ইত্যাদি" className={inputCls} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">লিঙ্গ *</FormLabel>
            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6 pt-1">
              {GENDER_OPTIONS.map((option) => (
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

      <FormField
        control={control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1a3d1a]/80">বয়স *</FormLabel>
            <RadioGroup onValueChange={field.onChange} value={field.value} className="grid sm:grid-cols-2 gap-2 pt-1">
              {AGE_OPTIONS.map((option) => (
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

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1a3d1a]/80">ওজন (প্রায়) *</FormLabel>
              <FormControl>
                <Input placeholder="যেমন: ১০ কেজি" className={inputCls} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="colorMarkings"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1a3d1a]/80">রং/বিশেষ পরিচিতি *</FormLabel>
              <FormControl>
                <Input placeholder="যেমন: সাদা-কালো, লেজে দাগ" className={inputCls} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StepPetInfo;
