// Meta OAuth Configuration and Utilities
import { getEnabledMetaScopes } from './metaAccessRequests';

// Get scopes from enabled access request options
export const META_OAUTH_SCOPES = getEnabledMetaScopes();

// Build Meta OAuth URL for admin flow
export function buildAdminMetaOAuthUrl(): string {
  const clientId = import.meta.env.VITE_NEXT_PUBLIC_META_APP_ID;
  const redirectUri = `${window.location.origin}/oauth/meta/callback`;
  
  if (!clientId || clientId.trim() === '') {
    throw new Error('Meta App ID not configured. Please set VITE_NEXT_PUBLIC_META_APP_ID environment variable.');
  }
  
  // Debug logging (non-sensitive)
  console.log('Meta OAuth Admin Flow:', { 
    clientId: clientId.substring(0, 10) + '...', 
    redirectUri,
    scopes: META_OAUTH_SCOPES
  });
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: META_OAUTH_SCOPES.join(','),
    state: 'admin_flow'
  });

  return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;
}

// Build Meta OAuth URL for client flow
export function buildClientMetaOAuthUrl(onboardingToken: string): string {
  const clientId = import.meta.env.VITE_NEXT_PUBLIC_META_APP_ID;
  const redirectUri = `${window.location.origin}/oauth/meta/client/callback`;
  
  if (!clientId || clientId.trim() === '') {
    throw new Error('Meta App ID not configured. Please set VITE_NEXT_PUBLIC_META_APP_ID environment variable.');
  }
  
  // Debug logging (non-sensitive)
  console.log('Meta OAuth Client Flow:', { 
    clientId: clientId.substring(0, 10) + '...', 
    redirectUri, 
    onboardingToken,
    scopes: META_OAUTH_SCOPES
  });
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: META_OAUTH_SCOPES.join(','),
    state: onboardingToken
  });

  return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;
}
