import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Wallet, Smartphone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import * as shopApi from '@/lib/api/shop.api';
import { getApiErrorMessage } from '@/lib/api/client';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

const inputCls =
  'h-11 rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60 focus-visible:ring-[#1a3d1a]/25 focus:border-[#1a3d1a]/40 transition-colors';

const checkoutSchema = z.object({
  shippingName: z.string().trim().min(2, 'নাম লিখুন'),
  shippingPhone: z.string().trim().min(11, 'সঠিক মোবাইল নম্বর দিন'),
  shippingAddress: z.string().trim().min(5, 'সম্পূর্ণ ঠিকানা লিখুন'),
  shippingDistrict: z.string().trim().min(2, 'জেলার নাম লিখুন'),
  notes: z.string().trim().optional(),
  paymentReference: z.string().trim().min(4, 'সঠিক বিকাশ ট্রানজেকশন আইডি দিন'),
  paymentConfirmedByUser: z.literal(true, {
    errorMap: () => ({ message: 'অনুগ্রহ করে পেমেন্ট নিশ্চিত করুন' }),
  }),
});
type CheckoutValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { customer } = useCustomerAuth();

  const { data: cart, isLoading: cartLoading } = useQuery({ queryKey: ['cart'], queryFn: shopApi.fetchCart });
  const { data: paymentInfo } = useQuery({ queryKey: ['shop-payment-info'], queryFn: shopApi.fetchPaymentInfo });

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingName: customer?.name ?? '',
      shippingPhone: customer?.phone ?? '',
      shippingAddress: customer?.address ?? '',
      shippingDistrict: customer?.district ?? '',
      notes: '',
      paymentReference: '',
      paymentConfirmedByUser: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CheckoutValues) =>
      shopApi.checkout({
        shippingName: values.shippingName,
        shippingPhone: values.shippingPhone,
        shippingAddress: values.shippingAddress,
        shippingDistrict: values.shippingDistrict,
        notes: values.notes,
        paymentReference: values.paymentReference,
        paymentConfirmedByUser: true,
      }),
    onSuccess: (order) => {
      toast.success('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
      navigate(`/order-confirmation/${order._id}`, { replace: true });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'অর্ডার সম্পন্ন করা যায়নি')),
  });

  if (!cartLoading && (!cart || cart.items.length === 0)) {
    return <Navigate to="/cart" replace />;
  }

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <div className="min-h-screen bg-[#EFFDF0] font-hero-inter">
      <Header />

      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif-display text-2xl md:text-3xl text-[#1a3d1a] mb-8">চেকআউট</h1>

          {cartLoading || !cart ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-white rounded-[24px] border border-[#1a3d1a]/[0.06] shadow-sm p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={onSubmit} className="space-y-5">
                    <h3 className="font-serif-display text-lg text-[#1a3d1a]">শিপিং তথ্য</h3>

                    <FormField
                      control={form.control}
                      name="shippingName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#1a3d1a]/80">নাম *</FormLabel>
                          <FormControl>
                            <Input className={inputCls} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#1a3d1a]/80">মোবাইল নম্বর *</FormLabel>
                            <FormControl>
                              <Input inputMode="tel" placeholder="01XXXXXXXXX" className={inputCls} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingDistrict"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#1a3d1a]/80">জেলা *</FormLabel>
                            <FormControl>
                              <Input placeholder="খুলনা" className={inputCls} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#1a3d1a]/80">সম্পূর্ণ ঠিকানা *</FormLabel>
                          <FormControl>
                            <Textarea className="rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#1a3d1a]/80">নোট (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Textarea className="rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <h3 className="font-serif-display text-lg text-[#1a3d1a] pt-3 border-t border-[#1a3d1a]/[0.08]">
                      পেমেন্ট
                    </h3>

                    {paymentInfo && (
                      <div className="bg-[#E86A10]/[0.06] border border-[#E86A10]/20 rounded-[20px] p-5 flex flex-col sm:flex-row gap-5 items-center">
                        <img
                          src="/bkash.png"
                          alt="bKash QR Code"
                          className="w-28 h-28 rounded-xl border border-[#1a3d1a]/10 bg-white p-1.5 flex-shrink-0"
                        />
                        <div className="flex-1 space-y-2 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <Wallet className="w-4 h-4 text-[#E86A10]" />
                            <span className="font-semibold text-[#1a3d1a]">বিকাশ (Send Money)</span>
                          </div>
                          <div className="font-serif-display text-2xl text-[#E86A10]">৳{cart.total}</div>
                          <div className="inline-flex items-center gap-2 bg-white border border-[#1a3d1a]/10 rounded-full px-4 py-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-[#1a3d1a]/60" />
                            <span className="font-semibold text-[#1a3d1a] tracking-wide">{paymentInfo.bkashNumber}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-[#1a3d1a]/65 leading-relaxed bg-[#F7FFF8] border border-[#1a3d1a]/[0.06] rounded-[16px] p-4">
                      অনুগ্রহ করে বিকাশ (Send Money) এর মাধ্যমে ৳{cart.total} প্রদান করুন। অর্থ পাঠানোর পর বিকাশের
                      রেফারেন্স নম্বরটি নিচে লিখে অর্ডার সম্পন্ন করুন।
                    </p>

                    <FormField
                      control={form.control}
                      name="paymentReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#1a3d1a]/80">বিকাশ রেফারেন্স নম্বর *</FormLabel>
                          <FormControl>
                            <Input placeholder="যেমন: 8N7A6B5C4D" className={inputCls} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
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
                              আমি নিশ্চিত করছি যে, আমি উল্লিখিত বিকাশ নম্বরে ৳{cart.total} Send Money করেছি। *
                            </span>
                          </label>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      disabled={mutation.isPending}
                      className="w-full bg-[#E86A10] hover:bg-[#d45e0d] text-white rounded-full shadow-md transition-all duration-300 hover:scale-[1.02]"
                    >
                      {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      অর্ডার সম্পন্ন করুন
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="bg-white rounded-[24px] border border-[#1a3d1a]/[0.06] shadow-sm p-6 h-fit space-y-3">
                <h3 className="font-serif-display text-lg text-[#1a3d1a] mb-2">অর্ডার সারাংশ</h3>
                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.variantId ?? ''}`} className="flex justify-between text-sm text-[#1a3d1a]/70">
                    <span className="truncate pr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="flex-shrink-0">৳{item.lineTotal}</span>
                  </div>
                ))}
                <div className="border-t border-[#1a3d1a]/[0.08] pt-3 flex justify-between text-sm text-[#1a3d1a]/70">
                  <span>সাবটোটাল</span>
                  <span>৳{cart.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-[#1a3d1a]/70">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{cart.deliveryCharge}</span>
                </div>
                <div className="border-t border-[#1a3d1a]/[0.08] pt-3 flex justify-between font-serif-display text-lg text-[#1a3d1a]">
                  <span>মোট</span>
                  <span>৳{cart.total}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
