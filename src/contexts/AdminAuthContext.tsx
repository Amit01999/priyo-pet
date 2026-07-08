import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as authApi from '@/lib/api/adminAuth.api';
import type { AdminUser } from '@/lib/api/types';

interface AdminAuthContextValue {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    authApi.silentRefresh().then((restoredAdmin) => {
      if (!cancelled) {
        setAdmin(restoredAdmin);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    const loggedInAdmin = await authApi.login(email, password);
    setAdmin(loggedInAdmin);
  }

  async function logout() {
    await authApi.logout();
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
