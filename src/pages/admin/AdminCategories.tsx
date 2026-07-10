import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Pencil, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import PageHeader from '@/components/admin/PageHeader';
import SectionCard from '@/components/admin/SectionCard';
import EmptyState from '@/components/admin/EmptyState';
import * as adminShopApi from '@/lib/api/adminShop.api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { Category } from '@/lib/api/types';

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-shop-categories'],
    queryFn: adminShopApi.listCategoriesAdmin,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-shop-categories'] });

  const saveMutation = useMutation({
    mutationFn: () =>
      editing ? adminShopApi.updateCategory(editing._id, { name }) : adminShopApi.createCategory({ name }),
    onSuccess: () => {
      toast.success(editing ? 'Category updated' : 'Category created');
      setDialogOpen(false);
      setName('');
      setEditing(null);
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not save category')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminShopApi.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted');
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not delete category')),
  });

  const openCreate = () => {
    setEditing(null);
    setName('');
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setName(category.name);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your product catalog"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-sm transition-all duration-300 hover:scale-[1.02]"
                onClick={openCreate}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl border-[#1a3d1a]/15"
              />
              <DialogFooter>
                <Button
                  disabled={saveMutation.isPending || !name.trim()}
                  onClick={() => saveMutation.mutate()}
                  className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full"
                >
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <SectionCard>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#1a3d1a]" />
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between p-3 border border-[#1a3d1a]/[0.06] rounded-2xl hover:border-[#1a3d1a]/[0.12] hover:bg-[#F7FFF8] transition-colors"
              >
                <span className="font-medium text-[#1a3d1a]">{c.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-[#1a3d1a]/60 hover:text-[#1a3d1a] hover:bg-[#1a3d1a]/5"
                    onClick={() => openEdit(c)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-destructive hover:bg-red-50"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(c._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No categories found." icon={FolderTree} />
        )}
      </SectionCard>
    </div>
  );
};

export default AdminCategories;
