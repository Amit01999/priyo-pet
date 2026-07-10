import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getCustomerAccessToken, setCustomerAccessToken } from './customerAuthToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

// Separate axios instance from the admin `api` client (./client.ts) — distinct auth domain,
// distinct refresh endpoint/cookie, so the two sessions can never cross-contaminate.
export const customerApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

customerApi.interceptors.request.use((config) => {
  const token = getCustomerAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

let refreshInFlight: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  try {
    const res = await axios.post<{ data: { accessToken: string } }>(
      `${API_BASE_URL}/customer/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const token = res.data.data.accessToken;
    setCustomerAccessToken(token);
    return token;
  } catch {
    setCustomerAccessToken(null);
    return null;
  }
}

customerApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const isAuthEndpoint = config?.url?.includes('/customer/auth/');

    if (error.response?.status === 401 && config && !config._retried && !isAuthEndpoint) {
      config._retried = true;
      refreshInFlight ??= performRefresh().finally(() => {
        refreshInFlight = null;
      });
      const newToken = await refreshInFlight;
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        return customerApi(config);
      }
    }

    return Promise.reject(error);
  }
);
