import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function MetaOAuthCallback() {
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
        const state = searchParams.get('state');

        if (error) {
          setError(`Meta OAuth error: ${error}`);
          setIsLoading(false);
          return;
        }

        if (!code) {
          setError('No authorization code received from Meta');
          setIsLoading(false);
          return;
        }

        // Check if client ID is configured
        const clientId = import.meta.env.VITE_NEXT_PUBLIC_META_APP_ID;
        if (!clientId || clientId.trim() === '') {
          setError('Meta OAuth is not properly configured. Please contact your administrator.');
          setIsLoading(false);
          return;
        }

        // Exchange code for access token using Meta's token endpoint
        const clientSecret = import.meta.env.META_APP_SECRET;
        const redirectUri = `${window.location.origin}/oauth/meta/callback`;
        
        console.log('Meta OAuth Token Exchange:', {
          clientId: clientId.substring(0, 10) + '...',
          hasClientSecret: !!clientSecret,
          redirectUri,
          code: code.substring(0, 10) + '...'
        });

        const tokenResponse = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code: code
          }),
        });

        console.log('Token response status:', tokenResponse.status);
        console.log('Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('Token exchange error:', errorText);
          throw new Error(`Failed to exchange code for token: ${tokenResponse.status} - ${errorText}`);
        }

        const tokenData = await tokenResponse.json();
        console.log('Token data received:', { 
          hasAccessToken: !!tokenData.access_token,
          tokenType: tokenData.token_type,
          expiresIn: tokenData.expires_in
        });
        
        if (tokenData.access_token) {
          // Get user info from Meta
          const userResponse = await fetch(`https://graph.facebook.com/v21.0/me?access_token=${tokenData.access_token}&fields=id,name,email`);
          const userData = await userResponse.json();
          
          console.log('User data received:', { 
            hasUserId: !!userData.id,
            userName: userData.name,
            userEmail: userData.email
          });
          
          // Save connection to database
          if (user?.id) {
            console.log('Saving connection for user:', user.id);
            const { error: dbError } = await supabase
              .from('platform_connections')
              .upsert({
                platform: 'meta',
                status: 'connected',
                connection_data: {
                  access_token: tokenData.access_token,
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

            console.log('Database save result:', { error: dbError });

            if (dbError) {
              console.error('Database error:', dbError);
              throw new Error('Failed to save connection to database');
            }
          } else {
            console.warn('No authenticated user found, cannot save connection');
            // Still redirect to admin dashboard even if we can't save the connection
          }
          
          // Redirect to admin dashboard
          navigate('/admin/dashboard');
        } else {
          throw new Error('No access token received');
        }

      } catch (err) {
        console.error('Meta OAuth callback error:', err);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing Meta authentication...</p>
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
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
