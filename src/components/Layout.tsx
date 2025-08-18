import React, { ReactNode } from 'react';
import { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      <Header />
      <main className="transition-all duration-300">
        {children}
      </main>
      
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