import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { validateCallbackParams, getRedirectUri } from '../lib/googleOAuth';

export function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        // Validate callback parameters for admin flow
        const validation = validateCallbackParams(code, error, state, 'admin');
        if (!validation.isValid) {
          setErrorMessage(validation.error || 'Invalid callback parameters');
          setStatus('error');
          return;
        }

        // Verify state parameter matches what we stored
        const storedState = sessionStorage.getItem('google_oauth_state');
        if (!storedState || storedState !== state) {
          setErrorMessage('State parameter mismatch - possible CSRF attack');
          setStatus('error');
          return;
        }

        // Clear stored state
        sessionStorage.removeItem('google_oauth_state');

        // Get the correct redirect URI for admin flow
        const redirectUri = getRedirectUri('admin');
        console.log(`Google OAuth Admin: Using redirect URI: ${redirectUri}`);

        // TODO: Replace with your actual backend API endpoint
        // For now, we'll simulate the token exchange
        const mockTokenData = {
          access_token: 'mock_access_token_' + Math.random().toString(36).substr(2, 9),
          refresh_token: 'mock_refresh_token_' + Math.random().toString(36).substr(2, 9),
          expires_in: 3600,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        };

        // In production, replace this with:
        // const tokenResponse = await fetch('/api/google/oauth/admin/token', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ 
        //     code, 
        //     redirect_uri: redirectUri,
        //     state 
        //   }),
        // });
        // const tokenData = await tokenResponse.json();

        const tokenData = mockTokenData;

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!userInfoResponse.ok) {
          throw new Error('Failed to get user info from Google');
        }

        const userInfo = await userInfoResponse.json();

        // Store the admin connection in the database
        const { error: dbError } = await supabase
          .from('platform_connections')
          .upsert({
            platform: 'google',
            status: 'connected',
            scopes: tokenData.scope?.split(' ') || [],
            token_data: {
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token,
              expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
              user_info: {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
              },
            },
            // Note: admin_id will be set by your backend based on the authenticated user
            admin_id: 'temp-admin-id', // This should come from your backend
          });

        if (dbError) throw dbError;

        setStatus('success');
        
        // Redirect back to admin settings after 2 seconds
        setTimeout(() => {
          navigate('/dashboard?tab=settings');
        }, 2000);

      } catch (error) {
        console.error('Admin OAuth callback error:', error);
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        setStatus('error');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting to Google</h2>
          <p className="text-gray-600">Please wait while we complete your connection...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Failed</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate('/dashboard?tab=settings')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Successfully Connected!</h2>
        <p className="text-gray-600 mb-6">Your Google account has been connected successfully.</p>
        <p className="text-sm text-gray-500">Redirecting you back to the dashboard...</p>
      </div>
    </div>
  );
}
