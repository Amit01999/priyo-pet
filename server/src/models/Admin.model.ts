import { Schema, model, type InferSchemaType } from 'mongoose';
import { ADMIN_ROLES } from '../config/constants.js';

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ADMIN_ROLES, default: 'admin' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type AdminDoc = InferSchemaType<typeof adminSchema>;
export const Admin = model('Admin', adminSchema);
