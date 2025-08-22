import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DemoOnboardPage } from './pages/DemoOnboardPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GoogleOAuthCallback } from './components/GoogleOAuthCallback';
import { ClientGoogleOAuthCallback } from './components/ClientGoogleOAuthCallback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/demo/onboard" element={<DemoOnboardPage />} />
            <Route path="/oauth/google/callback" element={<GoogleOAuthCallback />} />
            <Route path="/oauth/google/client/callback" element={<ClientGoogleOAuthCallback />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute adminOnly>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/clients" 
              element={
                <ProtectedRoute adminOnly>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/customisation" 
              element={
                <ProtectedRoute adminOnly>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/client/settings" 
              element={
                <ProtectedRoute clientOnly>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;