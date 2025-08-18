import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Play, ArrowRight, MessageSquare, Send, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const navigate = useNavigate();
  const { setTestUser } = useAuth();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAdminAccess = () => {
    setTestUser('admin');
    navigate('/dashboard');
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
        setShowFeedback(false);
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
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          {/* Admin Dashboard */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-xl mb-6 mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Admin Dashboard
            </h3>
            <button
              onClick={handleAdminAccess}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-600 hover:to-teal-700 hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Access Admin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>

          {/* Client Dashboard */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl mb-6 mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Client Dashboard
            </h3>
            <button
              onClick={handleClientAccess}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Access Client</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>

          {/* Demo Flow */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl mb-6 mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Demo Flow
            </h3>
            <button
              onClick={() => navigate('/demo/onboard')}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-700 hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 animate-bounce"
        title="Submit UI Feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">UI Feedback</h3>
              <button
                onClick={() => setShowFeedback(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 hover:scale-110 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-700">
                  <Send className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h4>
                <p className="text-gray-600">Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Please share your thoughts on the user interface, design, or any suggestions for improvement.
                </p>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback here..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none transition-colors"
                />
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:scale-105 font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={submitting || !feedback.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-600 hover:to-teal-700 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}