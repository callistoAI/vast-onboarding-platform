// Using built-in fetch (available in Node.js 18+)

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Test environment variables
    const clientId = process.env.VITE_NEXT_PUBLIC_META_APP_ID;
    const clientSecret = process.env.META_APP_SECRET;
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        clientIdValue: clientId ? clientId.substring(0, 10) + '...' : 'undefined',
        allMetaEnvVars: Object.keys(process.env).filter(key => key.includes('META'))
      },
      test: {
        canProceed: !!(clientId && clientSecret),
        error: !clientId ? 'Missing META_APP_ID' : !clientSecret ? 'Missing META_APP_SECRET' : null
      }
    };

    // If POST request, try to simulate token exchange
    if (event.httpMethod === 'POST') {
      try {
        const { code, redirectUri } = JSON.parse(event.body);
        
        if (!code || !redirectUri) {
          return {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Missing code or redirectUri' })
          };
        }

        // Test Meta token exchange
        const tokenResponse = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code: code
          }),
        });

        const tokenData = await tokenResponse.json();
        
        debugInfo.tokenExchange = {
          status: tokenResponse.status,
          success: tokenResponse.ok,
          hasAccessToken: !!tokenData.access_token,
          error: tokenData.error || null,
          response: tokenData
        };

      } catch (tokenError) {
        debugInfo.tokenExchange = {
          error: tokenError.message,
          success: false
        };
      }
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(debugInfo, null, 2)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Debug function error',
        message: error.message,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  }
};
