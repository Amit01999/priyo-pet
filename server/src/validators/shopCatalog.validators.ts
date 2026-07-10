import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
  slug: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional(),
});
export const updateCategorySchema = createCategorySchema.partial();

const variantInputSchema = z.object({
  label: z.string().trim().min(1, 'Variant label is required'),
  priceRegular: z.coerce.number().min(0),
  priceDiscounted: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
});

export const createProductSchema = z
  .object({
    name: z.string().trim().min(1, 'Product name is required'),
    slug: z.string().trim().min(1).optional(),
    description: z.string().trim().max(4000).optional(),
    categoryId: z.string().trim().min(1).optional(),
    images: z.array(z.string().trim().min(1)).default([]),
    hasVariants: z.boolean().default(false),
    priceRegular: z.coerce.number().min(0).optional(),
    priceDiscounted: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    variants: z.array(variantInputSchema).default([]),
    isEnabled: z.boolean().default(true),
  })
  .refine((v) => v.hasVariants || (v.priceRegular !== undefined && v.priceDiscounted !== undefined), {
    message: 'priceRegular and priceDiscounted are required for a product without variants',
    path: ['priceRegular'],
  })
  .refine((v) => !v.hasVariants || v.variants.length > 0, {
    message: 'At least one variant is required when hasVariants is true',
    path: ['variants'],
  });
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  name: z.string().trim().min(1).optional(),
  slug: z.string().trim().min(1).optional(),
  description: z.string().trim().max(4000).optional(),
  categoryId: z.string().trim().min(1).nullable().optional(),
  images: z.array(z.string().trim().min(1)).optional(),
  hasVariants: z.boolean().optional(),
  priceRegular: z.coerce.number().min(0).optional(),
  priceDiscounted: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  variants: z.array(variantInputSchema).optional(),
  isEnabled: z.boolean().optional(),
});
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  categorySlug: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStockOnly: z.coerce.boolean().optional(),
});
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

export const adminListProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
});
