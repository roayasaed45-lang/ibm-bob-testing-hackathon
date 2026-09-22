import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

interface RequireCustomerAuthProps {
  children: ReactNode;
}

// Web keeps working exactly as it does today — guest booking/lookup on the
// marketing site is untouched. Only the native Capacitor app requires a
// customer session before entering the existing app screens.
const RequireCustomerAuth = ({ children }: RequireCustomerAuthProps) => {
  const isNativeApp = Capacitor.isNativePlatform();
  const { session, profile, loading } = useCustomerAuth();

  if (!isNativeApp) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // An authenticated Supabase session (e.g. an admin account) is not enough
  // on its own — a real customer profile row must also exist. Admin sessions
  // are never signed out here; they simply aren't valid customer sessions.
  if (!session || !profile) {
    return <Navigate to="/customer-login" replace />;
  }

  return <>{children}</>;
};

export default RequireCustomerAuth;
