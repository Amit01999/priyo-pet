import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import * as adminShopApi from '@/lib/api/adminShop.api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { Category, Product } from '@/lib/api/types';

const variantSchema = z.object({
  label: z.string().trim().min(1, 'Variant label is required'),
  priceRegular: z.coerce.number().min(0),
  priceDiscounted: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
});

const productFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Product name is required'),
    description: z.string().trim().optional(),
    categoryId: z.string().optional(),
    imagesText: z.string().trim().optional(),
    hasVariants: z.boolean(),
    priceRegular: z.coerce.number().min(0).optional(),
    priceDiscounted: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    variants: z.array(variantSchema),
    isEnabled: z.boolean(),
  })
  .refine((v) => v.hasVariants || (v.priceRegular !== undefined && v.priceDiscounted !== undefined), {
    message: 'Regular and discounted price are required',
    path: ['priceRegular'],
  })
  .refine((v) => !v.hasVariants || v.variants.length > 0, {
    message: 'At least one variant is required',
    path: ['variants'],
  });
type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
}

const fieldInputClass = 'h-10 rounded-xl border-[#1a3d1a]/15';

const ProductFormDialog = ({ open, onOpenChange, product, categories }: ProductFormDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: undefined,
      imagesText: '',
      hasVariants: false,
      priceRegular: undefined,
      priceDiscounted: undefined,
      stock: 0,
      variants: [],
      isEnabled: true,
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'variants' });

  useEffect(() => {
    if (open) {
      form.reset({
        name: product?.name ?? '',
        description: product?.description ?? '',
        categoryId: product?.categoryId,
        imagesText: product?.images.join('\n') ?? '',
        hasVariants: product?.hasVariants ?? false,
        priceRegular: product?.priceRegular,
        priceDiscounted: product?.priceDiscounted,
        stock: product?.stock ?? 0,
        variants: product?.variants.map((v) => ({
          label: v.label,
          priceRegular: v.priceRegular,
          priceDiscounted: v.priceDiscounted,
          stock: v.stock,
        })) ?? [],
        isEnabled: product?.isEnabled ?? true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  const hasVariants = form.watch('hasVariants');

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) => {
      const images = (values.imagesText ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        images,
        hasVariants: values.hasVariants,
        priceRegular: values.priceRegular,
        priceDiscounted: values.priceDiscounted,
        stock: values.stock,
        variants: values.variants.map((v) => ({
          label: v.label,
          priceRegular: v.priceRegular,
          priceDiscounted: v.priceDiscounted,
          stock: v.stock,
        })),
        isEnabled: values.isEnabled,
      };
      return product ? adminShopApi.updateProduct(product._id, payload) : adminShopApi.createProduct(payload);
    },
    onSuccess: () => {
      toast.success(product ? 'Product updated' : 'Product created');
      queryClient.invalidateQueries({ queryKey: ['admin-shop-products'] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not save product')),
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[24px] border-[#1a3d1a]/[0.06]">
        <DialogHeader>
          <DialogTitle className="font-poppins text-[#1a3d1a]">{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/70">Product Name</FormLabel>
                  <FormControl>
                    <Input className={fieldInputClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/70">Description</FormLabel>
                  <FormControl>
                    <Textarea className="rounded-xl border-[#1a3d1a]/15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/70">Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className={fieldInputClass}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imagesText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1a3d1a]/70">Image URLs (one per line)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="https://..." className="min-h-[80px] rounded-xl border-[#1a3d1a]/15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasVariants"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0 bg-[#F7FFF8] rounded-xl px-3 py-2.5">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
                  </FormControl>
                  <FormLabel className="!mt-0 text-[#1a3d1a]/80">This product has variants (e.g. sizes)</FormLabel>
                </FormItem>
              )}
            />

            {!hasVariants ? (
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="priceRegular"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1a3d1a]/70">Regular Price</FormLabel>
                      <FormControl>
                        <Input type="number" className={fieldInputClass} {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceDiscounted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1a3d1a]/70">Discounted Price</FormLabel>
                      <FormControl>
                        <Input type="number" className={fieldInputClass} {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1a3d1a]/70">Stock</FormLabel>
                      <FormControl>
                        <Input type="number" className={fieldInputClass} {...field} value={field.value ?? 0} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <FormLabel className="text-[#1a3d1a]/70">Variants</FormLabel>
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end bg-[#F7FFF8] rounded-xl p-3"
                  >
                    <FormField
                      control={form.control}
                      name={`variants.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-[#1a3d1a]/60">Label</FormLabel>
                          <FormControl>
                            <Input placeholder="Size 6" className="h-9 rounded-lg border-[#1a3d1a]/15 bg-white" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.priceRegular`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-[#1a3d1a]/60">Regular</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-9 rounded-lg border-[#1a3d1a]/15 bg-white" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.priceDiscounted`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-[#1a3d1a]/60">Discounted</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-9 rounded-lg border-[#1a3d1a]/15 bg-white" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-[#1a3d1a]/60">Stock</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-9 rounded-lg border-[#1a3d1a]/15 bg-white" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-red-50 rounded-full"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-full border-[#1a3d1a]/15 text-[#1a3d1a] hover:bg-[#1a3d1a]/5"
                  onClick={() => append({ label: '', priceRegular: 0, priceDiscounted: 0, stock: 0 })}
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Variant
                </Button>
              </div>
            )}

            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0 bg-[#F7FFF8] rounded-xl px-3 py-2.5">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
                  </FormControl>
                  <FormLabel className="!mt-0 text-[#1a3d1a]/80">Visible on the storefront (enabled)</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full shadow-sm transition-all duration-300 hover:scale-[1.02]"
              >
                {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Product
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
