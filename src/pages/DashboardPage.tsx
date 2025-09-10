import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AdminDashboard } from '../components/AdminDashboard';
import { ClientDashboard } from '../components/ClientDashboard';
import { ClientSettingsTab } from '../components/client/ClientSettingsTab';
import { Layout } from '../components/Layout';

export function DashboardPage() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug logging
  console.log('DashboardPage rendering:', {
    loading,
    profile: profile?.id,
    role: profile?.role,
    pathname: location.pathname,
    profileObject: profile
  });

  useEffect(() => {
    if (!loading && !profile) {
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

  return (
    <Layout>
      {profile?.role === 'admin' ? (
        <div>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <strong>DEBUG:</strong> About to render AdminDashboard
          </div>
          <AdminDashboard />
        </div>
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