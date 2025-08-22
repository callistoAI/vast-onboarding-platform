// Google OAuth Configuration and Utilities
export const GOOGLE_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUriAdmin: string;
  redirectUriClient: string;
  redirectUriAdminLocal: string;
  redirectUriClientLocal: string;
}

export interface GoogleOAuthFlow {
  type: 'admin' | 'client';
  redirectUri: string;
  state?: string;
}

// Validate environment variables
export function validateGoogleOAuthEnv(): GoogleOAuthConfig {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
  const redirectUriAdmin = import.meta.env.VITE_GOOGLE_REDIRECT_URI_ADMIN;
  const redirectUriClient = import.meta.env.VITE_GOOGLE_REDIRECT_URI_CLIENT;
  const redirectUriAdminLocal = import.meta.env.VITE_GOOGLE_REDIRECT_URI_ADMIN_LOCAL;
  const redirectUriClientLocal = import.meta.env.VITE_GOOGLE_REDIRECT_URI_CLIENT_LOCAL;

  const errors: string[] = [];

  if (!clientId) errors.push('VITE_GOOGLE_CLIENT_ID is missing');
  if (!clientSecret) errors.push('VITE_GOOGLE_CLIENT_SECRET is missing');
  if (!redirectUriAdmin) errors.push('VITE_GOOGLE_REDIRECT_URI_ADMIN is missing');
  if (!redirectUriClient) errors.push('VITE_GOOGLE_REDIRECT_URI_CLIENT is missing');
  if (!redirectUriAdminLocal) errors.push('VITE_GOOGLE_REDIRECT_URI_ADMIN_LOCAL is missing');
  if (!redirectUriClientLocal) errors.push('VITE_GOOGLE_REDIRECT_URI_CLIENT_LOCAL is missing');

  if (errors.length > 0) {
    throw new Error(`Google OAuth configuration errors:\n${errors.join('\n')}`);
  }

  return {
    clientId,
    clientSecret,
    redirectUriAdmin,
    redirectUriClient,
    redirectUriAdminLocal,
    redirectUriClientLocal
  };
}

// Build Google OAuth URL
export function buildGoogleOAuthUrl(flow: GoogleOAuthFlow): string {
  try {
    const config = validateGoogleOAuthEnv();
    
    // Log which redirect is being used (non-sensitive info)
    console.log(`Google OAuth: Building ${flow.type} flow URL with redirect: ${flow.redirectUri}`);
    
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: flow.redirectUri,
      response_type: 'code',
      scope: GOOGLE_OAUTH_SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    });

    if (flow.state) {
      params.append('state', flow.state);
    }

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  } catch (error) {
    console.error('Failed to build Google OAuth URL:', error);
    throw error;
  }
}

// Get redirect URI for flow type, automatically detecting environment
export function getRedirectUri(flowType: 'admin' | 'client'): string {
  const config = validateGoogleOAuthEnv();
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocal) {
    return flowType === 'admin' ? config.redirectUriAdminLocal : config.redirectUriClientLocal;
  } else {
    return flowType === 'admin' ? config.redirectUriAdmin : config.redirectUriClient;
  }
}

// Validate callback parameters
export function validateCallbackParams(
  code: string | null, 
  error: string | null, 
  state: string | null,
  expectedFlowType: 'admin' | 'client'
): { isValid: boolean; error?: string } {
  if (error) {
    return { isValid: false, error: `OAuth error: ${error}` };
  }

  if (!code) {
    return { isValid: false, error: 'No authorization code received' };
  }

  if (!state) {
    return { isValid: false, error: 'No state parameter received' };
  }

  // For admin flow, state should contain flow type
  // For client flow, state should contain onboarding token
  if (expectedFlowType === 'admin' && !state.includes('admin')) {
    return { isValid: false, error: 'Invalid state parameter for admin flow' };
  }

  if (expectedFlowType === 'client' && !state.includes('client')) {
    return { isValid: false, error: 'Invalid state parameter for client flow' };
  }

  return { isValid: true };
}

// Generate state parameter for flow
export function generateState(flowType: 'admin' | 'client', additionalData?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const flowIdentifier = flowType === 'admin' ? 'admin' : 'client';
  
  if (additionalData) {
    return `${flowIdentifier}_${timestamp}_${random}_${additionalData}`;
  }
  
  return `${flowIdentifier}_${timestamp}_${random}`;
}
