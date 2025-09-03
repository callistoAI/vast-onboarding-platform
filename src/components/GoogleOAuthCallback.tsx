import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function GoogleOAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setError(`OAuth error: ${error}`);
          setIsLoading(false);
          return;
        }

        if (!code) {
          setError('No authorization code received from Google');
          setIsLoading(false);
          return;
        }

        // Check if client ID is configured
        const clientId = import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId || clientId.trim() === '') {
          setError('Google OAuth is not properly configured. Please contact your administrator.');
          setIsLoading(false);
          return;
        }

        // Exchange code for access token
        const response = await fetch('/api/auth/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            code,
            redirect_uri: `${window.location.origin}/oauth/google/callback`
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const data = await response.json();
        
        // Store the access token or handle authentication
        if (data.access_token) {
          // You can store this in localStorage or your auth state
          localStorage.setItem('google_access_token', data.access_token);
          
          // Redirect to admin dashboard
          navigate('/admin/dashboard');
        } else {
          throw new Error('No access token received');
        }

      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing Google authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Failed</h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Return to Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
