import { Schema, model, Types } from 'mongoose';

const refreshTokenSchema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    userAgent: { type: String },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Self-cleaning: MongoDB drops the document once expiresAt is in the past.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export interface RefreshTokenDoc {
  _id: Types.ObjectId;
  adminId: Types.ObjectId;
  tokenHash: string;
  userAgent?: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export const RefreshToken = model('RefreshToken', refreshTokenSchema);
