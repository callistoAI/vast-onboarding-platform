// Google OAuth Configuration and Utilities
export const GOOGLE_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

// Build Google OAuth URL for admin flow
export function buildAdminGoogleOAuthUrl(): string {
  const clientId = import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/oauth/google/callback`;
  
  if (!clientId || clientId.trim() === '') {
    throw new Error('Google Client ID not configured. Please set VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.');
  }
  
  // Debug logging (non-sensitive)
  console.log('Google OAuth Admin Flow:', { 
    clientId: clientId.substring(0, 10) + '...', 
    redirectUri 
  });
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_OAUTH_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Build Google OAuth URL for client flow
export function buildClientGoogleOAuthUrl(onboardingToken: string): string {
  const clientId = import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/oauth/google/client/callback`;
  
  if (!clientId || clientId.trim() === '') {
    throw new Error('Google Client ID not configured. Please set VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.');
  }
  
  // Debug logging (non-sensitive)
  console.log('Google OAuth Client Flow:', { 
    clientId: clientId.substring(0, 10) + '...', 
    redirectUri, 
    onboardingToken 
  });
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_OAUTH_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: onboardingToken
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
