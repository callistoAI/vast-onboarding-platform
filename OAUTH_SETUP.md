# OAuth Setup Guide

This document outlines the setup process for Google and Meta OAuth integration in the Vast Onboarding Platform.

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```bash
# Google OAuth Configuration
# This should be your Google OAuth 2.0 Client ID from Google Cloud Console
VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Server-side Google OAuth Secret (keep this secure, not exposed to browser)
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Meta OAuth Configuration
# This should be your Meta App ID from Facebook Developer Console
VITE_NEXT_PUBLIC_META_APP_ID=1705757330127767

# Server-side Meta App Secret (keep this secure, not exposed to browser)
META_APP_SECRET=f9d4b19f16381c81196c39e47eb9f86d

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and any other APIs you need
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen
6. Create a Web application client ID
7. Add the following redirect URIs:
   - `https://vast-onboarding.netlify.app/oauth/google/callback` (for admin flow)
   - `https://vast-onboarding.netlify.app/oauth/google/client/callback` (for client flow)
   - `http://localhost:5173/oauth/google/callback` (for local development)
   - `http://localhost:5173/oauth/google/client/callback` (for local development)

## Meta Developer Console Setup

1. Go to [Facebook Developer Console](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add "Facebook Login" product to your app
4. Configure Facebook Login settings
5. Add the following redirect URIs:
   - `https://vast-onboarding.netlify.app/oauth/meta/callback` (for admin flow)
   - `https://vast-onboarding.netlify.app/oauth/meta/client/callback` (for client flow)
   - `http://localhost:5173/oauth/meta/callback` (for local development)
   - `http://localhost:5173/oauth/meta/client/callback` (for local development)

## How It Works

### Admin OAuth Connect Flow
1. Admin clicks "Connect" button in Settings tab for Google or Meta
2. `buildAdminGoogleOAuthUrl()` or `buildAdminMetaOAuthUrl()` is called
3. User is redirected to OAuth consent screen
4. After authorization, platform redirects to respective callback URL
5. OAuth callback component handles the response
6. Admin is redirected to admin dashboard

### Client OAuth Connect Flow
1. Client clicks "Connect" button in onboarding flow for Google or Meta
2. `buildClientGoogleOAuthUrl(onboardingToken)` or `buildClientMetaOAuthUrl(onboardingToken)` is called
3. User is redirected to OAuth consent screen
4. After authorization, platform redirects to respective callback URL
5. OAuth callback component handles the response
6. Client sees access requests to approve/reject

## Current Implementation Status

✅ **Frontend Components**: All OAuth callback components are implemented for both Google and Meta
✅ **OAuth URL Building**: Functions to build OAuth URLs are implemented for both platforms
✅ **Error Handling**: Proper error handling for missing client IDs
✅ **Console Logging**: Debug logging for client IDs and redirect URIs
✅ **Routing**: OAuth callback routes are configured in App.tsx
✅ **UI Components**: Connect buttons are implemented in both admin and client flows
✅ **OAuth Scopes**: Updated with proper API scopes for business accounts

## OAuth Scopes

### Google OAuth Scopes
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`
- `https://www.googleapis.com/auth/adwords`
- `https://www.googleapis.com/auth/analytics.readonly`
- `https://www.googleapis.com/auth/tagmanager.readonly`
- `https://www.googleapis.com/auth/webmasters.readonly`
- `https://www.googleapis.com/auth/business.manage`
- `https://www.googleapis.com/auth/content`

### Meta OAuth Scopes
- `ads_read`
- `business_management`
- `pages_show_list`
- `pages_read_engagement`
- `instagram_basic`

## Next Steps

1. **Platform Console Configuration**: 
   - Add the Netlify redirect URIs to your Google OAuth client
   - Add the Netlify redirect URIs to your Meta App
   - Ensure the client IDs match your `.env.local` file

2. **Backend API Endpoints**: Implement the following endpoints:
   - `/api/auth/google/callback` - Exchange code for access token (admin)
   - `/api/auth/google/client/callback` - Exchange code for access token (client)
   - `/api/auth/meta/callback` - Exchange code for access token (admin)
   - `/api/auth/meta/client/callback` - Exchange code for access token (client)
   - `/api/access-requests/:id/approve` - Approve access request
   - `/api/access-requests/:id/reject` - Reject access request

3. **Database Integration**: Connect the OAuth flow to your database to store:
   - Access tokens
   - User information
   - Platform connections
   - Access request statuses

4. **Token Refresh**: Implement token refresh logic for expired access tokens

5. **Security**: Add proper validation and security measures to the OAuth flow

## Testing

1. Set up your environment variables
2. Configure Google Cloud Console with correct redirect URIs
3. Configure Meta Developer Console with correct redirect URIs
4. Start the development server
5. Test admin flow: Go to admin settings and click "Connect" for Google or Meta
6. Test client flow: Go to demo onboarding and click "Connect" for Google or Meta

The console will log the client IDs, redirect URIs, and scopes for debugging purposes.

## Troubleshooting

If you get "Failed to connect" errors:

1. **Check Environment Variables**: Ensure `VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `VITE_NEXT_PUBLIC_META_APP_ID` are set
2. **Check Redirect URIs**: Verify the redirect URIs in platform consoles match your deployment
3. **Check Console Logs**: Look for the OAuth URLs being generated
4. **Check Network Tab**: Look for any failed requests to OAuth endpoints
