import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function GoogleOAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

        // Exchange code for access token using Google's token endpoint
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: import.meta.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${window.location.origin}/oauth/google/callback`,
            grant_type: 'authorization_code',
            code: code
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();
        
        if (tokenData.access_token) {
          // Get user info from Google
          const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
          const userData = await userResponse.json();
          
          // Save connection to database
          if (user?.id) {
            const { error: dbError } = await supabase
              .from('platform_connections')
              .upsert({
                platform: 'google',
                status: 'connected',
                connection_data: {
                  access_token: tokenData.access_token,
                  refresh_token: tokenData.refresh_token,
                  user_id: userData.id,
                  user_name: userData.name,
                  user_email: userData.email,
                  expires_in: tokenData.expires_in,
                  token_type: tokenData.token_type
                },
                connected_by: user.id
              }, {
                onConflict: 'platform,connected_by'
              });

            if (dbError) {
              console.error('Database error:', dbError);
              throw new Error('Failed to save connection to database');
            }
          }
          
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
