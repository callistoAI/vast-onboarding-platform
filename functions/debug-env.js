exports.handler = async (event, context) => {
  // Log all environment variables for debugging
  const allEnvVars = Object.keys(process.env).sort();
  const metaEnvVars = allEnvVars.filter(key => 
    key.includes('META') || key.includes('GOOGLE') || key.includes('OAUTH')
  );
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    allEnvVars: allEnvVars,
    metaEnvVars: metaEnvVars,
    specificVars: {
      META_APP_ID: process.env.META_APP_ID ? 'present' : 'missing',
      VITE_NEXT_PUBLIC_META_APP_ID: process.env.VITE_NEXT_PUBLIC_META_APP_ID ? 'present' : 'missing',
      META_APP_SECRET: process.env.META_APP_SECRET ? 'present' : 'missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'present' : 'missing',
      VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'present' : 'missing'
    },
    values: {
      META_APP_ID: process.env.META_APP_ID ? process.env.META_APP_ID.substring(0, 10) + '...' : 'undefined',
      META_APP_SECRET: process.env.META_APP_SECRET ? 'present (hidden)' : 'undefined'
    }
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(debugInfo, null, 2)
  };
};
