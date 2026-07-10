import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, LogIn, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getApiErrorMessage } from '@/lib/api/client';
import logo from '../../../public/logo1.png';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const { admin, isLoading, login } = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (!isLoading && admin) {
    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/admin';
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      await login(values.email, values.password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid email or password'));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFFDF0] px-4 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#1a3d1a]/[0.05] rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#E86A10]/[0.08] rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-white rounded-[28px] border border-[#1a3d1a]/[0.06] shadow-[0_25px_60px_-20px_rgba(26,61,26,0.25)] p-8 animate-fade-in">
        <div className="flex flex-col items-center mb-7">
          <img src={logo} alt="PriyoPet" className="h-12 w-auto mb-4" />
          <div className="flex items-center gap-2 text-[#1a3d1a] font-poppins font-bold text-xl">
            <span className="w-7 h-7 rounded-lg bg-[#E86A10] flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </span>
            Admin Panel
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/70">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@priyopet.com"
                      className="h-11 rounded-xl border-[#1a3d1a]/15 focus-visible:ring-[#1a3d1a]/30"
                      {...field}
                    />
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
                  <FormLabel className="text-[#1a3d1a]/70">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-[#1a3d1a]/15 focus-visible:ring-[#1a3d1a]/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-sm text-destructive bg-red-50 rounded-xl px-3 py-2">{error}</p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-sm transition-all duration-300 hover:scale-[1.02]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Sign in
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminLogin;
