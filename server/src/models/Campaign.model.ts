import { Schema, model, Types } from 'mongoose';
import { DAY_STATUS } from '../config/constants.js';

const campaignSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true },
    sponsor: { type: String, required: true },
    organizer: { type: String, required: true },
    venue: { type: String, required: true },
    venueMapQuery: { type: String, required: true },

    /** "YYYY-MM-DD" (Dhaka local calendar dates) the campaign runs on. */
    dates: { type: [String], required: true, validate: (v: string[]) => v.length > 0 },

    /** "HH:mm" in Dhaka local time — the first slot of each day starts here. */
    dailyStartTime: { type: String, required: true },
    slotDurationMinutes: { type: Number, required: true, min: 1 },
    maxSlotsPerDay: { type: Number, required: true, min: 1 },

    /** date -> 'open' | 'closed'. Missing entries default to 'open'. */
    dayStatus: { type: Map, of: String, enum: DAY_STATUS, default: {} },

    /** Whole-campaign booking window, independent of per-day open/closed. */
    registrationOpensAt: { type: Date, required: true },
    registrationClosesAt: { type: Date, required: true },

    /** Locked once any active appointment exists for this campaign (see appointment.service). */
    slotDurationLocked: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export interface CampaignDoc {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  sponsor: string;
  organizer: string;
  venue: string;
  venueMapQuery: string;
  dates: string[];
  dailyStartTime: string;
  slotDurationMinutes: number;
  maxSlotsPerDay: number;
  dayStatus: Map<string, string>;
  registrationOpensAt: Date;
  registrationClosesAt: Date;
  slotDurationLocked: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const Campaign = model('Campaign', campaignSchema);
