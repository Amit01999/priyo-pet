import { Schema, model, Types } from 'mongoose';

const slotBlockSchema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    date: { type: String, required: true },
    slotNumber: { type: Number, required: true, min: 1 },
    reason: { type: String, trim: true, default: '' },
    blockedByAdminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true }
);

// A block's existence *is* the block — unblocking is deleting this row.
slotBlockSchema.index({ campaignId: 1, date: 1, slotNumber: 1 }, { unique: true });

export interface SlotBlockDoc {
  _id: Types.ObjectId;
  campaignId: Types.ObjectId;
  date: string;
  slotNumber: number;
  reason: string;
  blockedByAdminId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const SlotBlock = model('SlotBlock', slotBlockSchema);
