import { Schema, model, Types } from 'mongoose';

const variantSchema = new Schema(
  {
    label: { type: String, required: true, trim: true }, // e.g. "Size 6"
    priceRegular: { type: Number, required: true, min: 0 },
    priceDiscounted: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: true }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, trim: true, default: '' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },

    images: { type: [String], default: [] },

    /** When true, pricing/stock live per-entry in `variants`; when false, the top-level
     *  price/stock fields apply. Keeps the common single-SKU case (no variant UI) simple
     *  while still supporting products like "Cat Collar" that need per-size pricing. */
    hasVariants: { type: Boolean, default: false },
    priceRegular: { type: Number, min: 0 },
    priceDiscounted: { type: Number, min: 0 },
    stock: { type: Number, min: 0, default: 0 },
    variants: { type: [variantSchema], default: [] },

    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ categoryId: 1 });
productSchema.index({ isEnabled: 1 });

export interface ProductVariant {
  _id: Types.ObjectId;
  label: string;
  priceRegular: number;
  priceDiscounted: number;
  stock: number;
}

export interface ProductDoc {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  categoryId?: Types.ObjectId;
  images: string[];
  hasVariants: boolean;
  priceRegular?: number;
  priceDiscounted?: number;
  stock?: number;
  variants: ProductVariant[];
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const Product = model('Product', productSchema);
