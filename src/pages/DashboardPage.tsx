import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AdminDashboard } from '../components/AdminDashboard';
import { ClientDashboard } from '../components/ClientDashboard';
import { Layout } from '../components/Layout';

export function DashboardPage() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profile) {
      navigate('/auth');
    }
  }, [profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Layout>
      {profile?.role === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
    </Layout>
  );
}