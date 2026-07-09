export type AnimalType = 'dog' | 'cat' | 'other';
export type Gender = 'male' | 'female';
export type AgeBucket = 'lt_3m' | 'm3_6' | 'm6_12' | 'y1_3' | 'gt_3y';
export type HealthStatus = 'healthy' | 'sick' | 'pregnant' | 'nursing' | 'under_treatment' | 'other';
export type HearAboutOption =
  | 'facebook'
  | 'priyopet_khulna'
  | 'jci_dhaka_north'
  | 'friend_relative'
  | 'vet_doctor'
  | 'other';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
export type SlotStatus = 'available' | 'booked' | 'blocked' | 'past';
export type PaymentStatus = 'Pending Verification' | 'Verified' | 'Rejected';

export interface PublicCampaign {
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
  dayStatus: Record<string, 'open' | 'closed'>;
  registrationOpensAt: string;
  registrationClosesAt: string;
  paymentInfo: {
    method: 'bKash';
    bkashNumber: string;
    amountBdt: number;
  };
}

export interface SlotView {
  slotNumber: number;
  startTime: string;
  status: SlotStatus;
  blockReason?: string;
}

export interface SlotsForDateResult {
  date: string;
  total: number;
  remaining: number;
  slots: SlotView[];
}

export interface Appointment {
  _id: string;
  campaignId: string;
  guardianName: string;
  mobileNumber: string;
  alternateMobileNumber?: string;
  email: string;
  petName: string;
  animalType: AnimalType[];
  breed?: string;
  gender: Gender;
  age: AgeBucket;
  weight: string;
  colorMarkings: string;
  previousVaccinationInfo: string;
  currentHealthStatus: HealthStatus;
  hearAboutCampaign: HearAboutOption;
  consentAcknowledged: boolean;
  appointmentDate: string;
  appointmentTime: string;
  slotNumber: number;
  bookingStatus: BookingStatus;
  notes: string;
  source: 'public' | 'admin-walkin';
  paymentMethod: 'bKash';
  paymentAmount: number;
  paymentReference: string;
  paymentConfirmedByUser: boolean;
  paymentStatus: PaymentStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  paymentRejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalApplications: number;
  byStatus: Record<BookingStatus, number>;
  byPaymentStatus: Record<PaymentStatus, number>;
  todaysAppointments: number;
  today: string;
  dayBreakdown: { date: string; capacity: number; booked: number; blocked: number; remaining: number }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}
