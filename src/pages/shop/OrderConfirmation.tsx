import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import * as shopApi from '@/lib/api/shop.api';

const OrderConfirmation = () => {
  const { id = '' } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['my-order', id],
    queryFn: () => shopApi.getMyOrder(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFFDF0]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFFDF0] font-hero-inter">
      <Header />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-xl">
          <div className="bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_30px_80px_-20px_rgba(26,61,26,0.3)] p-10 md:p-12 text-center animate-hero-scale-in">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#EFFDF0] flex items-center justify-center mb-6 shadow-sm">
              <CheckCircle2 className="w-9 h-9 text-[#1a3d1a]" />
            </div>
            <h1 className="font-serif-display text-2xl md:text-3xl text-[#1a3d1a] mb-3">অর্ডার সফল হয়েছে!</h1>
            <p className="text-[#1a3d1a]/60 mb-7 leading-relaxed">
              আপনার অর্ডার গ্রহণ করা হয়েছে। পেমেন্ট যাচাই হওয়ার পর আরেকটি ইমেইল পাঠানো হবে।
            </p>

            {order && (
              <div className="inline-flex items-center gap-2 bg-[#1a3d1a] text-white rounded-full px-6 py-3 font-semibold shadow-md mb-6">
                অর্ডার নম্বর: {order.orderNumber}
              </div>
            )}

            <div className="flex items-start gap-3 bg-[#F7FFF8] border border-[#1a3d1a]/[0.08] rounded-[16px] p-4 text-left mb-7">
              <Mail className="w-5 h-5 text-[#E86A10] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#1a3d1a]/70 leading-relaxed">
                আপনার ইমেইলে একটি নিশ্চিতকরণ বার্তা পাঠানো হয়েছে। পেমেন্ট যাচাই হওয়ার পর (সাধারণত ২৪ ঘণ্টার মধ্যে)
                ইনভয়েস (PDF) সহ আরেকটি ইমেইল পাবেন।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline" className="rounded-full border-[#1a3d1a]/20 text-[#1a3d1a]">
                <Link to="/shop">আরও কেনাকাটা করুন</Link>
              </Button>
              <Button asChild className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full">
                <Link to="/account/orders">আমার অর্ডারসমূহ দেখুন</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
