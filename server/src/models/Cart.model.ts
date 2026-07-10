import { Schema, model, Types } from 'mongoose';

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: Schema.Types.ObjectId, default: null },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export interface CartItem {
  productId: Types.ObjectId;
  variantId: Types.ObjectId | null;
  quantity: number;
}

export interface CartDoc {
  _id: Types.ObjectId;
  customerId: Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export const Cart = model('Cart', cartSchema);
