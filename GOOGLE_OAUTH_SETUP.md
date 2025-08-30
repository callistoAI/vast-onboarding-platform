# Google OAuth Setup Guide

## Environment Variables Required

Create a `.env` file in your project root with the following variables:

```bash
# Google OAuth Configuration
# This should be your Google OAuth 2.0 Client ID from Google Cloud Console
VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Server-side Google OAuth Secret (keep this secure, not exposed to browser)
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

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
   - `http://localhost:5173/oauth/google/callback` (for admin flow)
   - `http://localhost:5173/oauth/google/client/callback` (for client flow)
   - Add your production URLs when deploying

## How It Works

### Admin Google Connect Flow
1. Admin clicks "Connect" button in Settings tab
2. `buildAdminGoogleOAuthUrl()` is called
3. User is redirected to Google OAuth consent screen
4. After authorization, Google redirects to `/oauth/google/callback`
5. `GoogleOAuthCallback` component handles the response
6. Admin is redirected to admin dashboard

### Client Google Connect Flow
1. Client clicks "Connect Google Account" in onboarding flow
2. `buildClientGoogleOAuthUrl(onboardingToken)` is called
3. User is redirected to Google OAuth consent screen
4. After authorization, Google redirects to `/oauth/google/client/callback`
5. `ClientGoogleOAuthCallback` component handles the response
6. Client sees access requests to approve/reject

## Current Implementation Status

✅ **Frontend Components**: All OAuth callback components are implemented
✅ **OAuth URL Building**: Functions to build Google OAuth URLs are implemented
✅ **Error Handling**: Proper error handling for missing client ID
✅ **Console Logging**: Debug logging for client ID and redirect URI
✅ **Routing**: OAuth callback routes are configured in App.tsx
✅ **UI Components**: Connect buttons are implemented in both admin and client flows

## Next Steps

1. **Backend API Endpoints**: Implement the following endpoints:
   - `/api/auth/google/callback` - Exchange code for access token (admin)
   - `/api/auth/google/client/callback` - Exchange code for access token (client)
   - `/api/access-requests/:id/approve` - Approve access request
   - `/api/access-requests/:id/reject` - Reject access request

2. **Database Integration**: Connect the OAuth flow to your database to store:
   - Access tokens
   - User information
   - Platform connections
   - Access request statuses

3. **Token Refresh**: Implement token refresh logic for expired access tokens

4. **Security**: Add proper validation and security measures to the OAuth flow

## Testing

1. Set up your environment variables
2. Start the development server
3. Test admin flow: Go to admin settings and click "Connect" for Google
4. Test client flow: Go to demo onboarding and click "Connect Google Account"

The console will log the client ID and redirect URI for debugging purposes.
