import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Play, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const navigate = useNavigate();
  const { setTestUser } = useAuth();

  const handleAdminAccess = () => {
    setTestUser('admin');
    navigate('/dashboard');
  };

  const handleClientAccess = () => {
    setTestUser('client');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/vast-logo.png" 
                alt="Vast Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-sm hidden">
                <span className="text-white font-bold">V</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Vast Onboarding</h1>
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to Vast Onboarding
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-4">
            This is a demo version using dummy data for UI review purposes only.
          </p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Please use the feedback button in the bottom right corner to submit any UI feedback or suggestions.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Admin Dashboard */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Admin Dashboard
            </h3>
            <button
              onClick={handleAdminAccess}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <span>Access Admin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Client Dashboard */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Client Dashboard
            </h3>
            <button
              onClick={handleClientAccess}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <span>Access Client</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Demo Flow */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Demo Flow
            </h3>
            <button
              onClick={() => navigate('/demo/onboard')}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}