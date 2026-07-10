import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, Store } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/shop/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as shopApi from '@/lib/api/shop.api';

const Shop = () => {
  const [search, setSearch] = useState('');
  const [categorySlug, setCategorySlug] = useState<string>('all');

  const { data: categories } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: shopApi.listCategories,
  });

  const { data: productsResult, isLoading } = useQuery({
    queryKey: ['shop-products', search, categorySlug],
    queryFn: () =>
      shopApi.listProducts({
        search: search || undefined,
        categorySlug: categorySlug === 'all' ? undefined : categorySlug,
        limit: 24,
      }),
  });

  return (
    <div className="min-h-screen bg-[#EFFDF0] font-hero-inter">
      <Header />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#1a3d1a]/10 shadow-sm rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
              <Store className="w-3.5 h-3.5 text-[#E86A10]" />
              Pet Accessories Shop
            </span>
            <h1 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
              আপনার পোষা প্রাণীর জন্য <span className="text-[#E86A10]">প্রিয় জিনিসপত্র</span>
            </h1>
            <p className="text-[#1a3d1a]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              সেরা মানের পোষা প্রাণীর সরঞ্জাম, ঘরে বসে অর্ডার করুন।
            </p>
          </div>

          <div className="flex flex-wrap gap-3 bg-white rounded-2xl border border-[#1a3d1a]/[0.06] shadow-sm p-4 mb-10 max-w-3xl mx-auto">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3d1a]/40" />
              <Input
                placeholder="পণ্য খুঁজুন..."
                className="pl-9 h-11 rounded-xl border-[#1a3d1a]/15"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categorySlug} onValueChange={setCategorySlug}>
              <SelectTrigger className="w-48 h-11 rounded-xl border-[#1a3d1a]/15">
                <SelectValue placeholder="সব ক্যাটাগরি" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                {categories?.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
            </div>
          ) : productsResult && productsResult.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsResult.data.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-[#1a3d1a]/50 py-24">কোনো পণ্য পাওয়া যায়নি।</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
