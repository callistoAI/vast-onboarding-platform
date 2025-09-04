// Using built-in fetch (available in Node.js 18+)

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  // Handle GET requests for testing
  if (event.httpMethod === 'GET') {
    const clientId = process.env.VITE_NEXT_PUBLIC_META_APP_ID;
    const clientSecret = process.env.META_APP_SECRET;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Meta token exchange function is working',
        timestamp: new Date().toISOString(),
        environment: {
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret,
          clientIdValue: clientId ? clientId.substring(0, 10) + '...' : 'undefined'
        },
        usage: 'Send POST request with { "code": "...", "redirectUri": "..." }'
      }, null, 2)
    };
  }

  // Only allow POST requests for actual token exchange
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed. Use GET for testing or POST for token exchange.' })
    };
  }

  try {
    const { code, redirectUri } = JSON.parse(event.body);

    if (!code || !redirectUri) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required parameters: code and redirectUri' })
      };
    }

    // Get environment variables
    const clientId = process.env.VITE_NEXT_PUBLIC_META_APP_ID;
    const clientSecret = process.env.META_APP_SECRET;

    console.log('Meta token exchange request:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      redirectUri,
      code: code.substring(0, 10) + '...'
    });

    if (!clientId || !clientSecret) {
      console.error('Missing environment variables:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret
      });
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Meta OAuth not properly configured',
          debug: {
            hasClientId: !!clientId,
            hasClientSecret: !!clientSecret
          }
        })
      };
    }

    // Exchange code for access token
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

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return {
        statusCode: tokenResponse.status,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Token exchange failed',
          details: errorText 
        })
      };
    }

    const tokenData = await tokenResponse.json();
    console.log('Token exchange successful:', {
      hasAccessToken: !!tokenData.access_token,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(tokenData)
    };

  } catch (error) {
    console.error('Meta token exchange error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};