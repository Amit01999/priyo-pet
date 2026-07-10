import { Schema, model, Types } from 'mongoose';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../config/constants.js';

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    variantLabel: { type: String, default: null },
    unitPriceRegular: { type: Number, required: true },
    unitPriceDiscounted: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const statusHistoryEntrySchema = new Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, required: true, default: Date.now },
    changedBy: { type: String, default: 'system' },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },

    items: { type: [orderItemSchema], required: true },

    shippingName: { type: String, required: true, trim: true },
    shippingPhone: { type: String, required: true, trim: true },
    shippingAddress: { type: String, required: true, trim: true },
    shippingDistrict: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, default: '' },

    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    total: { type: Number, required: true },

    orderStatus: { type: String, enum: ORDER_STATUS, default: 'Pending' },

    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true, default: 'bKash' },
    paymentAmount: { type: Number, required: true }, // snapshot of `total` at order time
    paymentReference: { type: String, required: true, trim: true },
    paymentConfirmedByUser: { type: Boolean, required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUS, default: 'Pending Verification' },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    verifiedAt: { type: Date },
    paymentRejectionReason: { type: String, trim: true },

    statusHistory: { type: [statusHistoryEntrySchema], default: [] },

    /** true unless orderStatus === 'Cancelled' — same isActive/partial-index workaround used
     *  by Appointment, so a cancelled order's paymentReference can be reused. */
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

orderSchema.index(
  { paymentReference: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true, paymentReference: { $exists: true } },
    collation: { locale: 'en', strength: 2 },
  }
);
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

export interface OrderItemSnapshot {
  productId: Types.ObjectId;
  name: string;
  image: string;
  variantLabel: string | null;
  unitPriceRegular: number;
  unitPriceDiscounted: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderStatusHistoryEntry {
  status: string;
  at: Date;
  changedBy: string;
}

export interface OrderDoc {
  _id: Types.ObjectId;
  orderNumber: string;
  customerId: Types.ObjectId;
  items: OrderItemSnapshot[];
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingDistrict: string;
  notes: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  orderStatus: string;
  paymentMethod: string;
  paymentAmount: number;
  paymentReference: string;
  paymentConfirmedByUser: boolean;
  paymentStatus: string;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  paymentRejectionReason?: string;
  statusHistory: OrderStatusHistoryEntry[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const Order = model('Order', orderSchema);
