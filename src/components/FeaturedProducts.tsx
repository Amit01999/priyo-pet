import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Store, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/shop/ProductCard';
import * as shopApi from '@/lib/api/shop.api';

const FeaturedProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['shop-products', 'featured'],
    queryFn: () => shopApi.listProducts({ limit: 3 }),
  });

  if (!isLoading && (!data || data.data.length === 0)) return null;

  return (
    <section className="bg-white py-24">
      <div className="text-center mb-16 animate-fade-up px-4">
        <span className="inline-flex items-center gap-1.5 bg-[#EFFDF0] rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
          <Store className="w-3.5 h-3.5 text-[#E86A10]" />
          Pet Accessories Shop
        </span>
        <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
          আপনার পোষা প্রাণীর জন্য <span className="text-[#E86A10]">প্রিয় জিনিসপত্র</span>
        </h2>
        <p className="text-[#1a3d1a]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          সেরা মানের নেক বেল্ট, কলার, চিরুনি সহ পোষা প্রাণীর সরঞ্জাম — ঘরে বসে অর্ডার করুন।
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data!.data.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full px-7 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Link to="/shop">
              সব পণ্য দেখুন <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
