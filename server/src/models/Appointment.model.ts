import { Schema, model, Types } from 'mongoose';
import {
  ANIMAL_TYPES,
  GENDERS,
  AGE_BUCKETS,
  HEALTH_STATUSES,
  HEAR_ABOUT_OPTIONS,
  BOOKING_STATUS,
  APPOINTMENT_SOURCE,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
} from '../config/constants.js';

const appointmentSchema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },

    // --- Google Form fields, verbatim order ---
    guardianName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    alternateMobileNumber: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    petName: { type: String, required: true, trim: true },
    animalType: { type: [String], enum: ANIMAL_TYPES, required: true },
    breed: { type: String, trim: true },
    gender: { type: String, enum: GENDERS, required: true },
    age: { type: String, enum: AGE_BUCKETS, required: true },
    weight: { type: String, required: true, trim: true },
    colorMarkings: { type: String, required: true, trim: true },
    previousVaccinationInfo: { type: String, required: true, trim: true },
    currentHealthStatus: { type: String, enum: HEALTH_STATUSES, required: true },
    hearAboutCampaign: { type: String, enum: HEAR_ABOUT_OPTIONS, required: true },

    // --- consent (added beyond the source form, see plan deviation #1) ---
    consentAcknowledged: { type: Boolean, required: true },
    consentTextVersion: { type: Number, required: true, default: 1 },

    // --- scheduling (slot picker is added beyond the source form, see plan deviation #2) ---
    appointmentDate: { type: String, required: true }, // "YYYY-MM-DD", Dhaka local
    appointmentTime: { type: String, required: true }, // "HH:mm" snapshot, never re-derived
    slotNumber: { type: Number, required: true, min: 1 },

    bookingStatus: { type: String, enum: BOOKING_STATUS, default: 'Pending' },
    notes: { type: String, trim: true, default: '' },
    source: { type: String, enum: APPOINTMENT_SOURCE, default: 'public' },

    /** true unless bookingStatus === 'Cancelled'. Kept in lockstep in the same update call —
     *  partial-filter indexes can't express `$ne`, only equality, so this is the workaround. */
    isActive: { type: Boolean, default: true },

    // --- bKash payment verification (added beyond the source form) ---
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true, default: 'bKash' },
    paymentAmount: { type: Number, required: true }, // server-stamped constant, never client-suppliable
    paymentReference: { type: String, required: true, trim: true },
    /** User's attestation that they sent the money — same audit-trail role as consentAcknowledged. */
    paymentConfirmedByUser: { type: Boolean, required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUS, default: 'Pending Verification' },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    verifiedAt: { type: Date },
    paymentRejectionReason: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevents overbooking: only one active appointment can hold a given slot on a given day.
appointmentSchema.index(
  { campaignId: 1, appointmentDate: 1, slotNumber: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

// Prevents duplicate submissions for the same pet by the same guardian (case-insensitive on petName).
appointmentSchema.index(
  { campaignId: 1, mobileNumber: 1, petName: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
    collation: { locale: 'en', strength: 2 },
  }
);

// Prevents payment-reference reuse: a real bKash transaction id colliding across two active
// bookings in the same campaign is almost always reuse/error, so this hard-blocks it (409),
// same mechanism as the two indexes above. `paymentReference: { $exists: true }` is required
// in the filter (not just `isActive: true`) because this field was added after appointments
// already existed in production — older documents don't have it at all, and without this
// extra condition Mongo treats every one of those missing values as an equal `null`, which
// collides under a unique index the moment there's more than one.
appointmentSchema.index(
  { campaignId: 1, paymentReference: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true, paymentReference: { $exists: true } },
    collation: { locale: 'en', strength: 2 },
  }
);

appointmentSchema.index({ campaignId: 1, appointmentDate: 1 });
appointmentSchema.index({ campaignId: 1, bookingStatus: 1 });
appointmentSchema.index({ campaignId: 1, paymentStatus: 1 });
appointmentSchema.index({ guardianName: 'text', petName: 'text', mobileNumber: 'text' });

export interface AppointmentDoc {
  _id: Types.ObjectId;
  campaignId: Types.ObjectId;
  guardianName: string;
  mobileNumber: string;
  alternateMobileNumber?: string;
  email: string;
  petName: string;
  animalType: string[];
  breed?: string;
  gender: string;
  age: string;
  weight: string;
  colorMarkings: string;
  previousVaccinationInfo: string;
  currentHealthStatus: string;
  hearAboutCampaign: string;
  consentAcknowledged: boolean;
  consentTextVersion: number;
  appointmentDate: string;
  appointmentTime: string;
  slotNumber: number;
  bookingStatus: string;
  notes: string;
  source: string;
  isActive: boolean;
  paymentMethod: string;
  paymentAmount: number;
  paymentReference: string;
  paymentConfirmedByUser: boolean;
  paymentStatus: string;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  paymentRejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Appointment = model('Appointment', appointmentSchema);
