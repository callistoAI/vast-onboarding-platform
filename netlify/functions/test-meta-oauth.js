exports.handler = async (event, context) => {
  try {
    // Test environment variables
    const clientId = process.env.META_APP_ID || process.env.VITE_NEXT_PUBLIC_META_APP_ID;
    const clientSecret = process.env.META_APP_SECRET;
    
    const testResult = {
      timestamp: new Date().toISOString(),
      environment: {
        META_APP_ID: !!process.env.META_APP_ID,
        VITE_NEXT_PUBLIC_META_APP_ID: !!process.env.VITE_NEXT_PUBLIC_META_APP_ID,
        META_APP_SECRET: !!process.env.META_APP_SECRET,
        resolvedClientId: !!clientId,
        resolvedClientSecret: !!clientSecret
      },
      values: {
        clientId: clientId ? clientId.substring(0, 10) + '...' : 'undefined',
        clientSecret: clientSecret ? 'present' : 'undefined'
      },
      test: {
        canProceed: !!(clientId && clientSecret),
        error: !clientId ? 'Missing client ID' : !clientSecret ? 'Missing client secret' : null
      }
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(testResult, null, 2)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Test function error',
        message: error.message,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  }
};
