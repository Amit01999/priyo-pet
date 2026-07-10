import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { getApiErrorMessage } from '@/lib/api/client';
import logo from '../../../public/logo1.png';

const inputCls =
  'h-11 rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60 focus-visible:ring-[#1a3d1a]/25 focus:border-[#1a3d1a]/40 transition-colors';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'আপনার পূর্ণ নাম লিখুন'),
  email: z.string().trim().email('সঠিক ইমেইল ঠিকানা দিন'),
  phone: z.string().trim().optional(),
  password: z.string().min(8, 'পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে'),
});
type RegisterValues = z.infer<typeof registerSchema>;

const CustomerRegister = () => {
  const { customer, isLoading, register } = useCustomerAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  });

  if (!isLoading && customer) {
    return <Navigate to="/account" replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      await register({ name: values.name, email: values.email, password: values.password, phone: values.phone });
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/account';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'অ্যাকাউন্ট তৈরি করা যায়নি'));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFFDF0] font-hero-inter px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_30px_80px_-20px_rgba(26,61,26,0.3)] p-8 md:p-10">
        <div className="flex flex-col items-center mb-7">
          <Link to="/">
            <img src={logo} alt="Priyo Pet & Vet Care" className="h-14 w-auto mb-4" />
          </Link>
          <h1 className="font-serif-display text-2xl text-[#1a3d1a]">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/80">পূর্ণ নাম</FormLabel>
                  <FormControl>
                    <Input placeholder="আপনার নাম" className={inputCls} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/80">ইমেইল</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" className={inputCls} {...field} />
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
                  <FormLabel className="text-[#1a3d1a]/80">মোবাইল নম্বর (ঐচ্ছিক)</FormLabel>
                  <FormControl>
                    <Input placeholder="01XXXXXXXXX" inputMode="tel" className={inputCls} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/80">পাসওয়ার্ড</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className={inputCls} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#E86A10] hover:bg-[#d45e0d] text-white rounded-full shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> তৈরি হচ্ছে...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" /> অ্যাকাউন্ট তৈরি করুন
                </>
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-[#1a3d1a]/60 mt-6">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
          <Link to="/account/login" className="text-[#E86A10] font-semibold hover:underline">
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;
