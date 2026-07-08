import { api, type ApiSuccess } from './client';
import type { Appointment, BookingStatus, PageResult } from './types';

export interface ListAppointmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: BookingStatus;
  date?: string;
  sortBy?: 'createdAt' | 'appointmentDate' | 'guardianName' | 'bookingStatus';
  sortOrder?: 'asc' | 'desc';
}

export async function listAppointments(
  slug: string,
  params: ListAppointmentsParams
): Promise<PageResult<Appointment>> {
  const res = await api.get<ApiSuccess<PageResult<Appointment>>>(`/admin/campaigns/${slug}/appointments`, {
    params,
  });
  return res.data.data;
}

export async function getAppointment(slug: string, id: string): Promise<Appointment> {
  const res = await api.get<ApiSuccess<Appointment>>(`/admin/campaigns/${slug}/appointments/${id}`);
  return res.data.data;
}

export async function updateAppointmentStatus(
  slug: string,
  id: string,
  bookingStatus: BookingStatus
): Promise<Appointment> {
  const res = await api.patch<ApiSuccess<Appointment>>(`/admin/campaigns/${slug}/appointments/${id}/status`, {
    bookingStatus,
  });
  return res.data.data;
}

export async function updateAppointmentNotes(slug: string, id: string, notes: string): Promise<Appointment> {
  const res = await api.patch<ApiSuccess<Appointment>>(`/admin/campaigns/${slug}/appointments/${id}/notes`, {
    notes,
  });
  return res.data.data;
}

export async function deleteAppointment(slug: string, id: string): Promise<void> {
  await api.delete(`/admin/campaigns/${slug}/appointments/${id}`);
}

export async function exportAppointmentsUrl(
  slug: string,
  format: 'csv' | 'xlsx',
  filters: { status?: BookingStatus; date?: string } = {}
): Promise<Blob> {
  const res = await api.get(`/admin/campaigns/${slug}/appointments/export`, {
    params: { format, ...filters },
    responseType: 'blob',
  });
  return res.data as Blob;
}
