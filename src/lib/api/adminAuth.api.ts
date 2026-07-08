import { api, type ApiSuccess } from './client';
import { setAccessToken } from './authToken';
import type { AdminUser } from './types';

interface AuthResponseData {
  admin: AdminUser;
  accessToken: string;
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await api.post<ApiSuccess<AuthResponseData>>('/admin/auth/login', { email, password });
  setAccessToken(res.data.data.accessToken);
  return res.data.data.admin;
}

export async function silentRefresh(): Promise<AdminUser | null> {
  try {
    const res = await api.post<ApiSuccess<AuthResponseData>>('/admin/auth/refresh');
    setAccessToken(res.data.data.accessToken);
    return res.data.data.admin;
  } catch {
    setAccessToken(null);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/admin/auth/logout');
  } finally {
    setAccessToken(null);
  }
}

export async function fetchMe(): Promise<AdminUser> {
  const res = await api.get<ApiSuccess<{ admin: AdminUser }>>('/admin/auth/me');
  return res.data.data.admin;
}
