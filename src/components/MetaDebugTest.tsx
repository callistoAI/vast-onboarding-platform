import { useState } from 'react';

export default function MetaDebugTest() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const runDebugTest = () => {
    const clientId = import.meta.env.VITE_NEXT_PUBLIC_META_APP_ID;
    const clientSecret = import.meta.env.VITE_META_APP_SECRET;
    const redirectUri = `${window.location.origin}/oauth/meta/callback`;
    
    const info = {
      timestamp: new Date().toISOString(),
      environment: {
        clientId: clientId ? clientId.substring(0, 10) + '...' : 'undefined',
        hasClientSecret: !!clientSecret,
        clientSecretValue: clientSecret ? clientSecret.substring(0, 10) + '...' : 'undefined',
        redirectUri: redirectUri,
        origin: window.location.origin,
        allMetaEnvVars: Object.keys(import.meta.env).filter(key => key.includes('META'))
      },
      metaOAuthUrl: `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=business_management,ads_read,pages_show_list,pages_read_engagement&state=test`
    };
    
    setDebugInfo(info);
    console.log('Meta Debug Info:', info);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Meta OAuth Debug Test</h2>
      
      <button
        onClick={runDebugTest}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Run Debug Test
      </button>

      {debugInfo && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Debug Information:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Test OAuth URL:</h4>
            <a 
              href={debugInfo.metaOAuthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {debugInfo.metaOAuthUrl}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
