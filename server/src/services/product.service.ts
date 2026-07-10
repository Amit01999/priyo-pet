import { Types } from 'mongoose';
import { Product, type ProductDoc } from '../models/Product.model.js';
import { Category } from '../models/Category.model.js';
import { NotFound, Conflict } from '../errors/httpErrors.js';
import { ERROR_CODES } from '../config/constants.js';
import { buildPageResult, type PageResult } from '../utils/pagination.js';
import { slugify } from '../utils/slug.js';
import type {
  CreateProductInput,
  UpdateProductInput,
  ListProductsQuery,
} from '../validators/shopCatalog.validators.js';

export async function listProducts(query: ListProductsQuery): Promise<PageResult<ProductDoc>> {
  const filter: Record<string, unknown> = { isEnabled: true };

  if (query.categorySlug) {
    const category = await Category.findOne({ slug: query.categorySlug }).lean();
    filter.categoryId = category ? category._id : new Types.ObjectId(); // no matches if slug unknown
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const range: Record<string, number> = {};
    if (query.minPrice !== undefined) range.$gte = query.minPrice;
    if (query.maxPrice !== undefined) range.$lte = query.maxPrice;
    filter.$or = [{ priceDiscounted: range }, { 'variants.priceDiscounted': range }];
  }

  if (query.inStockOnly) {
    filter.$or = [
      ...((filter.$or as unknown[]) ?? []),
      { hasVariants: false, stock: { $gt: 0 } },
      { hasVariants: true, 'variants.stock': { $gt: 0 } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [data, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean<ProductDoc[]>(),
    Product.countDocuments(filter),
  ]);

  return buildPageResult(data, total, query.page, query.limit);
}

export async function getProductBySlug(slug: string): Promise<ProductDoc> {
  const product = await Product.findOne({ slug, isEnabled: true }).lean<ProductDoc>();
  if (!product) throw NotFound('Product not found');
  return product;
}

export async function getRelatedProducts(product: ProductDoc, limit = 4): Promise<ProductDoc[]> {
  const filter: Record<string, unknown> = { isEnabled: true, _id: { $ne: product._id } };
  if (product.categoryId) filter.categoryId = product.categoryId;
  return Product.find(filter).limit(limit).lean<ProductDoc[]>();
}

// --- Admin ---

export async function listProductsAdmin(query: {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
}): Promise<PageResult<ProductDoc>> {
  const filter: Record<string, unknown> = {};
  if (query.categoryId) filter.categoryId = query.categoryId;
  if (query.search) filter.$text = { $search: query.search };

  const skip = (query.page - 1) * query.limit;
  const [data, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean<ProductDoc[]>(),
    Product.countDocuments(filter),
  ]);
  return buildPageResult(data, total, query.page, query.limit);
}

export async function getProductByIdAdmin(id: string): Promise<ProductDoc> {
  const product = await Product.findById(id).lean<ProductDoc>();
  if (!product) throw NotFound('Product not found');
  return product;
}

export async function createProduct(input: CreateProductInput): Promise<ProductDoc> {
  const slug = input.slug ? slugify(input.slug) : slugify(input.name);
  const product = await Product.create({ ...input, slug });
  return product.toObject() as unknown as ProductDoc;
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<ProductDoc> {
  const patch: Record<string, unknown> = { ...input };
  if (input.slug) patch.slug = slugify(input.slug);
  const product = await Product.findByIdAndUpdate(id, { $set: patch }, { new: true }).lean<ProductDoc>();
  if (!product) throw NotFound('Product not found');
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const result = await Product.findByIdAndDelete(id);
  if (!result) throw NotFound('Product not found');
}

// --- Pricing/stock helpers shared by cart + order services ---

export interface ResolvedPricing {
  label: string | null;
  priceRegular: number;
  priceDiscounted: number;
  stock: number;
  variantId: Types.ObjectId | null;
}

export function resolvePricing(product: ProductDoc, variantId?: string | null): ResolvedPricing {
  if (product.hasVariants) {
    if (!variantId) throw Conflict('Please select a variant for this product', ERROR_CODES.VALIDATION_ERROR);
    const variant = product.variants.find((v) => String(v._id) === String(variantId));
    if (!variant) throw NotFound('Selected variant no longer exists');
    return {
      label: variant.label,
      priceRegular: variant.priceRegular,
      priceDiscounted: variant.priceDiscounted,
      stock: variant.stock,
      variantId: variant._id,
    };
  }
  return {
    label: null,
    priceRegular: product.priceRegular ?? 0,
    priceDiscounted: product.priceDiscounted ?? 0,
    stock: product.stock ?? 0,
    variantId: null,
  };
}

/** Atomically decrements stock only if enough is available — mirrors the same
 *  "guarded conditional update" philosophy used for slot-claiming in the booking system,
 *  so two simultaneous checkouts can never oversell the last unit. */
export async function decrementStock(
  productId: Types.ObjectId,
  variantId: Types.ObjectId | null,
  quantity: number
): Promise<void> {
  if (variantId) {
    const result = await Product.findOneAndUpdate(
      { _id: productId, 'variants._id': variantId, 'variants.stock': { $gte: quantity } },
      { $inc: { 'variants.$.stock': -quantity } }
    );
    if (!result) throw Conflict('This variant just went out of stock', ERROR_CODES.OUT_OF_STOCK);
    return;
  }
  const result = await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } }
  );
  if (!result) throw Conflict('This product just went out of stock', ERROR_CODES.OUT_OF_STOCK);
}

/** Reverses decrementStock — used when a payment is rejected or an order is cancelled. */
export async function restoreStock(
  productId: Types.ObjectId,
  variantId: Types.ObjectId | null,
  quantity: number
): Promise<void> {
  if (variantId) {
    await Product.updateOne(
      { _id: productId, 'variants._id': variantId },
      { $inc: { 'variants.$.stock': quantity } }
    );
    return;
  }
  await Product.updateOne({ _id: productId }, { $inc: { stock: quantity } });
}
