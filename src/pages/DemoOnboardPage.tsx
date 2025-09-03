import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, ExternalLink, Shield, ChevronLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { buildClientGoogleOAuthUrl } from '../lib/googleOAuth';
import { buildClientMetaOAuthUrl } from '../lib/metaOAuth';

// Helper function for Shopify admin URLs
const getShopifyAdminUrl = (storeId: string) => {
  return `https://${storeId}.myshopify.com/admin/settings/users`;
};

const platformConfigs = {
  meta: {
    name: 'Meta Business',
    color: 'purple',
    description: 'Connect your Facebook and Instagram business accounts',
    permissions: [
      'Read and manage Facebook Pages',
      'Access Instagram Business accounts',
      'Create and manage Facebook Ads',
      'View Facebook Insights and Analytics'
    ]
  },
  google: {
    name: 'Google Ads',
    color: 'indigo',
    description: 'Access Google Ads campaigns and analytics',
    permissions: [
      'View and manage Google Ads campaigns',
      'Access Google Analytics data',
      'Manage Google My Business listings',
      'View YouTube channel analytics'
    ]
  },
  tiktok: {
    name: 'TikTok Ads',
    color: 'teal',
    description: 'Manage TikTok advertising campaigns',
    permissions: [
      'Create and manage TikTok ad campaigns',
      'Access TikTok Business account data',
      'View TikTok advertising analytics',
      'Manage TikTok creative assets'
    ]
  },
  shopify: {
    name: 'Shopify',
    color: 'cyan',
    description: 'Connect your Shopify store data',
    permissions: [
      'Access Shopify store data',
      'View product and inventory information',
      'Access order and customer data',
      'Manage Shopify app integrations'
    ]
  }
};

type Step = 'intro' | 'meta' | 'google' | 'tiktok' | 'shopify' | 'complete';
type PlatformStatus = 'pending' | 'connecting' | 'connected' | 'rejected';
type PlatformPhase = 'connect' | 'permissions';

const stepOrder: Step[] = ['intro', 'meta', 'google', 'tiktok', 'shopify', 'complete'];
const platformOrder = ['meta', 'google', 'tiktok', 'shopify'];

export function DemoOnboardPage() {
  const navigate = useNavigate();
  const { setTestUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [platformStatuses, setPlatformStatuses] = useState<Record<string, PlatformStatus>>({
    meta: 'pending',
    google: 'pending',
    tiktok: 'pending',
    shopify: 'pending'
  });
  const [platformPhases, setPlatformPhases] = useState<Record<string, PlatformPhase>>({
    meta: 'connect',
    google: 'connect',
    tiktok: 'connect',
    shopify: 'connect'
  });
  const [platformPermissions, setPlatformPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Shopify-specific state
  const [shopifyStoreId, setShopifyStoreId] = useState('');
  const [shopifyCollaboratorCode, setShopifyCollaboratorCode] = useState('');
  const [shopifyStep, setShopifyStep] = useState<'store-id' | 'collaborator-code'>('store-id');

  // Get platforms that will be connected
  const getPlatformsText = () => {
    const platforms = ['Meta', 'Google', 'TikTok', 'Shopify'];
    if (platforms.length === 1) return platforms[0];
    if (platforms.length === 2) return `${platforms[0]} and ${platforms[1]}`;
    return `${platforms.slice(0, -1).join(', ')}, and ${platforms[platforms.length - 1]}`;
  };

  // Calculate progress steps
  const getProgressSteps = () => {
    const steps = [
      { id: 'meta', label: 'Meta', number: 1 },
      { id: 'google', label: 'Google', number: 2 },
      { id: 'tiktok', label: 'TikTok', number: 3 },
      { id: 'shopify', label: 'Shopify', number: 4 },
      { id: 'complete', label: 'Complete Setup', number: 5 }
    ];

    return steps.map(step => {
      if (currentStep === 'intro') {
        return { ...step, active: false, completed: false };
      }
      
      const currentIndex = stepOrder.indexOf(currentStep);
      const stepIndex = stepOrder.indexOf(step.id as Step);
      
      return {
        ...step,
        active: currentStep === step.id,
        completed: stepIndex < currentIndex
      };
    });
  };

  const handleStartDemo = () => {
    setCurrentStep('meta');
  };

  const handleConnectPlatform = (platform: string) => {
    setIsConnecting(true);
    setPlatformStatuses(prev => ({ ...prev, [platform]: 'connecting' }));
    
    // Simulate connection delay
    setTimeout(() => {
      setPlatformStatuses(prev => ({ ...prev, [platform]: 'connected' }));
      
      // Initialize permissions for this platform (all granted by default)
      const config = platformConfigs[platform as keyof typeof platformConfigs];
      const permissions: Record<string, boolean> = {};
      config.permissions.forEach(permission => {
        permissions[permission] = true;
      });
      setPlatformPermissions(prev => ({ ...prev, [platform]: permissions }));
      
      setIsConnecting(false);
      setPlatformPhases(prev => ({ ...prev, [platform]: 'permissions' }));
    }, 2000);
  };

  const handleRejectPlatform = (platform: string) => {
    setPlatformStatuses(prev => ({ ...prev, [platform]: 'rejected' }));
    handleContinue();
  };

  // Shopify-specific handlers
  const handleShopifyStoreIdSubmit = () => {
    if (shopifyStoreId.trim()) {
      setShopifyStep('collaborator-code');
    }
  };

  const handleShopifyCollaboratorCodeSubmit = () => {
    if (shopifyCollaboratorCode.trim()) {
      // Simulate connection delay
      setIsConnecting(true);
      setPlatformStatuses(prev => ({ ...prev, shopify: 'connecting' }));
      
      setTimeout(() => {
        setPlatformStatuses(prev => ({ ...prev, shopify: 'connected' }));
        
        // Initialize permissions for Shopify (all granted by default)
        const config = platformConfigs.shopify;
        const permissions: Record<string, boolean> = {};
        config.permissions.forEach(permission => {
          permissions[permission] = true;
        });
        setPlatformPermissions(prev => ({ ...prev, shopify: permissions }));
        
        setIsConnecting(false);
        setPlatformPhases(prev => ({ ...prev, shopify: 'permissions' }));
      }, 2000);
    }
  };

  const handleGoogleOAuth = () => {
    try {
      // For demo purposes, we'll use a placeholder token
      const onboardingToken = 'demo-onboarding-token'; // In production, this would be the actual link token
      
      // Build OAuth URL with onboarding token as state
      const oauthUrl = buildClientGoogleOAuthUrl(onboardingToken);
      
      // Open Google OAuth in new tab
      window.open(oauthUrl, '_blank');
    } catch (error) {
      console.error('Failed to initiate Google OAuth:', error);
      alert(`Failed to connect to Google: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleMetaOAuth = () => {
    try {
      // For demo purposes, we'll use a placeholder token
      const onboardingToken = 'demo-onboarding-token'; // In production, this would be the actual link token
      
      // Build OAuth URL with onboarding token as state
      const oauthUrl = buildClientMetaOAuthUrl(onboardingToken);
      
      // Open Meta OAuth in new tab
      window.open(oauthUrl, '_blank');
    } catch (error) {
      console.error('Failed to initiate Meta OAuth:', error);
      alert(`Failed to connect to Meta: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePermissionChange = (platform: string, permission: string, granted: boolean) => {
    setPlatformPermissions(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [permission]: granted
      }
    }));
  };

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      const previousStep = stepOrder[currentIndex - 1];
      setCurrentStep(previousStep);
      
      // Reset platform phase if going back to a platform step
      if (platformOrder.includes(previousStep)) {
        const platformStatus = platformStatuses[previousStep];
        if (platformStatus === 'connected') {
          setPlatformPhases(prev => ({ ...prev, [previousStep]: 'permissions' }));
        } else {
          setPlatformPhases(prev => ({ ...prev, [previousStep]: 'connect' }));
        }
      }
    }
  };

  const handleContinue = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      setCurrentStep(nextStep);
    }
  };

  const handleAccessDashboard = () => {
    setTestUser('client');
    navigate('/dashboard');
  };

  const progressSteps = getProgressSteps();

  const renderPlatformStep = (platform: string) => {
    const config = platformConfigs[platform as keyof typeof platformConfigs];
    const status = platformStatuses[platform];
    const phase = platformPhases[platform];

    if (!config) return null;

    return (
      <div key={platform} className="text-center">
        {/* Platform Logo */}
        <div className="w-24 h-24 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-lg">
          <img 
            src={`/${platform}-logo.svg`} 
            alt={config.name}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center hidden">
            <span className="text-white font-bold text-lg">{config.name.charAt(0)}</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {config.name} Integration
        </h2>

        {phase === 'connect' ? (
          // Connection Phase
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 max-w-md mx-auto">
            {platform === 'shopify' ? (
              // Shopify-specific two-step connection
              <div className="space-y-6">
                {shopifyStep === 'store-id' ? (
                  // Step 1: Store ID input
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 font-medium">Enter your Shopify store ID</p>
                      <p className="text-blue-600 text-sm mt-1">
                        This is the middle part of your store URL
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-0">
                        <span className="text-gray-600 text-sm font-mono">https://</span>
                        <input
                          type="text"
                          value={shopifyStoreId}
                          onChange={(e) => setShopifyStoreId(e.target.value)}
                          placeholder="your-store-name"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-center mx-1"
                        />
                        <span className="text-gray-600 text-sm font-mono">.myshopify.com</span>
                      </div>
                      <button
                        onClick={handleShopifyStoreIdSubmit}
                        disabled={!shopifyStoreId.trim()}
                        className="w-full bg-cyan-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  // Step 2: Collaborator code input
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 font-medium">Get your collaborator code</p>
                      <p className="text-blue-600 text-sm mt-1">
                        Click the button below to open your Shopify admin settings where you can find your collaborator code.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => window.open(getShopifyAdminUrl(shopifyStoreId), '_blank')}
                        className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-black transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Open Shopify Admin Settings</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 text-left">
                          Collaborator Code
                        </label>
                        <input
                          type="text"
                          value={shopifyCollaboratorCode}
                          onChange={(e) => setShopifyCollaboratorCode(e.target.value)}
                          placeholder="Enter your collaborator code"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShopifyStep('store-id')}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleShopifyCollaboratorCodeSubmit}
                          disabled={!shopifyCollaboratorCode.trim()}
                          className="flex-1 bg-cyan-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Connect Store
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : platform === 'google' ? (
              // Google OAuth connection for clients
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">Connect your Google account</p>
                  <p className="text-blue-600 text-sm mt-1">
                    Click the button below to authorize access to your Google account for this onboarding request.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => handleGoogleOAuth()}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Connect Google Account</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    This will open Google's authorization page in a new tab
                  </p>
                </div>
              </div>
            ) : platform === 'meta' ? (
              // Meta OAuth connection for clients
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">Connect your Meta Business account</p>
                  <p className="text-blue-600 text-sm mt-1">
                    Click the button below to authorize access to your Facebook and Instagram business accounts for this onboarding request.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => handleMetaOAuth()}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Connect Meta Business Account</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    This will open Meta's authorization page in a new tab
                  </p>
                </div>
              </div>
            ) : (
              // Standard connection flow for other platforms
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">Ready to connect {config.name}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleConnectPlatform(platform)}
                    className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-black transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Connect</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRejectPlatform(platform)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Permissions Phase
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 max-w-lg mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grant Access Permissions</h3>
            <div className="space-y-3 text-left">
              {config.permissions.map((permission) => (
                <label key={permission} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={platformPermissions[platform]?.[permission] || false}
                      onChange={(e) => handlePermissionChange(platform, permission, e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      platformPermissions[platform]?.[permission]
                        ? `bg-${config.color}-500 border-${config.color}-500`
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}>
                      {platformPermissions[platform]?.[permission] && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-1">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 text-sm">{permission}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center hover:opacity-80 transition-opacity duration-200"
            title="Home"
          >
            <img 
              src="/vast-logo.png" 
              alt="Vast Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center hidden">
              <span className="text-white font-bold text-sm">V</span>
            </div>
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 py-6 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-8">
            {progressSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all ${
                    step.completed 
                      ? 'bg-indigo-600 text-white' 
                      : step.active 
                      ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    step.active ? 'text-indigo-600' : step.completed ? 'text-indigo-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-all ${
                    progressSteps[index + 1].completed || progressSteps[index + 1].active 
                      ? 'bg-indigo-600' 
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-2xl w-full">
          {/* Intro Step */}
          {currentStep === 'intro' && (
            <div className="text-center">
              {/* Logo */}
              <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-12 shadow-xl relative">
                <img 
                  src="/vast-logo.png" 
                  alt="Vast Logo" 
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center hidden">
                  <span className="text-white font-bold text-2xl">V</span>
                </div>
              </div>
              
              {/* Main Message */}
              <h1 className="text-4xl font-bold text-gray-900 mb-16 leading-tight">
                Vast would like to manage your {getPlatformsText()}
              </h1>
            </div>
          )}

          {/* Platform Steps */}
          {platformOrder.includes(currentStep) && renderPlatformStep(currentStep)}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Setup Complete!</h1>
              <p className="text-lg text-gray-600 mb-12">
                Your platforms are connected and ready to use.
              </p>
              
              <div className="grid grid-cols-4 gap-6 mb-12 max-w-md mx-auto">
                {platformOrder.map((platform) => {
                  const config = platformConfigs[platform as keyof typeof platformConfigs];
                  const status = platformStatuses[platform];
                  return (
                    <div key={platform} className="text-center">
                      <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3 relative shadow-lg">
                        <img 
                          src={`/${platform}-logo.svg`} 
                          alt={config.name}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center hidden">
                          <span className="text-white font-bold text-sm">{config.name.charAt(0)}</span>
                        </div>
                        {status === 'connected' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{config.name}</p>
                      <p className={`text-xs ${status === 'connected' ? 'text-green-600' : 'text-orange-600'}`}>
                        {status === 'connected' ? 'Connected' : 'Skipped'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            {currentStep !== 'intro' && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            
            {currentStep === 'intro' && (
              <div className="w-full flex justify-center">
                <button
                  onClick={handleStartDemo}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {platformOrder.includes(currentStep) && (
              <button
                onClick={handleContinue}
                disabled={platformStatuses[currentStep] === 'pending' || (platformStatuses[currentStep] === 'connected' && platformPhases[currentStep] === 'connect')}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            
            {currentStep === 'complete' && (
              <button
                onClick={handleAccessDashboard}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors ml-auto"
              >
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}