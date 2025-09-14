export const handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get environment variables
    const clientId = process.env.VITE_NEXT_PUBLIC_META_APP_ID;
    const clientSecret = process.env.META_APP_SECRET;
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      path: event.path,
      environment: {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        clientIdValue: clientId ? clientId.substring(0, 10) + '...' : 'undefined',
        clientSecretValue: clientSecret ? 'present (hidden)' : 'undefined'
      },
      allMetaEnvVars: Object.keys(process.env).filter(key => key.includes('META')),
      test: {
        canProceed: !!(clientId && clientSecret),
        error: !clientId ? 'Missing META_APP_ID' : !clientSecret ? 'Missing META_APP_SECRET' : null
      }
    };

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(debugInfo, null, 2)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Debug function error',
        message: error.message,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  }
};
