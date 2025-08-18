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

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (currentStep === 'intro') return 0;
    if (currentStep === 'complete') return 100;
    return ((currentPlatformIndex + 1) / platformOrder.length) * 100;
  };

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
    if (currentStep === 'platform' && currentPlatformIndex > 0) {
      setCurrentPlatformIndex(prev => prev - 1);
      setShowPermissions(platformStatuses[platformOrder[currentPlatformIndex - 1]] === 'connected');
    } else if (currentStep === 'platform' && currentPlatformIndex === 0) {
      setCurrentStep('intro');
    } else if (currentStep === 'complete') {
      setCurrentStep('platform');
      setCurrentPlatformIndex(platformOrder.length - 1);
      setShowPermissions(true);
    }
  };

  const handleContinue = () => {
    if (currentStep === 'intro') {
      setCurrentStep('platform');
    } else if (currentStep === 'platform') {
      if (isLastPlatform) {
        setCurrentStep('complete');
      } else {
        setCurrentPlatformIndex(prev => prev + 1);
        setShowPermissions(false);
      }
    }
  };

  const handleAccessDashboard = () => {
    setTestUser('client');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-lime-500 transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Exit Demo
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Vast Onboarding</span>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-2xl w-full">
          {/* Intro Step */}
          {currentStep === 'intro' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Platform Onboarding</h1>
              <p className="text-lg text-gray-600 mb-8">
                Connect your business platforms to get started with your marketing dashboard.
              </p>
              
              <div className="grid grid-cols-4 gap-4 mb-8">
                {Object.entries(platformConfigs).map(([platform, config]) => (
                  <div key={platform} className="text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${config.color}-400 to-${config.color}-500 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-white font-bold">{config.name.charAt(0)}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{config.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Step */}
          {currentStep === 'platform' && (
            <div className="text-center">
              <div className="mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br from-${currentConfig.color}-400 to-${currentConfig.color}-500 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-xl">{currentConfig.name.charAt(0)}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentConfig.name}</h2>
                <p className="text-gray-600">{currentConfig.description}</p>
              </div>

              {!showPermissions ? (
                // Connection Phase
                <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                  {platformStatuses[currentPlatform] === 'pending' && !isConnecting && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 font-medium">Ready to connect {currentConfig.name}</p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleConnectPlatform}
                          className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-black transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>Connect</span>
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleRejectPlatform}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  )}

                  {isConnecting && (
                    <div className="py-8">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-blue-700 font-medium">Connecting to {currentConfig.name}...</p>
                    </div>
                  )}

                  {platformStatuses[currentPlatform] === 'connected' && !showPermissions && (
                    <div className="py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <p className="text-green-700 font-medium">Successfully connected!</p>
                    </div>
                  )}

                  {platformStatuses[currentPlatform] === 'rejected' && (
                    <div className="py-8">
                      <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                      <p className="text-orange-700 font-medium">Connection skipped</p>
                    </div>
                  )}
                </div>
              ) : (
                // Permissions Phase
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Permissions</h3>
                  <div className="space-y-3">
                    {currentConfig.permissions.map((permission) => (
                      <label key={permission} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={platformPermissions[currentPlatform]?.[permission] || false}
                            onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            platformPermissions[currentPlatform]?.[permission]
                              ? `bg-${currentConfig.color}-500 border-${currentConfig.color}-500`
                              : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}>
                            {platformPermissions[currentPlatform]?.[permission] && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 flex-1 text-left">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 text-sm">{permission}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Setup Complete!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Your platforms are connected and ready to use.
              </p>
              
              <div className="grid grid-cols-4 gap-4 mb-8">
                {platformOrder.map((platform) => {
                  const config = platformConfigs[platform as keyof typeof platformConfigs];
                  const status = platformStatuses[platform];
                  return (
                    <div key={platform} className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br from-${config.color}-400 to-${config.color}-500 rounded-xl flex items-center justify-center mx-auto mb-2 relative`}>
                        <span className="text-white font-bold">{config.name.charAt(0)}</span>
                        {status === 'connected' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
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
          <div className="flex justify-between">
            {(currentStep === 'platform' || currentStep === 'complete') && (
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
                  onClick={handleContinue}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-lime-500 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-lime-600 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {currentStep === 'platform' && (showPermissions || platformStatuses[currentPlatform] === 'rejected') && (
              <button
                onClick={handleContinue}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-lime-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-lime-600 transition-colors ml-auto"
              >
                <span>{isLastPlatform ? 'Complete' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            
            {currentStep === 'complete' && (
              <button
                onClick={handleAccessDashboard}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-lime-500 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-lime-600 transition-colors ml-auto"
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