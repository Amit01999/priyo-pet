import { Schema, model, Types } from 'mongoose';

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    address: { type: String, trim: true, default: '' },
    district: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export interface CustomerDoc {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  address: string;
  district: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const Customer = model('Customer', customerSchema);
