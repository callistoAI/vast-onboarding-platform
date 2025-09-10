import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Play, ArrowRight, MessageSquare, Send, X, MessageCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const navigate = useNavigate();
  const { setTestUser } = useAuth();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAdminAccess = () => {
    console.log('Admin button clicked, setting test user to admin');
    setTestUser('admin');
    console.log('Navigating to dashboard');
    console.log('Current location before navigate:', window.location.href);
    navigate('/dashboard');
    console.log('Navigate called, should redirect to dashboard');
  };

  const handleClientAccess = () => {
    setTestUser('client');
    navigate('/dashboard');
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;
    
    setSubmitting(true);
    try {
      // In a real implementation, this would save to a feedback table
      // For now, we'll just simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFeedback('');
      setTimeout(() => {
        setSubmitted(false);
        setShowFeedbackModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
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
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm hidden">
                <span className="text-white font-bold">V</span>
              </div>
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-xl mb-6 mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Admin Dashboard
            </h3>
            <button
              onClick={handleAdminAccess}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-6 rounded-lg font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Access Admin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Client Dashboard */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-16 h-16 bg-sky-500 rounded-xl mb-6 mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Client Dashboard
            </h3>
            <button
              onClick={handleClientAccess}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 px-6 rounded-lg font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Access Client</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Demo Flow */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-xl mb-6 mx-auto">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Demo Flow
            </h3>
            <button
              onClick={() => navigate('/demo/onboard')}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Button */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-200/50">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Send Feedback</h3>
              <p className="text-gray-600">Help us improve the platform</p>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or report issues..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 resize-none"
            />
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="flex-1 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
              >
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}