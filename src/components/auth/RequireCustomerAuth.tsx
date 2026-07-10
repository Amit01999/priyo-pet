import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

const RequireCustomerAuth = () => {
  const { customer, isLoading } = useCustomerAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EFFDF0]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a3d1a]" />
      </div>
    );
  }

  if (!customer) {
    return <Navigate to="/account/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireCustomerAuth;
