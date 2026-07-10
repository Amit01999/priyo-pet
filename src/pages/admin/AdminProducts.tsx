import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/admin/PageHeader';
import SectionCard from '@/components/admin/SectionCard';
import EmptyState from '@/components/admin/EmptyState';
import ProductFormDialog from '@/components/admin/ProductFormDialog';
import { ENABLED_BADGE_CLASSES } from '@/components/admin/statusStyles';
import * as adminShopApi from '@/lib/api/adminShop.api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { Product } from '@/lib/api/types';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: categories } = useQuery({ queryKey: ['admin-shop-categories'], queryFn: adminShopApi.listCategoriesAdmin });
  const { data, isLoading } = useQuery({
    queryKey: ['admin-shop-products', search],
    queryFn: () => adminShopApi.listProductsAdmin({ search: search || undefined, limit: 50 }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-shop-products'] });

  const toggleEnabledMutation = useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) => adminShopApi.updateProduct(id, { isEnabled }),
    onSuccess: invalidate,
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not update product')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminShopApi.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted');
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not delete product')),
  });

  const openCreate = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your storefront catalog"
        actions={
          <Button
            size="sm"
            className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-sm transition-all duration-300 hover:scale-[1.02]"
            onClick={openCreate}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Product
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3d1a]/40" />
        <Input
          placeholder="Search products..."
          className="pl-9 h-10 rounded-xl border-[#1a3d1a]/15"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <SectionCard>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#1a3d1a]" />
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="space-y-2">
            {data.data.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-4 p-3 border border-[#1a3d1a]/[0.06] rounded-2xl hover:border-[#1a3d1a]/[0.12] hover:bg-[#F7FFF8] transition-colors"
              >
                <img
                  src={product.images[0] ?? '/placeholder.svg'}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-[#1a3d1a]/[0.06]"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1a3d1a] truncate">{product.name}</p>
                  <p className="text-xs text-[#1a3d1a]/50">
                    {product.hasVariants
                      ? `${product.variants.length} variants`
                      : `৳${product.priceDiscounted} · Stock: ${product.stock}`}
                  </p>
                </div>
                <Badge className={product.isEnabled ? ENABLED_BADGE_CLASSES.enabled : ENABLED_BADGE_CLASSES.disabled}>
                  {product.isEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Switch
                  checked={product.isEnabled}
                  onCheckedChange={(checked) => toggleEnabledMutation.mutate({ id: product._id, isEnabled: checked })}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-[#1a3d1a]/60 hover:text-[#1a3d1a] hover:bg-[#1a3d1a]/5"
                  onClick={() => openEdit(product)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-destructive hover:bg-red-50"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(product._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No products found." icon={Package} />
        )}
      </SectionCard>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        categories={categories ?? []}
      />
    </div>
  );
};

export default AdminProducts;
