import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AdminDashboard } from '../components/AdminDashboard';
import { ClientDashboard } from '../components/ClientDashboard';
import { ClientSettingsTab } from '../components/client/ClientSettingsTab';
import { Layout } from '../components/Layout';

export function DashboardPage() {
  const { profile, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug logging
  console.log('DashboardPage render:', {
    loading,
    profile: profile ? { id: profile.id, role: profile.role, name: profile.name } : null,
    user: user ? { id: user.id, email: user.email } : null,
    pathname: location.pathname
  });

  useEffect(() => {
    if (!loading && !profile) {
      console.log('No profile found, redirecting to auth');
      navigate('/auth');
    }
  }, [profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-red-600">No profile found, redirecting...</span>
      </div>
    );
  }

  return (
    <Layout>
      {profile?.role === 'admin' ? (
        <AdminDashboard />
      ) : profile?.role === 'client' && location.pathname === '/client/settings' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ClientSettingsTab />
        </div>
      ) : (
        <ClientDashboard />
      )}
    </Layout>
  );
}