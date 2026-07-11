import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { getApiErrorMessage } from '@/lib/api/client';

const inputCls =
  'h-11 rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60 focus-visible:ring-[#1a3d1a]/25 focus:border-[#1a3d1a]/40 transition-colors';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'নাম লিখুন'),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  district: z.string().trim().optional(),
});
type ProfileValues = z.infer<typeof profileSchema>;

const AccountProfile = () => {
  const { customer, refreshProfile } = useCustomerAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: customer?.name ?? '',
      phone: customer?.phone ?? '',
      address: customer?.address ?? '',
      district: customer?.district ?? '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await refreshProfile(values);
      toast.success('প্রোফাইল আপডেট হয়েছে');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'প্রোফাইল আপডেট করা যায়নি'));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <span className="w-14 h-14 rounded-full bg-[#1a3d1a] text-white flex items-center justify-center text-xl font-semibold flex-shrink-0">
          {customer?.name?.[0]?.toUpperCase() ?? 'A'}
        </span>
        <div>
          <h1 className="font-serif-display text-2xl text-[#1a3d1a]">প্রোফাইল</h1>
          <p className="text-sm text-[#1a3d1a]/50">{customer?.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-[0_2px_14px_-6px_rgba(26,61,26,0.1)] p-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/80">নাম</FormLabel>
                  <FormControl>
                    <Input className={inputCls} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/80">মোবাইল নম্বর</FormLabel>
                  <FormControl>
                    <Input inputMode="tel" className={inputCls} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/80">ঠিকানা</FormLabel>
                  <FormControl>
                    <Input className={inputCls} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/80">জেলা</FormLabel>
                  <FormControl>
                    <Input className={inputCls} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-sm transition-all duration-300 hover:scale-[1.02]"
            >
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              সংরক্ষণ করুন
            </Button>
          </form>
        </Form>
      </div>

      <div className="bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-[0_2px_14px_-6px_rgba(26,61,26,0.1)] p-6">
        <h3 className="font-serif-display text-lg text-[#1a3d1a] mb-2">ইমেইল</h3>
        <p className="text-[#1a3d1a]/60 text-sm">{customer?.email}</p>
      </div>
    </div>
  );
};

export default AccountProfile;
