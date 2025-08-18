import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // For testing - allow access without authentication
  // if (!user) {
  //   return <Navigate to="/auth" replace />;
  // }

  // For testing - allow admin access without role check
  // if (adminOnly && profile?.role !== 'admin') {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return <>{children}</>;
}