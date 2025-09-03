import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface AccessRequest {
  id: string;
  platform: string;
  requestedScopes: string[];
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ClientGoogleOAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state'); // onboardingToken

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

        if (!state) {
          setError('No onboarding token received');
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
            redirect_uri: `${window.location.origin}/oauth/google/client/callback`,
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
          
          // Find the client by onboarding token
          const { data: onboardingLink, error: linkError } = await supabase
            .from('onboarding_links')
            .select('*')
            .eq('link_token', state)
            .single();

          if (linkError || !onboardingLink) {
            throw new Error('Invalid onboarding token');
          }

          // Save authorization to database
          const { error: authError } = await supabase
            .from('authorizations')
            .upsert({
              client_id: onboardingLink.used_by || onboardingLink.created_by,
              platform: 'google',
              status: 'authorized',
              scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/adwords', 'https://www.googleapis.com/auth/analytics.readonly'],
              token_data: {
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                user_id: userData.id,
                user_name: userData.name,
                user_email: userData.email,
                expires_in: tokenData.expires_in,
                token_type: tokenData.token_type
              }
            }, {
              onConflict: 'client_id,platform'
            });

          if (authError) {
            console.error('Database error:', authError);
            throw new Error('Failed to save authorization to database');
          }
          
          // Fetch access requests for this client
          await fetchAccessRequests(state);
        } else {
          throw new Error('No access token received');
        }

      } catch (err) {
        console.error('Client OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  const fetchAccessRequests = async (onboardingToken: string) => {
    try {
      // Find the onboarding link to get the client ID
      const { data: onboardingLink, error: linkError } = await supabase
        .from('onboarding_links')
        .select('*')
        .eq('link_token', onboardingToken)
        .single();

      if (linkError || !onboardingLink) {
        throw new Error('Invalid onboarding token');
      }

      // Fetch authorizations for this client
      const { data: authorizations, error: authError } = await supabase
        .from('authorizations')
        .select('*')
        .eq('client_id', onboardingLink.used_by || onboardingLink.created_by)
        .eq('platform', 'google');

      if (authError) {
        throw new Error('Failed to fetch authorizations');
      }

      // Convert to AccessRequest format
      const accessRequests: AccessRequest[] = authorizations.map(auth => ({
        id: auth.id,
        platform: 'Google Business',
        requestedScopes: auth.scopes || [],
        requestedAt: auth.created_at,
        status: auth.status as 'pending' | 'approved' | 'rejected'
      }));
      
      setAccessRequests(accessRequests);
    } catch (err) {
      console.error('Failed to fetch access requests:', err);
      setError('Failed to load access requests');
    }
  };

  const handleAccessRequest = async (requestId: string, approved: boolean) => {
    setIsProcessing(true);
    try {
      // Update the authorization status in the database
      const { error: updateError } = await supabase
        .from('authorizations')
        .update({ 
          status: approved ? 'authorized' : 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) {
        throw new Error('Failed to update authorization status');
      }

      // Update local state
      setAccessRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: approved ? 'approved' : 'rejected' }
            : req
        )
      );

      // Show success message
      setTimeout(() => {
        // Redirect to completion page or show success message
        navigate('/onboarding/complete');
      }, 2000);

    } catch (err) {
      console.error('Failed to process access request:', err);
      setError('Failed to process access request');
    } finally {
      setIsProcessing(false);
    }
  };

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
              onClick={() => navigate('/')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Access Request Review
          </h1>
          <p className="text-lg text-gray-600">
            Please review and approve the access requests below to complete your onboarding.
          </p>
        </div>

        <div className="space-y-6">
          {accessRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{request.platform}</h3>
                  <p className="text-sm text-gray-500">
                    Requested on {new Date(request.requestedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  request.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : request.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Requested Permissions:</h4>
                <div className="space-y-2">
                  {request.requestedScopes.map((scope, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {scope}
                    </div>
                  ))}
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAccessRequest(request.id, true)}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? 'Processing...' : 'Approve Access'}
                  </button>
                  <button
                    onClick={() => handleAccessRequest(request.id, false)}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? 'Processing...' : 'Reject Access'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {accessRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Access Requests</h3>
            <p className="text-gray-500">There are no pending access requests to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
