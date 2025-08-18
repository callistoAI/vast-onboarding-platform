import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink, Shield, AlertCircle, ChevronLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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

type Step = 'intro' | 'platform' | 'complete';
type PlatformStatus = 'pending' | 'connecting' | 'connected' | 'rejected';

const platformOrder = ['meta', 'google', 'tiktok', 'shopify'];

export function DemoOnboardPage() {
  const navigate = useNavigate();
  const { setTestUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);
  const [platformStatuses, setPlatformStatuses] = useState<Record<string, PlatformStatus>>({
    meta: 'pending',
    google: 'pending',
    tiktok: 'pending',
    shopify: 'pending'
  });
  const [platformPermissions, setPlatformPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const currentPlatform = platformOrder[currentPlatformIndex];
  const currentConfig = platformConfigs[currentPlatform as keyof typeof platformConfigs];
  const isLastPlatform = currentPlatformIndex === platformOrder.length - 1;

  const handleStartDemo = () => {
    setCurrentStep('platform');
  };

  const handleConnectPlatform = () => {
    setIsConnecting(true);
    setPlatformStatuses(prev => ({ ...prev, [currentPlatform]: 'connecting' }));
    
    // Simulate connection delay
    setTimeout(() => {
      setPlatformStatuses(prev => ({ ...prev, [currentPlatform]: 'connected' }));
      
      // Initialize permissions for this platform (all granted by default)
      const permissions: Record<string, boolean> = {};
      currentConfig.permissions.forEach(permission => {
        permissions[permission] = true;
      });
      setPlatformPermissions(prev => ({ ...prev, [currentPlatform]: permissions }));
      
      setIsConnecting(false);
      setShowPermissions(true);
    }, 2000);
  };

  const handleRejectPlatform = () => {
    setPlatformStatuses(prev => ({ ...prev, [currentPlatform]: 'rejected' }));
    handleContinue();
  };

  const handlePermissionChange = (permission: string, granted: boolean) => {
    setPlatformPermissions(prev => ({
      ...prev,
      [currentPlatform]: {
        ...prev[currentPlatform],
        [permission]: granted
      }
    }));
  };

  const handleBack = () => {
    if (currentPlatformIndex > 0) {
      setCurrentPlatformIndex(prev => prev - 1);
      setShowPermissions(platformStatuses[platformOrder[currentPlatformIndex - 1]] === 'connected');
    } else {
      setCurrentStep('intro');
    }
  };

  const handleContinue = () => {
    if (isLastPlatform) {
      setCurrentStep('complete');
    } else {
      setCurrentPlatformIndex(prev => prev + 1);
      setShowPermissions(false);
    }
  };

  const handleAccessDashboard = () => {
    setTestUser('client');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="/vast-logo.png" 
                alt="Platform Logo" 
                className="w-28 h-28 object-contain mx-auto mb-6"
                onError={(e) => {
                  // Fallback to letter logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-28 h-28 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg hidden">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Vast Onboarding Demo</h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        {currentStep === 'platform' && (
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              {platformOrder.map((platform, index) => (
                <div key={platform} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm ${
                    index < currentPlatformIndex ? 'bg-green-500 text-white shadow-green-200' :
                    index === currentPlatformIndex ? 'bg-gradient-to-r from-green-500 to-lime-500 text-white shadow-green-200' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentPlatformIndex ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < platformOrder.length - 1 && (
                    <div className={`w-12 h-0.5 mx-3 transition-all duration-300 ${
                      index < currentPlatformIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-medium text-lg">
                Platform {currentPlatformIndex + 1} of {platformOrder.length}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentConfig.name}</p>
            </div>
          </div>
        )}

        {/* Intro Step */}
        {currentStep === 'intro' && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 mb-12">
              <div className="mb-8">
                <img 
                  src="/vast-logo.png" 
                  alt="Platform Logo" 
                  className="w-24 h-24 rounded-2xl object-cover mx-auto mb-6 shadow-lg"
                  onError={(e) => {
                    // Fallback to letter logo if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg hidden">
                  <span className="text-white font-bold text-2xl">V</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Vast Onboarding</h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                You've been invited to connect your business platforms for seamless collaboration with your marketing team.
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8">Platforms to Connect</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {Object.entries(platformConfigs).map(([platform, config]) => (
                    <div key={platform} className="text-center group">
                      <div className={`w-16 h-16 bg-gradient-to-br from-${config.color}-400 to-${config.color}-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform duration-200`}>
                        <span className="text-white font-bold text-xl">{config.name.charAt(0)}</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 mb-2">{config.name}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{config.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleStartDemo}
              className="bg-gradient-to-r from-green-500 to-lime-500 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:from-green-600 hover:to-lime-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto group"
            >
              <span>Start Connection Process</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Platform Step */}
        {currentStep === 'platform' && (
          <div>
            <div className="max-w-2xl mx-auto">
              {!showPermissions ? (
                // Connection Phase
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
                  <div className="text-center mb-10">
                    <div className={`w-24 h-24 bg-gradient-to-br from-${currentConfig.color}-400 to-${currentConfig.color}-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <span className="text-white font-bold text-3xl">{currentConfig.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{currentConfig.name}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{currentConfig.description}</p>
                  </div>

                  {platformStatuses[currentPlatform] === 'pending' && !isConnecting && (
                    <div className="space-y-8">
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                        <p className="text-center text-indigo-800 text-lg font-medium">
                          Platform connection successful!
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={handleConnectPlatform}
                          className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-black transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                        >
                          <span>Connect Platform</span>
                          <ExternalLink className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleRejectPlatform}
                          className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  )}

                  {isConnecting && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                      <p className="text-indigo-700 font-bold text-2xl mb-3">Connecting to {currentConfig.name}...</p>
                      <p className="text-indigo-600 text-lg">Please wait while we establish a secure connection</p>
                    </div>
                  )}

                  {platformStatuses[currentPlatform] === 'connected' && !showPermissions && (
                    <div className="text-center py-16">
                      <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-8" />
                      <p className="text-green-700 font-bold text-2xl mb-3">Successfully connected!</p>
                      <p className="text-green-600 text-lg">Your {currentConfig.name} account is now linked</p>
                    </div>
                  )}

                  {platformStatuses[currentPlatform] === 'rejected' && (
                    <div className="text-center py-16">
                      <AlertCircle className="w-24 h-24 text-orange-500 mx-auto mb-8" />
                      <p className="text-orange-700 font-bold text-2xl mb-3">Connection skipped</p>
                      <p className="text-orange-600 text-lg">You can connect this platform later if needed</p>
                    </div>
                  )}
                </div>
              ) : (
                // Permissions Phase
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
                  <div className="text-center mb-10">
                    <div className={`w-20 h-20 bg-gradient-to-br from-${currentConfig.color}-400 to-${currentConfig.color}-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <span className="text-white font-bold text-2xl">{currentConfig.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Review Access Permissions</h3>
                    <p className="text-lg text-gray-600">Choose which permissions to grant for {currentConfig.name}</p>
                  </div>

                  <div className="space-y-4 mb-10">
                    {currentConfig.permissions.map((permission) => (
                      <label key={permission} className="flex items-center space-x-4 cursor-pointer p-5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={platformPermissions[currentPlatform]?.[permission] || false}
                            onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                            platformPermissions[currentPlatform]?.[permission]
                              ? `bg-gradient-to-r from-${currentConfig.color}-500 to-${currentConfig.color}-600 border-${currentConfig.color}-500 shadow-sm`
                              : 'border-gray-300 bg-white hover:border-gray-400 group-hover:border-gray-500'
                          }`}>
                            {platformPermissions[currentPlatform]?.[permission] && (
                              <CheckCircle className="w-5 h-5 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 flex-1">
                          <Shield className="w-6 h-6 text-gray-400" />
                          <span className="text-gray-900 font-semibold text-lg">{permission}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back</span>
                </button>
                
                {(showPermissions || platformStatuses[currentPlatform] === 'rejected') && (
                  <button
                    onClick={handleContinue}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-lime-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-lime-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
                  >
                    <span>{isLastPlatform ? 'Complete Setup' : 'Continue'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {currentStep === 'complete' && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 mb-12">
              <CheckCircle className="w-28 h-28 text-green-500 mx-auto mb-8" />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Onboarding Complete!</h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Your platforms have been successfully connected and configured. You can now access your dashboard to manage your connections.
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8">Connection Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {platformOrder.map((platform) => {
                    const config = platformConfigs[platform as keyof typeof platformConfigs];
                    const status = platformStatuses[platform];
                    return (
                      <div key={platform} className="text-center group">
                        <div className={`w-16 h-16 bg-gradient-to-br from-${config.color}-400 to-${config.color}-500 rounded-2xl flex items-center justify-center mx-auto mb-4 relative shadow-lg group-hover:scale-105 transition-transform duration-200`}>
                          <span className="text-white font-bold text-xl">{config.name.charAt(0)}</span>
                          {status === 'connected' && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {status === 'rejected' && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm font-bold">×</span>
                            </div>
                          )}
                        </div>
                        <p className="text-lg font-semibold text-gray-900 mb-2">{config.name}</p>
                        <p className={`text-sm font-medium px-3 py-1 rounded-full ${
                          status === 'connected' 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-orange-700 bg-orange-100'
                        }`}>
                          {status === 'connected' ? 'Connected' : 'Skipped'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleAccessDashboard}
              className="bg-gradient-to-r from-green-500 to-lime-500 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:from-green-600 hover:to-lime-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto group"
            >
              <span>Access Client Dashboard</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}