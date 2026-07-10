import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as customerAuthApi from '@/lib/api/customerAuth.api';
import type { CustomerUser } from '@/lib/api/types';

interface CustomerAuthContextValue {
  customer: CustomerUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: (updates: { name?: string; phone?: string; address?: string; district?: string }) => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    customerAuthApi.silentRefresh().then((restored) => {
      if (!cancelled) {
        setCustomer(restored);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    const loggedIn = await customerAuthApi.login(email, password);
    setCustomer(loggedIn);
  }

  async function register(input: { name: string; email: string; password: string; phone?: string }) {
    const created = await customerAuthApi.register(input);
    setCustomer(created);
  }

  async function logout() {
    await customerAuthApi.logout();
    setCustomer(null);
  }

  async function refreshProfile(updates: { name?: string; phone?: string; address?: string; district?: string }) {
    const updated = await customerAuthApi.updateProfile(updates);
    setCustomer(updated);
  }

  return (
    <CustomerAuthContext.Provider value={{ customer, isLoading, login, register, logout, refreshProfile }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth(): CustomerAuthContextValue {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
}
