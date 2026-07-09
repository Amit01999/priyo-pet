import { z } from 'zod';

const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

function normalizeBdPhone(raw: string): string {
  const trimmed = raw.trim().replace(/[\s-]/g, '');
  if (trimmed.startsWith('+880')) return `0${trimmed.slice(4)}`;
  if (trimmed.startsWith('880')) return `0${trimmed.slice(3)}`;
  return trimmed;
}

const bdPhone = z
  .string()
  .trim()
  .min(1, 'মোবাইল নম্বর আবশ্যক')
  .transform(normalizeBdPhone)
  .refine((v) => BD_PHONE_REGEX.test(v), 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)');

const optionalBdPhone = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? normalizeBdPhone(v) : v))
  .refine((v) => !v || BD_PHONE_REGEX.test(v), 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন');

export const ANIMAL_TYPE_OPTIONS = [
  { value: 'dog', label: 'কুকুর' },
  { value: 'cat', label: 'বিড়াল' },
  { value: 'other', label: 'অন্যান্য' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: 'পুরুষ' },
  { value: 'female', label: 'স্ত্রী' },
] as const;

export const AGE_OPTIONS = [
  { value: 'lt_3m', label: '৩ মাসের কম' },
  { value: 'm3_6', label: '৩–৬ মাস' },
  { value: 'm6_12', label: '৬–১২ মাস' },
  { value: 'y1_3', label: '১–৩ বছর' },
  { value: 'gt_3y', label: '৩ বছরের বেশি' },
] as const;

export const HEALTH_STATUS_OPTIONS = [
  { value: 'healthy', label: 'সম্পূর্ণ সুস্থ' },
  { value: 'sick', label: 'অসুস্থ' },
  { value: 'pregnant', label: 'গর্ভবতী' },
  { value: 'nursing', label: 'বাচ্চাকে দুধ খাওয়াচ্ছে' },
  { value: 'under_treatment', label: 'চিকিৎসাধীন / ওষুধ গ্রহণ করছে' },
  { value: 'other', label: 'অন্যান্য' },
] as const;

export const HEAR_ABOUT_OPTIONS = [
  { value: 'facebook', label: 'ফেসবুক' },
  { value: 'priyopet_khulna', label: 'PriyoPet Khulna' },
  { value: 'jci_dhaka_north', label: 'JCI Dhaka North' },
  { value: 'friend_relative', label: 'বন্ধু / আত্মীয়' },
  { value: 'vet_doctor', label: 'ভেটেরিনারি ডাক্তার' },
  { value: 'other', label: 'অন্যান্য' },
] as const;

const animalTypeValues = ANIMAL_TYPE_OPTIONS.map((o) => o.value) as [string, ...string[]];
const genderValues = GENDER_OPTIONS.map((o) => o.value) as [string, ...string[]];
const ageValues = AGE_OPTIONS.map((o) => o.value) as [string, ...string[]];
const healthStatusValues = HEALTH_STATUS_OPTIONS.map((o) => o.value) as [string, ...string[]];
const hearAboutValues = HEAR_ABOUT_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const guardianInfoSchema = z.object({
  guardianName: z.string().trim().min(2, 'অভিভাবকের পূর্ণ নাম লিখুন'),
  mobileNumber: bdPhone,
  alternateMobileNumber: optionalBdPhone,
  email: z.string().trim().email('সঠিক ইমেইল ঠিকানা দিন'),
});

export const petInfoSchema = z.object({
  petName: z.string().trim().min(1, 'পোষা প্রাণীর নাম লিখুন'),
  animalType: z.array(z.enum(animalTypeValues)).min(1, 'অন্তত একটি প্রাণীর ধরন নির্বাচন করুন'),
  breed: z.string().trim().optional(),
  gender: z.enum(genderValues, { errorMap: () => ({ message: 'লিঙ্গ নির্বাচন করুন' }) }),
  age: z.enum(ageValues, { errorMap: () => ({ message: 'বয়স নির্বাচন করুন' }) }),
  weight: z.string().trim().min(1, 'আনুমানিক ওজন লিখুন'),
  colorMarkings: z.string().trim().min(1, 'রং/বিশেষ পরিচিতি লিখুন'),
});

export const healthInfoSchema = z.object({
  previousVaccinationInfo: z
    .string()
    .trim()
    .min(1, 'এই প্রশ্নের উত্তর দিন (না থাকলে "না" লিখুন)')
    .max(2000, 'উত্তরটি ২০০০ অক্ষরের মধ্যে রাখুন'),
  currentHealthStatus: z.enum(healthStatusValues, {
    errorMap: () => ({ message: 'বর্তমান স্বাস্থ্য অবস্থা নির্বাচন করুন' }),
  }),
});

export const scheduleSchema = z.object({
  appointmentDate: z.string().min(1, 'একটি দিন নির্বাচন করুন'),
  hearAboutCampaign: z.enum(hearAboutValues, {
    errorMap: () => ({ message: 'কীভাবে জেনেছেন তা নির্বাচন করুন' }),
  }),
  slotNumber: z.number({ invalid_type_error: 'একটি সময় স্লট নির্বাচন করুন' }).int().min(1, 'একটি সময় স্লট নির্বাচন করুন'),
});

export const consentSchema = z.object({
  consentAcknowledged: z.literal(true, {
    errorMap: () => ({ message: 'এগিয়ে যেতে অবশ্যই সম্মতি প্রদান করতে হবে' }),
  }),
});

export const paymentSchema = z.object({
  paymentReference: z
    .string()
    .trim()
    .min(4, 'সঠিক বিকাশ ট্রানজেকশন আইডি দিন')
    .max(40, 'ট্রানজেকশন আইডি অনেক বড়'),
  paymentConfirmedByUser: z.literal(true, {
    errorMap: () => ({ message: 'অনুগ্রহ করে পেমেন্ট নিশ্চিত করুন' }),
  }),
});

export const appointmentFormSchema = guardianInfoSchema
  .merge(petInfoSchema)
  .merge(healthInfoSchema)
  .merge(scheduleSchema)
  .merge(consentSchema)
  .merge(paymentSchema);

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export const appointmentFormDefaultValues: Partial<AppointmentFormValues> = {
  guardianName: '',
  mobileNumber: '',
  alternateMobileNumber: '',
  email: '',
  petName: '',
  animalType: [],
  breed: '',
  weight: '',
  colorMarkings: '',
  previousVaccinationInfo: '',
  appointmentDate: '',
  slotNumber: undefined,
  consentAcknowledged: undefined,
  paymentReference: '',
  paymentConfirmedByUser: undefined,
};
