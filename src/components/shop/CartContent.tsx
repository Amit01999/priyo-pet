import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as shopApi from '@/lib/api/shop.api';
import { getApiErrorMessage } from '@/lib/api/client';

const CartContent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: shopApi.fetchCart,
  });

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const updateMutation = useMutation({
    mutationFn: ({ productId, variantId, quantity }: { productId: string; variantId: string | null; quantity: number }) =>
      shopApi.updateCartItem(productId, variantId, quantity),
    onSuccess: invalidateCart,
    onError: (err) => toast.error(getApiErrorMessage(err, 'কার্ট আপডেট করা যায়নি')),
  });

  const removeMutation = useMutation({
    mutationFn: ({ productId, variantId }: { productId: string; variantId: string | null }) =>
      shopApi.removeCartItem(productId, variantId),
    onSuccess: () => {
      toast.success('পণ্য সরানো হয়েছে');
      invalidateCart();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'পণ্য সরানো যায়নি')),
  });

  return (
    <>
      <h1 className="font-serif-display text-2xl md:text-3xl text-[#1a3d1a] mb-8">আপনার কার্ট</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#1a3d1a]/[0.06] shadow-sm p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-[#1a3d1a]/20 mx-auto mb-4" />
          <p className="text-[#1a3d1a]/60 mb-6">আপনার কার্ট খালি।</p>
          <Button asChild className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full">
            <Link to="/shop">শপিং শুরু করুন</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId ?? ''}`}
                className="bg-white rounded-[20px] border border-[#1a3d1a]/[0.06] shadow-sm p-4 flex gap-4 items-center"
              >
                <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif-display text-[#1a3d1a] mb-1 truncate">{item.name}</h3>
                  <p className="text-sm text-[#E86A10] font-semibold">৳{item.priceDiscounted}</p>
                  {!item.isAvailable && (
                    <p className="text-xs text-destructive mt-1">এই পরিমাণে স্টকে নেই</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-[#1a3d1a]/15 rounded-full">
                      <button
                        className="p-1.5 text-[#1a3d1a] hover:bg-[#1a3d1a]/5 rounded-full"
                        disabled={updateMutation.isPending}
                        onClick={() =>
                          updateMutation.mutate({
                            productId: item.productId,
                            variantId: item.variantId,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[#1a3d1a]">{item.quantity}</span>
                      <button
                        className="p-1.5 text-[#1a3d1a] hover:bg-[#1a3d1a]/5 rounded-full"
                        disabled={updateMutation.isPending}
                        onClick={() =>
                          updateMutation.mutate({
                            productId: item.productId,
                            variantId: item.variantId,
                            quantity: item.quantity + 1,
                          })
                        }
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      className="text-destructive hover:text-destructive/70 transition-colors"
                      disabled={removeMutation.isPending}
                      onClick={() => removeMutation.mutate({ productId: item.productId, variantId: item.variantId })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="font-serif-display text-lg text-[#1a3d1a] flex-shrink-0">৳{item.lineTotal}</div>
              </div>
            ))}

            <Link to="/shop" className="inline-block text-sm text-[#1a3d1a]/60 hover:text-[#1a3d1a] mt-2">
              ← আরও কেনাকাটা করুন
            </Link>
          </div>

          <div className="bg-white rounded-[24px] border border-[#1a3d1a]/[0.06] shadow-sm p-6 h-fit space-y-3">
            <h3 className="font-serif-display text-lg text-[#1a3d1a] mb-2">অর্ডার সারাংশ</h3>
            <div className="flex justify-between text-sm text-[#1a3d1a]/70">
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
            <Button
              size="lg"
              disabled={cart.items.some((i) => !i.isAvailable)}
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#E86A10] hover:bg-[#d45e0d] text-white rounded-full shadow-md transition-all duration-300 hover:scale-[1.02] mt-2"
            >
              চেকআউট করুন <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartContent;
