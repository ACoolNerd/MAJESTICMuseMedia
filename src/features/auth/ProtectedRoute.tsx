import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LockKeyhole, ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { hasPermission, roleLabels, type Permission } from './permissions';

export function ProtectedRoute({
  permission,
  children,
}: {
  permission?: Permission;
  children?: ReactNode;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F8F4EC] text-[#1B1734]"><div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-[#1B1734]/10"><LockKeyhole className="mx-auto text-[#8B2C6F]"/><p className="mt-4 font-serif text-2xl">Opening the control center…</p></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (permission && !hasPermission(user.role, permission)) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F8F4EC] p-5 text-[#1B1734]"><div className="max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-[#1B1734]/10"><ShieldAlert className="mx-auto text-[#8B2C6F]" size={38}/><h1 className="mt-4 font-serif text-3xl">Permission required</h1><p className="mt-3 leading-7 text-[#1B1734]/65">Your current role, <strong>{roleLabels[user.role]}</strong>, does not include <code className="rounded bg-[#1B1734]/5 px-2 py-1 text-sm">{permission}</code>.</p><a href="/app" className="mt-6 inline-flex rounded-full bg-[#1B1734] px-5 py-3 text-sm font-semibold text-white">Return to your dashboard</a></div></div>;
  }

  return children ?? <Outlet />;
}
