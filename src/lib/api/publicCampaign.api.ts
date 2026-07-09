import { api, type ApiSuccess } from './client';
import type { PublicCampaign, SlotsForDateResult } from './types';

export async function fetchCampaign(slug: string): Promise<PublicCampaign> {
  const res = await api.get<ApiSuccess<PublicCampaign>>(`/public/campaigns/${slug}`);
  return res.data.data;
}

export async function fetchSlotsForDate(slug: string, date: string): Promise<SlotsForDateResult> {
  const res = await api.get<ApiSuccess<SlotsForDateResult>>(`/public/campaigns/${slug}/slots`, {
    params: { date },
  });
  return res.data.data;
}

export interface SubmitAppointmentPayload {
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
  appointmentDate: string;
  hearAboutCampaign: string;
  slotNumber: number;
  consentAcknowledged: true;
  paymentReference: string;
  paymentConfirmedByUser: true;
}

export interface SubmitAppointmentResult {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  slotNumber: number;
  bookingStatus: string;
}

export async function submitAppointment(
  slug: string,
  payload: SubmitAppointmentPayload
): Promise<SubmitAppointmentResult> {
  const res = await api.post<ApiSuccess<SubmitAppointmentResult>>(
    `/public/campaigns/${slug}/appointments`,
    payload
  );
  return res.data.data;
}
