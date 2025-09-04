exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code, redirectUri } = JSON.parse(event.body);

    if (!code || !redirectUri) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters: code and redirectUri' })
      };
    }

    // Get environment variables
    const clientId = process.env.VITE_NEXT_PUBLIC_META_APP_ID;
    const clientSecret = process.env.META_APP_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing environment variables:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret
      });
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Meta OAuth not properly configured' })
      };
    }

    console.log('Meta token exchange request:', {
      clientId: clientId.substring(0, 10) + '...',
      hasClientSecret: !!clientSecret,
      redirectUri,
      code: code.substring(0, 10) + '...'
    });

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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(tokenData)
    };

  } catch (error) {
    console.error('Meta token exchange error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};
