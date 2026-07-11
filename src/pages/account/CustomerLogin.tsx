import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { getApiErrorMessage } from '@/lib/api/client';
import logo from '../../../public/logo1.png';

const inputCls =
  'h-11 rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60 focus-visible:ring-[#1a3d1a]/25 focus:border-[#1a3d1a]/40 transition-colors';

const loginSchema = z.object({
  email: z.string().trim().email('সঠিক ইমেইল ঠিকানা দিন'),
  password: z.string().min(1, 'পাসওয়ার্ড আবশ্যক'),
});
type LoginValues = z.infer<typeof loginSchema>;

const CustomerLogin = () => {
  const { customer, isLoading, login } = useCustomerAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (!isLoading && customer) {
    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/account';
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      await login(values.email, values.password);
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/account';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'ইমেইল বা পাসওয়ার্ড সঠিক নয়'));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFFDF0] font-hero-inter px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#1a3d1a]/[0.05] rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#E86A10]/[0.08] rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_30px_80px_-20px_rgba(26,61,26,0.3)] p-8 md:p-10 animate-fade-in">
        <div className="flex flex-col items-center mb-7">
          <Link to="/">
            <img src={logo} alt="Priyo Pet & Vet Care" className="h-14 w-auto mb-4" />
          </Link>
          <h1 className="font-serif-display text-2xl text-[#1a3d1a]">অ্যাকাউন্টে লগইন করুন</h1>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
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
              className="w-full bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> লগইন হচ্ছে...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> লগইন করুন
                </>
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-[#1a3d1a]/60 mt-6">
          অ্যাকাউন্ট নেই?{' '}
          <Link to="/account/register" className="text-[#E86A10] font-semibold hover:underline">
            নিবন্ধন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;
