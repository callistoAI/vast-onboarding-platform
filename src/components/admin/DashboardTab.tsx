import React, { useState, useEffect, useCallback } from 'react';
import { Copy, ExternalLink, CheckCircle, Eye, Edit3, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { useAuth } from '../../hooks/useAuth';
import { META_ACCESS_REQUEST_OPTIONS, getScopesForSelectedOptions, encodeSelectedOptionsState } from '../../lib/metaAccessRequests';

type OnboardingLink = Database['public']['Tables']['onboarding_links']['Row'];

const platformOptions = [
  { id: 'meta', name: 'Meta Business', color: 'purple', enabled: true },
  { id: 'google', name: 'Google Ads', color: 'indigo', enabled: false },
  { id: 'tiktok', name: 'TikTok Ads', color: 'teal', enabled: false },
  { id: 'shopify', name: 'Shopify', color: 'cyan', enabled: false }
];

const platformApiOptions = {
  meta: META_ACCESS_REQUEST_OPTIONS.map(option => ({
    id: option.id,
    name: option.name,
    description: option.description,
    enabled: option.enabled
  })),
  google: [
    'Google Ads API',
    'Google Analytics API',
    'Google My Business API',
    'YouTube Data API'
  ],
  tiktok: [
    'TikTok Marketing API',
    'TikTok Business API',
    'TikTok Analytics API',
    'TikTok Creative API'
  ],
  shopify: [
    'Shopify Admin API',
    'Shopify Storefront API',
    'Shopify Partner API',
    'Shopify GraphQL API'
  ]
};

export function OnboardingLinksTab() {
  const [links, setLinks] = useState<OnboardingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLinks, setTotalLinks] = useState(0);
  const [activeLinks, setActiveLinks] = useState(0);
  const [usedLinks, setUsedLinks] = useState(0);
  const [expiredLinks, setExpiredLinks] = useState(0);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformApis, setPlatformApis] = useState<Record<string, string[]>>({});
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkName, setLinkName] = useState('');
  const [linkType, setLinkType] = useState<'manage' | 'view'>('manage');
  const [connections, setConnections] = useState<any[]>([]);
  const { profile } = useAuth();
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLinkName, setEditingLinkName] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'manage' | 'view'>('all');

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'used' | 'expired'>('all');
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  // Debug logging moved to useEffect to avoid variable access issues
  
  const fetchConnections = useCallback(async () => {
    try {
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('platform_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (connectionsError) throw connectionsError;
      setConnections(connectionsData || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
      setConnections([]);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      // Fetch onboarding links
      const { data: linksData, error: linksError } = await supabase
        .from('onboarding_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (linksError) throw linksError;
      setLinks(linksData || []);

      // Calculate counts
      const total = linksData?.length || 0;
      const active = linksData?.filter(link => link.status === 'active').length || 0;
      const used = linksData?.filter(link => link.status === 'used').length || 0;
      const expired = linksData?.filter(link => link.status === 'expired').length || 0;
      
      setTotalLinks(total);
      setActiveLinks(active);
      setUsedLinks(used);
      setExpiredLinks(expired);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
    // Always use mock data for demonstration
    setMockData();
  }, []);

  useEffect(() => {
    fetchData();
    fetchConnections();
  }, [fetchData, fetchConnections]);

  // Debug logging
  useEffect(() => {
    console.log('OnboardingLinksTab render:', {
      loading,
      linksCount: links.length,
      totalLinks,
      activeLinks,
      usedLinks,
      expiredLinks
    });
  }, [loading, links.length, totalLinks, activeLinks, usedLinks, expiredLinks]);

  const setMockData = () => {
    // Enhanced mock links with more variety and different statuses - expanded for complete UI
    const mockLinks = [
      {
        id: '1',
        created_by: 'admin1',
        platforms: ['meta', 'google', 'tiktok', 'shopify'],
        expires_at: null,
        note: 'Premium Client Package',
        status: 'active' as const,
        link_token: 'premium-client-pkg-001',
        used_by: null,
        used_at: null,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        created_by: 'admin1',
        platforms: ['meta', 'google'],
        expires_at: null,
        note: 'Social Media Analytics',
        status: 'used' as const,
        link_token: 'social-analytics-002',
        used_by: 'client1',
        used_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        created_by: 'admin1',
        platforms: ['tiktok', 'shopify'],
        expires_at: null,
        note: 'E-commerce Setup',
        status: 'active' as const,
        link_token: 'ecommerce-setup-003',
        used_by: null,
        used_at: null,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        created_by: 'admin1',
        platforms: ['google'],
        expires_at: null,
        note: 'Google Ads Only',
        status: 'expired' as const,
        link_token: 'google-ads-004',
        used_by: null,
        used_at: null,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        created_by: 'admin1',
        platforms: ['meta', 'tiktok'],
        expires_at: null,
        note: 'Social Commerce',
        status: 'used' as const,
        link_token: 'social-commerce-005',
        used_by: 'client2',
        used_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        created_by: 'admin1',
        platforms: ['shopify'],
        expires_at: null,
        note: 'Shopify Integration',
        status: 'active' as const,
        link_token: 'shopify-integration-006',
        used_by: null,
        used_at: null,
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '7',
        created_by: 'admin1',
        platforms: ['meta', 'google', 'tiktok'],
        expires_at: null,
        note: 'Full Marketing Suite',
        status: 'active' as const,
        link_token: 'full-marketing-007',
        used_by: null,
        used_at: null,
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '8',
        created_by: 'admin1',
        platforms: ['google', 'shopify'],
        expires_at: null,
        note: 'Google + Shopify',
        status: 'active' as const,
        link_token: 'google-shopify-008',
        used_by: null,
        used_at: null,
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '9',
        created_by: 'admin1',
        platforms: ['meta', 'google', 'tiktok', 'shopify'],
        expires_at: null,
        note: 'Standard Link',
        status: 'active' as const,
        link_token: 'standard-link-009',
        used_by: null,
        used_at: null,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '10',
        created_by: 'admin1',
        platforms: ['meta', 'google'],
        expires_at: null,
        note: 'Standard',
        status: 'active' as const,
        link_token: 'standard-010',
        used_by: null,
        used_at: null,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
    
    console.log('Setting mock data with standard links:', mockLinks.filter(link => link.note === 'Standard Link' || link.note === 'Standard'));
    setLinks(mockLinks);
  };

  const isMetaConnected = () => {
    const metaConnection = connections.find(c => c.platform === 'meta');
    return metaConnection?.status === 'connected';
  };

  const generateLink = async () => {
    if (selectedPlatforms.length === 0 || Object.keys(platformApis).length === 0 || !linkName.trim()) return;
    
    // Check if Meta is connected for Meta platform links
    if (selectedPlatforms.includes('meta') && !isMetaConnected()) {
      alert('Please connect your Meta Business account first in Settings before generating Meta access links.');
      return;
    }
    
    setGenerating(true);
    try {
      // Build platform-specific configuration
      const platformConfigs: Record<string, any> = {};
      
      selectedPlatforms.forEach(platform => {
        const apis = platformApis[platform] || [];
        
        if (platform === 'meta') {
          // For Meta, store the selected access request options and their scopes
          const selectedOptions = apis; // These are the access request option names
          const scopes = getScopesForSelectedOptions(selectedOptions);
          const encodedState = encodeSelectedOptionsState(selectedOptions);
          
          // Get the admin's Meta connection info
          const metaConnection = connections.find(c => c.platform === 'meta' && c.status === 'connected');
          
          platformConfigs[platform] = {
            selectedOptions,
            scopes,
            encodedState,
            adminConnection: metaConnection ? {
              connected_by: metaConnection.connected_by,
              token_data: metaConnection.token_data,
              connected_at: metaConnection.created_at
            } : null,
            oauthUrl: `https://www.facebook.com/v21.0/dialog/oauth?client_id=${import.meta.env.VITE_NEXT_PUBLIC_META_APP_ID}&redirect_uri=${window.location.origin}/oauth/meta/client/callback&response_type=code&scope=${scopes.join(',')}&state=TOKEN_PLACEHOLDER|${encodedState}`
          };
        } else {
          // For other platforms, keep the existing API structure
          platformConfigs[platform] = {
            apis: apis
          };
        }
      });

      const { data, error } = await supabase
        .from('onboarding_links')
        .insert({
          created_by: profile?.id || 'test-admin-user',
          platforms: selectedPlatforms,
          expires_at: null,
          note: `${linkType.toUpperCase()} - ${linkName} - Config: ${JSON.stringify(platformConfigs)}`,
        })
        .select()
        .single();

      if (error) throw error;

      const linkUrl = `${window.location.origin}/onboard/${data.link_token}`;
      setGeneratedLink(linkUrl);
      setSelectedPlatforms([]);
      setPlatformApis({});
      setLinkName('');
      setLinkType('manage');
      setShowLinkForm(false);
      fetchData(); // Refresh the links list
    } catch (error) {
      console.error('Error generating link:', error);
      // Mock success for testing
      const mockToken = Math.random().toString(36).substring(2, 15);
      const linkUrl = `${window.location.origin}/onboard/${mockToken}`;
      setGeneratedLink(linkUrl);
      setSelectedPlatforms([]);
      setPlatformApis({});
      setLinkName('');
      setLinkType('manage');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };



  const handleEditLinkName = (linkId: string, currentName: string) => {
    setEditingLinkId(linkId);
    setEditingLinkName(currentName);
  };

  const handleSaveLinkName = async (linkId: string) => {
    // In a real app, this would update the database
    console.log(`Saving link name: ${editingLinkName} for link ${linkId}`);
    setEditingLinkId(null);
    setEditingLinkName('');
  };

  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setEditingLinkName('');
  };

  const handleTestLink = (linkToken: string) => {
    // Open demo flow with this specific link
    window.open(`/demo/onboard?token=${linkToken}`, '_blank');
  };




  const filteredLinks = () => {
    let filtered = [...links];
    
    // Create standard links that appear at the top
    const standardLinks = [
      {
        id: 'standard-manage',
        created_by: 'admin1',
        platforms: ['meta', 'google', 'tiktok', 'shopify'],
        expires_at: null,
        note: 'Standard Manage Link',
        status: 'active' as const,
        link_token: 'standard-manage-access',
        used_by: null,
        used_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isStandard: true,
        standardType: 'manage'
      },
      {
        id: 'standard-view',
        created_by: 'admin1',
        platforms: ['meta', 'google', 'tiktok', 'shopify'],
        expires_at: null,
        note: 'Standard View Link',
        status: 'active' as const,
        link_token: 'standard-view-access',
        used_by: null,
        used_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isStandard: true,
        standardType: 'view'
      }
    ];

    // Apply tab filter
    if (activeTab === 'manage') {
      // Show standard manage link + first 3 regular links for manage tab
      filtered = [standardLinks[0], ...filtered.slice(0, 3)];
    } else if (activeTab === 'view') {
      // Show standard view link + links 3-5 for view tab
      filtered = [standardLinks[1], ...filtered.slice(3, 6)];
    } else {
      // Show both standard links + first 6 regular links for all tab
      filtered = [...standardLinks, ...filtered.slice(0, 6)];
    }
    
    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(link => link.status === selectedFilter);
    }
    
    return filtered.filter(link => {
      if (selectedFilter === 'active') return link.status === 'active';
      if (selectedFilter === 'used') return link.status === 'used';
      if (selectedFilter === 'expired') return link.status === 'expired';
      return true;
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Links</h1>
          <p className="text-gray-600 mt-1">Manage your onboarding links and client access</p>
        </div>
        <button 
          onClick={() => setShowLinkForm(!showLinkForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-colors duration-200 font-medium"
        >
          Create Link
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Links</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalLinks}</p>
            </div>
            <div className="w-12 h-8 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-lg shadow-lg shadow-cyan-200/50 opacity-80"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Links</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{activeLinks}</p>
            </div>
            <div className="w-12 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg shadow-lg shadow-green-200/50 opacity-80"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Used Links</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{usedLinks}</p>
            </div>
            <div className="w-12 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg shadow-lg shadow-blue-200/50 opacity-80"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired Links</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{expiredLinks}</p>
            </div>
            <div className="w-12 h-8 bg-gradient-to-r from-red-400 to-red-500 rounded-lg shadow-lg shadow-red-200/50 opacity-80"></div>
          </div>
        </div>
      </div>

      {/* Link Generation Form */}
      {showLinkForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">Create new link</h3>
            <p className="text-gray-600 text-sm mt-1">Generate a new onboarding link for your clients</p>
          </div>
          <div className="p-6">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Link Name
                  </label>
                  <input
                    type="text"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    placeholder="e.g., Premium Client Package"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Access Type
                  </label>
                  <select
                    value={linkType}
                    onChange={(e) => setLinkType(e.target.value as 'manage' | 'view')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="manage">Manage Access</option>
                    <option value="view">View Only Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  Select Platforms & APIs
                </label>
                <div className="space-y-4">
                  {platformOptions.map((platform) => (
                    <div key={platform.id} className="relative">
                      <div className={`border border-gray-200 rounded-xl transition-all duration-200 ${
                        platform.enabled 
                          ? 'bg-gray-50 hover:border-gray-300 hover:shadow-sm' 
                          : 'bg-gray-100 opacity-50 cursor-not-allowed'
                      }`}>
                        <label className={`flex items-center justify-between p-5 ${
                          platform.enabled ? 'cursor-pointer' : 'cursor-not-allowed'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={selectedPlatforms.includes(platform.id)}
                                disabled={!platform.enabled}
                                onChange={(e) => {
                                  if (!platform.enabled) return;
                                  if (e.target.checked) {
                                    setSelectedPlatforms([...selectedPlatforms, platform.id]);
                                    setPlatformApis({ ...platformApis, [platform.id]: [] });
                                  } else {
                                    setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                                    const newApis = { ...platformApis };
                                    delete newApis[platform.id];
                                    setPlatformApis(newApis);
                                  }
                                }}
                                className="sr-only"
                              />
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                                selectedPlatforms.includes(platform.id)
                                  ? `bg-gradient-to-r from-${platform.color}-500 to-${platform.color}-600 border-${platform.color}-500`
                                  : platform.enabled
                                  ? 'border-gray-300 bg-white hover:border-gray-400'
                                  : 'border-gray-200 bg-gray-100'
                              }`}>
                                {selectedPlatforms.includes(platform.id) && (
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                                platform.enabled
                                  ? `bg-gradient-to-br from-${platform.color}-400 to-${platform.color}-500`
                                  : 'bg-gray-400'
                              }`}>
                                <span className="text-white font-bold text-sm">
                                  {platform.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className={`font-semibold ${
                                    platform.enabled ? 'text-gray-900' : 'text-gray-500'
                                  }`}>{platform.name}</span>
                                  {!platform.enabled && (
                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
                                  )}
                                </div>
                                <p className={`text-sm ${
                                  platform.enabled ? 'text-gray-600' : 'text-gray-400'
                                }`}>
                                  {platform.id === 'meta' 
                                    ? `${META_ACCESS_REQUEST_OPTIONS.filter(opt => opt.enabled).length} access options available`
                                    : `${platformApiOptions[platform.id as keyof typeof platformApiOptions].length} APIs available`
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          {selectedPlatforms.includes(platform.id) && platform.enabled && (
                            <svg className="w-5 h-5 text-gray-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </label>
                        
                        {selectedPlatforms.includes(platform.id) && (
                          <div className="border-t border-gray-200 bg-white">
                            <div className="p-5 space-y-3">
                              <p className="text-sm font-semibold text-gray-900 mb-4">
                                {platform.id === 'meta' ? 'Select Access Options:' : 'Select APIs:'}
                              </p>
                              <div className="space-y-3">
                                {platformApiOptions[platform.id as keyof typeof platformApiOptions].map((api) => {
                                  const apiName = typeof api === 'string' ? api : api.name;
                                  const apiId = typeof api === 'string' ? api : api.id;
                                  const apiDescription = typeof api === 'object' ? api.description : '';
                                  const isEnabled = typeof api === 'object' ? api.enabled : true;
                                  
                                  return (
                                    <label key={apiId} className={`flex items-center space-x-3 cursor-pointer group p-3 rounded-lg transition-colors ${
                                      isEnabled ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
                                    }`}>
                                      <div className="relative">
                                        <input
                                          type="checkbox"
                                          checked={platformApis[platform.id]?.includes(apiName) || false}
                                          disabled={!isEnabled}
                                          onChange={(e) => {
                                            if (!isEnabled) return;
                                            const currentApis = platformApis[platform.id] || [];
                                            if (e.target.checked) {
                                              setPlatformApis({
                                                ...platformApis,
                                                [platform.id]: [...currentApis, apiName]
                                              });
                                            } else {
                                              setPlatformApis({
                                                ...platformApis,
                                                [platform.id]: currentApis.filter(a => a !== apiName)
                                              });
                                            }
                                          }}
                                          className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                                          platformApis[platform.id]?.includes(apiName) 
                                            ? 'bg-gray-600 border-gray-600'
                                            : isEnabled 
                                            ? 'border-gray-300 bg-white group-hover:border-gray-400'
                                            : 'border-gray-200 bg-gray-100'
                                        }`}>
                                          {platformApis[platform.id]?.includes(apiName) && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm font-medium text-gray-900">{apiName}</span>
                                          {!isEnabled && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Coming Later</span>
                                          )}
                                        </div>
                                        {apiDescription && (
                                          <p className="text-xs text-gray-500 mt-1">{apiDescription}</p>
                                        )}
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Connection Warning */}
              {selectedPlatforms.includes('meta') && !isMetaConnected() && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Meta Business Account Required</p>
                      <p className="text-sm text-yellow-700">Please connect your Meta Business account in Settings before generating Meta access links.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowLinkForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={generateLink}
                  disabled={generating || selectedPlatforms.length === 0 || Object.keys(platformApis).length === 0 || !linkName.trim() || (selectedPlatforms.includes('meta') && !isMetaConnected())}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 font-medium transition-colors duration-200"
                >
                  {generating ? 'Generating...' : 'Generate Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'all'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All links
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'manage'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'view'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              View
            </button>
          </nav>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>Filter: {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</span>
              <svg className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-32">
                {['all', 'active', 'used', 'expired'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter as 'all' | 'active' | 'used' | 'expired');
                      setShowFilterDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      selectedFilter === filter ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copy Notification */}
      {showCopyNotification && (
        <div className="fixed top-4 right-4 bg-indigo-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-in slide-in-from-right-4 duration-200">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Link copied to clipboard</span>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-4">
        {/* Table Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-12 gap-6 px-8 py-5 text-sm font-medium text-gray-500 border-b border-gray-100">
            <div className="col-span-3 text-center -ml-4">Name</div>
            <div className="col-span-3 text-center">URL</div>
            <div className="col-span-3 text-center">Platforms</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
        </div>

        {/* Table Body - Separated Rows */}
        <div className="space-y-4">
          {filteredLinks().length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <ExternalLink className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No links match the current filter</p>
            </div>
          ) : (
            filteredLinks().map((link) => (
              <div key={link.id} className={`rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                (link.note === 'Standard Link' || link.note === 'Standard') 
                  ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 shadow-lg shadow-yellow-200/50' 
                  : 'bg-white border-gray-200'
              } hover:shadow-md transition-shadow duration-200`}>
                {/* Debug info for standard links */}
                {(link.note === 'Standard Link' || link.note === 'Standard') && (
                  <div className="text-xs text-red-500 px-2 py-1 bg-red-100">
                    DEBUG: This is a standard link - {link.note}
                  </div>
                )}
                <div className="grid grid-cols-12 gap-6 items-center px-8 py-6 group">
                  <div className="col-span-3">
                    {editingLinkId === link.id ? (
                      <input
                        type="text"
                        value={editingLinkName}
                        onChange={(e) => setEditingLinkName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveLinkName(link.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-base text-gray-900">{link.note}</span>
                          {/* Show yellow star for standard links */}
                          {(link.note === 'Standard Link' || link.note === 'Standard') && (
                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                              <svg className="w-4 h-4 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {/* Only show edit button for non-standard links */}
                        {!(link.note === 'Standard Link' || link.note === 'Standard') && (
                          <button
                            onClick={() => handleEditLinkName(link.id, link.note || '')}
                            className="text-gray-400 hover:text-indigo-600 hover:scale-110 transition-all duration-200"
                            title="Edit name"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-span-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 font-mono text-sm text-gray-700 max-w-full">
                      <div className="truncate">
                        https://app.leadsie.com/onboard/{link.link_token}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <div className="flex space-x-2">
                      {link.platforms.slice(0, 3).map((platform) => {
                        const config = platformOptions.find(p => p.id === platform);
                        return (
                          <div
                            key={platform}
                            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm hover:scale-110 hover:shadow-md transition-all duration-200 bg-white border border-gray-200"
                            title={config?.name}
                          >
                            <img 
                              src={`/${platform}-logo.svg`} 
                              alt={config?.name}
                              className="w-6 h-6 object-contain"
                            />
                          </div>
                        );
                      })}
                      {link.platforms.length > 3 && (
                        <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center shadow-sm hover:scale-110 hover:shadow-md transition-all duration-200">
                          <span className="text-white font-bold text-xs">+{link.platforms.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      link.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : link.status === 'used'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleTestLink(link.link_token)}
                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                        title="Test link"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/onboard/${link.link_token}`)}
                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this link?')) {
                            console.log('Deleting link:', link.id);
                            // In a real app, this would delete from the database
                          }
                        }}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Generated Link Modal */}
      {generatedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Link Generated Successfully</h3>
              <p className="text-gray-600">Your onboarding link is ready to share</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-xl mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Onboarding Link:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-sm bg-white p-3 rounded-lg border text-gray-800 break-all font-mono">
                  {generatedLink}
                </code>
                <button
                  onClick={() => copyToClipboard(generatedLink)}
                  className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-8 text-center">
              Share this link with your client to begin the onboarding process.
            </p>
            <button
              onClick={() => setGeneratedLink(null)}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}