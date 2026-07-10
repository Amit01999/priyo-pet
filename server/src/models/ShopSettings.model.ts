import { Schema, model, Types } from 'mongoose';

// Singleton collection — exactly one document ever exists (see shopSettings.service.ts).
const shopSettingsSchema = new Schema(
  {
    deliveryChargeBdt: { type: Number, required: true, default: 60 },
  },
  { timestamps: true }
);

export interface ShopSettingsDoc {
  _id: Types.ObjectId;
  deliveryChargeBdt: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ShopSettings = model('ShopSettings', shopSettingsSchema);
