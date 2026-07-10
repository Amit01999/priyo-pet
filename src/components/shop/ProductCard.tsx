import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ShoppingCart, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import * as shopApi from '@/lib/api/shop.api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { Product } from '@/lib/api/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { customer } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [selectedVariantId, setSelectedVariantId] = useState(product.hasVariants ? product.variants[0]?._id : undefined);
  const selectedVariant = product.hasVariants
    ? product.variants.find((v) => v._id === selectedVariantId)
    : undefined;

  const priceRegular = product.hasVariants ? selectedVariant?.priceRegular ?? 0 : product.priceRegular ?? 0;
  const priceDiscounted = product.hasVariants ? selectedVariant?.priceDiscounted ?? 0 : product.priceDiscounted ?? 0;
  const stock = product.hasVariants ? selectedVariant?.stock ?? 0 : product.stock ?? 0;
  const discountPercent = priceRegular > 0 ? Math.round(((priceRegular - priceDiscounted) / priceRegular) * 100) : 0;
  const savings = priceRegular - priceDiscounted;
  const inStock = stock > 0;
  const lowStock = inStock && stock <= 5;

  const addToCartMutation = useMutation({
    mutationFn: () => shopApi.addCartItem(product._id, selectedVariantId ?? null, 1),
    onSuccess: () => {
      toast.success('কার্টে যোগ করা হয়েছে');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'কার্টে যোগ করা যায়নি')),
  });

  const handleAddToCart = () => {
    if (!customer) {
      navigate('/account/login', { state: { from: location } });
      return;
    }
    addToCartMutation.mutate();
  };

  return (
    <div className="group relative bg-white rounded-[28px] border border-[#1a3d1a]/[0.07] shadow-[0_15px_40px_-20px_rgba(26,61,26,0.25)] hover:shadow-[0_28px_60px_-18px_rgba(26,61,26,0.35)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
      {/* Image */}
      <Link
        to={`/shop/${product.slug}`}
        className="relative block aspect-square overflow-hidden border-b border-[#1a3d1a]/[0.07]"
      >
        <img
          src={product.images[0] ?? '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {discountPercent > 0 && (
            <span className="bg-[#E86A10] text-white text-xs font-bold rounded-full px-3 py-1 shadow-[0_4px_12px_rgba(232,106,16,0.45)]">
              {discountPercent}% ছাড়
            </span>
          )}
          {lowStock && (
            <span className="bg-white/95 backdrop-blur-sm text-red-600 text-[10px] font-semibold rounded-full px-2.5 py-1 shadow-sm border border-red-100">
              মাত্র {stock}টি বাকি
            </span>
          )}
        </div>

        {/* Quick view — appears on hover */}
        <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <Eye className="w-4 h-4 text-[#1a3d1a]" />
        </span>

        {!inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-[#1a3d1a]/50 backdrop-blur-[1px]">
            <span className="bg-white text-[#1a3d1a] text-xs font-bold rounded-full px-4 py-1.5 shadow-md">
              স্টক নেই
            </span>
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-serif-display text-lg text-[#1a3d1a] mb-1 line-clamp-1 group-hover:text-[#E86A10] transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs text-[#1a3d1a]/50 leading-relaxed line-clamp-2 mb-3">{product.description}</p>
        )}

        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-3">
          <span className="font-serif-display text-xl text-[#1a3d1a]">৳{priceDiscounted}</span>
          {priceRegular > priceDiscounted && (
            <>
              <span className="text-sm text-[#1a3d1a]/35 line-through">৳{priceRegular}</span>
              <span className="text-[10px] font-semibold text-[#1a3d1a] bg-[#EFFDF0] rounded-full px-2 py-0.5">
                সাশ্রয় ৳{savings}
              </span>
            </>
          )}
        </div>

        {product.hasVariants && (
          <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
            <SelectTrigger className="mb-3 h-9 rounded-lg border-[#1a3d1a]/15 text-sm">
              <SelectValue placeholder="Size নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map((v) => (
                <SelectItem key={v._id} value={v._id}>
                  {v.label} — ৳{v.priceDiscounted}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex items-center gap-1.5 mb-4">
          <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-green-600' : 'bg-destructive'}`} />
          <p className={`text-xs font-medium ${inStock ? 'text-green-700' : 'text-destructive'}`}>
            {inStock ? 'স্টকে আছে' : 'স্টক নেই'}
          </p>
        </div>

        <Button
          disabled={!inStock || addToCartMutation.isPending}
          onClick={handleAddToCart}
          className="mt-auto w-full bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-sm transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100"
        >
          {addToCartMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" /> কার্টে যোগ করুন
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
