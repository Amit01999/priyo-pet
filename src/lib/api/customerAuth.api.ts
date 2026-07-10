import { customerApi } from './customerClient';
import type { ApiSuccess } from './client';
import { setCustomerAccessToken } from './customerAuthToken';
import type { CustomerUser } from './types';

interface AuthResponseData {
  customer: CustomerUser;
  accessToken: string;
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<CustomerUser> {
  const res = await customerApi.post<ApiSuccess<AuthResponseData>>('/customer/auth/register', input);
  setCustomerAccessToken(res.data.data.accessToken);
  return res.data.data.customer;
}

export async function login(email: string, password: string): Promise<CustomerUser> {
  const res = await customerApi.post<ApiSuccess<AuthResponseData>>('/customer/auth/login', { email, password });
  setCustomerAccessToken(res.data.data.accessToken);
  return res.data.data.customer;
}

export async function silentRefresh(): Promise<CustomerUser | null> {
  try {
    const res = await customerApi.post<ApiSuccess<AuthResponseData>>('/customer/auth/refresh');
    setCustomerAccessToken(res.data.data.accessToken);
    return res.data.data.customer;
  } catch {
    setCustomerAccessToken(null);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await customerApi.post('/customer/auth/logout');
  } finally {
    setCustomerAccessToken(null);
  }
}

export async function updateProfile(updates: {
  name?: string;
  phone?: string;
  address?: string;
  district?: string;
}): Promise<CustomerUser> {
  const res = await customerApi.patch<ApiSuccess<{ customer: CustomerUser }>>('/customer/auth/profile', updates);
  return res.data.data.customer;
}
