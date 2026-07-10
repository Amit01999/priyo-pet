import { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Minus, Plus, ShoppingCart, ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import * as shopApi from '@/lib/api/shop.api';
import { getApiErrorMessage } from '@/lib/api/client';

const ProductDetail = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { customer } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => shopApi.fetchProductBySlug(slug),
    enabled: Boolean(slug),
  });

  const product = data?.product;
  const related = data?.related ?? [];

  const variant = product?.hasVariants
    ? product.variants.find((v) => v._id === (selectedVariantId ?? product.variants[0]?._id))
    : undefined;
  const priceRegular = product?.hasVariants ? variant?.priceRegular ?? 0 : product?.priceRegular ?? 0;
  const priceDiscounted = product?.hasVariants ? variant?.priceDiscounted ?? 0 : product?.priceDiscounted ?? 0;
  const stock = product?.hasVariants ? variant?.stock ?? 0 : product?.stock ?? 0;
  const inStock = stock > 0;

  const addToCartMutation = useMutation({
    mutationFn: () => shopApi.addCartItem(product!._id, product!.hasVariants ? selectedVariantId ?? product!.variants[0]?._id : null, quantity),
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFFDF0]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFFDF0] px-4 text-center">
        <p className="text-[#1a3d1a]/60 mb-4">পণ্যটি পাওয়া যায়নি।</p>
        <Link to="/shop" className="text-[#E86A10] font-semibold hover:underline">
          শপে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFFDF0] font-hero-inter">
      <Header />

      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-[#1a3d1a]/60 hover:text-[#1a3d1a] mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> শপে ফিরে যান
          </Link>

          <div className="grid md:grid-cols-2 gap-10 bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_30px_80px_-20px_rgba(26,61,26,0.15)] p-6 md:p-10">
            {/* Gallery */}
            <div>
              <div className="aspect-square rounded-[20px] overflow-hidden bg-[#F7FFF8] mb-4">
                <img
                  src={product.images[activeImage] ?? '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === activeImage ? 'border-[#E86A10]' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="font-serif-display text-2xl md:text-3xl text-[#1a3d1a] mb-3">{product.name}</h1>
              <p className="text-[#1a3d1a]/60 leading-relaxed mb-5">{product.description}</p>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-serif-display text-3xl text-[#E86A10]">৳{priceDiscounted}</span>
                {priceRegular > priceDiscounted && (
                  <span className="text-lg text-[#1a3d1a]/40 line-through">৳{priceRegular}</span>
                )}
              </div>

              {product.hasVariants && (
                <div className="mb-5">
                  <label className="text-sm font-semibold text-[#1a3d1a]/80 mb-2 block">সাইজ নির্বাচন করুন</label>
                  <Select
                    value={selectedVariantId ?? product.variants[0]?._id}
                    onValueChange={setSelectedVariantId}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-[#1a3d1a]/15">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.variants.map((v) => (
                        <SelectItem key={v._id} value={v._id}>
                          {v.label} — ৳{v.priceDiscounted} ({v.stock > 0 ? `${v.stock} স্টকে আছে` : 'স্টক নেই'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <p className={`text-sm font-medium mb-5 ${inStock ? 'text-green-700' : 'text-destructive'}`}>
                {inStock ? `স্টকে আছে (${stock})` : 'স্টক নেই'}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-semibold text-[#1a3d1a]/80">পরিমাণ</label>
                <div className="flex items-center border border-[#1a3d1a]/15 rounded-full">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-[#1a3d1a] hover:bg-[#1a3d1a]/5 rounded-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-semibold text-[#1a3d1a]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock || 1, q + 1))}
                    className="p-2.5 text-[#1a3d1a] hover:bg-[#1a3d1a]/5 rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                disabled={!inStock || addToCartMutation.isPending}
                onClick={handleAddToCart}
                className="w-full bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                {addToCartMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4 mr-2" />
                )}
                কার্টে যোগ করুন
              </Button>

              <div className="mt-8 border-t border-[#1a3d1a]/[0.08] pt-6">
                <h3 className="font-serif-display text-lg text-[#1a3d1a] mb-3">Specifications</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-[#1a3d1a]/[0.06]">
                      <td className="py-2 text-[#1a3d1a]/50">Product</td>
                      <td className="py-2 text-[#1a3d1a]">{product.name}</td>
                    </tr>
                    {variant && (
                      <tr className="border-b border-[#1a3d1a]/[0.06]">
                        <td className="py-2 text-[#1a3d1a]/50">Variant</td>
                        <td className="py-2 text-[#1a3d1a]">{variant.label}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-2 text-[#1a3d1a]/50">Availability</td>
                      <td className="py-2 text-[#1a3d1a]">{inStock ? 'In Stock' : 'Out of Stock'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif-display text-2xl text-[#1a3d1a] mb-6">সম্পর্কিত পণ্য</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
