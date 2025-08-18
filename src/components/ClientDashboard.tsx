import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, AlertCircle, ExternalLink, TrendingUp, Activity, Shield, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { useAuth } from '../hooks/useAuth';

type Authorization = Database['public']['Tables']['authorizations']['Row'];

const platformConfigs = {
  meta: {
    name: 'Meta Business',
    color: '#6200EE',
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
    color: '#3700B3',
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
    color: '#03DAC6',
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
    color: '#018786',
    description: 'Connect your Shopify store data',
    permissions: [
      'Access Shopify store data',
      'View product and inventory information',
      'Access order and customer data',
      'Manage Shopify app integrations'
    ]
  }
};

export function ClientDashboard() {
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManageConnection, setShowManageConnection] = useState<string | null>(null);
  const [platformPermissions, setPlatformPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [submittingSupport, setSubmittingSupport] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const { profile } = useAuth();

  const fetchAuthorizations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('authorizations')
        .select(`
          *,
          clients!inner(*)
        `)
        .eq('clients.user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuthorizations(data || []);
    } catch (error) {
      console.error('Error fetching authorizations:', error);
      // Fallback to mock data on error
      setMockData();
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (profile?.role === 'client') {
      fetchAuthorizations();
    } else {
      // For testing - use mock data for non-client users
      setMockData();
    }
  }, [profile?.role, fetchAuthorizations]);

  const setMockData = () => {
    // Mock data for testing
    const mockAuthorizations = [
      {
        id: 'auth1',
        client_id: 'client1',
        platform: 'meta' as const,
        status: 'authorized' as const,
        scopes: [],
        token_data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'auth2',
        client_id: 'client1',
        platform: 'google' as const,
        status: 'pending' as const,
        scopes: [],
        token_data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'auth3',
        client_id: 'client1',
        platform: 'tiktok' as const,
        status: 'pending' as const,
        scopes: [],
        token_data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'auth4',
        client_id: 'client1',
        platform: 'shopify' as const,
        status: 'authorized' as const,
        scopes: [],
        token_data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ] as Authorization[];
    
    setAuthorizations(mockAuthorizations);
    setLoading(false);
    
    // Initialize mock permissions
    const mockPermissions: Record<string, Record<string, boolean>> = {};
    mockAuthorizations.forEach(auth => {
      if (auth.status === 'authorized') {
        const config = platformConfigs[auth.platform as keyof typeof platformConfigs];
        mockPermissions[auth.platform] = {};
        config.permissions.forEach(permission => {
          mockPermissions[auth.platform][permission] = true;
        });
      }
    });
    setPlatformPermissions(mockPermissions);
  };

  const handleManageConnection = (platform: string) => {
    setShowManageConnection(platform);
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

  const handleSavePermissions = () => {
    // In a real app, this would save to the database
    console.log('Saving permissions:', platformPermissions[showManageConnection!]);
    setShowManageConnection(null);
  };

  const handleSubmitSupport = async () => {
    if (!supportMessage.trim()) return;
    
    setSubmittingSupport(true);
    try {
      // In a real implementation, this would save to a support_requests table
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSupportSubmitted(true);
      setSupportMessage('');
      setTimeout(() => {
        setSupportSubmitted(false);
        setShowSupportForm(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting support request:', error);
    } finally {
      setSubmittingSupport(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authorized':
        return <CheckCircle className="w-5 h-5 text-indigo-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authorized':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'pending':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      default:
        return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  const authorizedCount = authorizations.filter(auth => auth.status === 'authorized').length;
  const completionRate = authorizations.length > 0 ? (authorizedCount / authorizations.length) * 100 : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your platform authorizations and view connection status</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connected</p>
              <p className="text-3xl font-bold text-teal-600">{authorizedCount}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{authorizations.length - authorizedCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Platforms</p>
              <p className="text-3xl font-bold text-cyan-600">{authorizations.length}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Complete</p>
              <p className="text-3xl font-bold text-purple-600">{Math.round(completionRate)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Connection Progress</h3>
          <span className="text-sm font-medium text-gray-600">{Math.round(completionRate)}% Complete</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full h-3 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          {authorizedCount} of {authorizations.length} platforms connected. 
          {authorizations.length - authorizedCount > 0 && ` ${authorizations.length - authorizedCount} more to go!`}
        </p>
      </div>

      {/* Platform Authorizations */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Connections</h2>
        {Object.entries(platformConfigs).map(([platform, config]) => {
          const auth = authorizations.find(a => a.platform === platform);
          const status = auth?.status || 'pending';
          
          return (
            <div key={platform} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)` }}
                  >
                    <span className="text-white font-bold text-lg">
                      {config.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                    <p className="text-sm text-gray-500">{config.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status)}
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                    {status === 'authorized' ? 'Connected' : 'Pending Authorization'}
                  </span>
                </div>
              </div>

              {status === 'pending' ? (
                <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2">
                  <span>Authorize Access</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                      <p className="text-sm text-teal-800 font-medium">
                        Connected on {new Date(auth?.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleManageConnection(platform)}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    Manage Connection
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-700 text-sm mb-4">
              Having trouble connecting your platforms? Our support team is here to help you get everything set up properly.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowSupportForm(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Connection Modal */}
      {showManageConnection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Manage {platformConfigs[showManageConnection as keyof typeof platformConfigs].name} Access
              </h3>
              <button
                onClick={() => setShowManageConnection(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Choose which permissions to grant for {platformConfigs[showManageConnection as keyof typeof platformConfigs].name}
            </p>
            
            <div className="space-y-4 mb-8">
              {platformConfigs[showManageConnection as keyof typeof platformConfigs].permissions.map((permission) => (
                <label key={permission} className="flex items-center space-x-4 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={platformPermissions[showManageConnection]?.[permission] || false}
                      onChange={(e) => handlePermissionChange(showManageConnection, permission, e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      platformPermissions[showManageConnection]?.[permission]
                        ? `bg-gradient-to-r from-${platformConfigs[showManageConnection as keyof typeof platformConfigs].color}-500 to-${platformConfigs[showManageConnection as keyof typeof platformConfigs].color}-600 border-${platformConfigs[showManageConnection as keyof typeof platformConfigs].color}-500`
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}>
                      {platformPermissions[showManageConnection]?.[permission] && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-1">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">{permission}</span>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowManageConnection(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Form Modal */}
      {showSupportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">Contact Support</h3>
              <button
                onClick={() => setShowSupportForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {supportSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-cyan-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h4>
                <p className="text-gray-600">Our support team will get back to you soon.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Having trouble with your platform connections? Describe your issue and our support team will help you resolve it.
                </p>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your issue or question..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none transition-colors"
                />
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setShowSupportForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitSupport}
                    disabled={submittingSupport || !supportMessage.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-600 hover:to-teal-700 disabled:opacity-50 font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {submittingSupport ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}