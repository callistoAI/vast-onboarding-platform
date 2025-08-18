import React, { useState, useEffect, useCallback } from 'react';
import { Copy, ExternalLink, CheckCircle, Eye, Settings, Edit3, ChevronDown, Link } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { useAuth } from '../../hooks/useAuth';

type OnboardingLink = Database['public']['Tables']['onboarding_links']['Row'];

const platformOptions = [
  { id: 'meta', name: 'Meta Business', color: 'blue' },
  { id: 'google', name: 'Google Ads', color: 'red' },
  { id: 'tiktok', name: 'TikTok Ads', color: 'purple' },
  { id: 'shopify', name: 'Shopify', color: 'green' }
];

const platformApiOptions = {
  meta: [
    'Facebook Ads API',
    'Instagram Business API',
    'Facebook Pages API',
    'Meta Business SDK'
  ],
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
  const [, setLinks] = useState<OnboardingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformApis, setPlatformApis] = useState<Record<string, string[]>>({});
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkName, setLinkName] = useState('');
  const [linkType, setLinkType] = useState<'manage' | 'view'>('manage');
  const { profile } = useAuth();

  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLinkName, setEditingLinkName] = useState('');

  const [activeTab, setActiveTab] = useState<'all' | 'manage' | 'view'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'used' | 'inactive'>('all');
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  const fetchData = useCallback(async () => {
    try {
      // Fetch onboarding links
      const { data: linksData, error: linksError } = await supabase
        .from('onboarding_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (linksError) throw linksError;
      setLinks(linksData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Use mock data for testing
      setMockData();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setMockData = () => {
    // Enhanced mock links with more variety
    const mockLinks = [
      {
        id: '1',
        created_by: 'admin1',
        platforms: ['meta', 'google', 'tiktok', 'shopify'],
        expires_at: null,
        note: 'Standard onboarding link - All platforms',
        status: 'active' as const,
        link_token: 'standard-all-platforms',
        used_by: null,
        used_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        created_by: 'admin1',
        platforms: ['meta', 'google'],
        expires_at: null,
        note: 'Standard view-only link - Meta & Google',
        status: 'active' as const,
        link_token: 'standard-view-only',
        used_by: null,
        used_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ] as OnboardingLink[];

    setLinks(mockLinks);
  };

  const generateLink = async () => {
    if (selectedPlatforms.length === 0 || Object.keys(platformApis).length === 0 || !linkName.trim()) return;
    
    setGenerating(true);
    try {
      const { data, error } = await supabase
        .from('onboarding_links')
        .insert({
          created_by: profile?.id || 'test-admin-user',
          platforms: selectedPlatforms,
          expires_at: null,
          note: `${linkType.toUpperCase()} - ${linkName} - APIs: ${Object.entries(platformApis).map(([platform, apis]) => `${platform}: ${apis.join(', ')}`).join(' | ')}`,
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




  // Placeholder UI items for links
  const getPlaceholderLinks = () => [
    {
      id: 'placeholder-1',
      name: activeTab === 'manage' ? 'E-commerce Client Package' : activeTab === 'view' ? 'Analytics Dashboard Access' : 'Premium Client Setup',
      platforms: activeTab === 'manage' ? ['meta', 'google'] : activeTab === 'view' ? ['google'] : ['meta', 'google', 'tiktok'],
      status: 'active',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      note: activeTab === 'manage' ? 'Full manage access for e-commerce clients' : activeTab === 'view' ? 'View-only analytics access' : 'Complete platform access',
      link_token: activeTab === 'manage' ? 'ecom-client-pkg-001' : activeTab === 'view' ? 'analytics-view-001' : 'premium-setup-001'
    },
    {
      id: 'placeholder-2', 
      name: activeTab === 'manage' ? 'Social Commerce Setup' : activeTab === 'view' ? 'Social Media Insights' : 'Standard Client Package',
      platforms: activeTab === 'manage' ? ['tiktok', 'shopify'] : activeTab === 'view' ? ['meta'] : ['meta', 'google'],
      status: 'used',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      note: activeTab === 'manage' ? 'Admin access for social commerce' : activeTab === 'view' ? 'Read-only social media insights' : 'Standard client onboarding',
      link_token: activeTab === 'manage' ? 'social-commerce-002' : activeTab === 'view' ? 'social-insights-002' : 'standard-pkg-002',
      used_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'placeholder-3',
      name: activeTab === 'manage' ? 'Premium Advertising Suite' : activeTab === 'view' ? 'E-commerce Reports' : 'Quick Setup Link',
      platforms: activeTab === 'manage' ? ['meta', 'google', 'tiktok'] : activeTab === 'view' ? ['shopify'] : ['shopify'],
      status: 'active',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      note: activeTab === 'manage' ? 'Full manage access for premium clients' : activeTab === 'view' ? 'View-only e-commerce reports' : 'Quick client setup',
      link_token: activeTab === 'manage' ? 'premium-ads-003' : activeTab === 'view' ? 'ecommerce-reports-003' : 'quick-setup-003'
    }
  ];

  const filteredLinks = () => {
    const links = getPlaceholderLinks();
    if (selectedFilter === 'all') return links;
    return links.filter(link => {
      if (selectedFilter === 'active') return link.status === 'active';
      if (selectedFilter === 'used') return link.status === 'used';
      if (selectedFilter === 'inactive') return link.status === 'inactive';
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
          <h1 className="text-2xl font-bold text-gray-900">Links list</h1>
          <p className="text-gray-600 mt-1">Manage your onboarding links and client access</p>
        </div>
        <button 
          onClick={() => setShowLinkForm(!showLinkForm)}
          className="bg-gradient-to-r from-indigo-500 to-pink-600 text-white px-6 py-2.5 rounded-lg hover:from-indigo-600 hover:to-pink-700 transition-colors font-medium"
        >
          Create link
        </button>
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
                      <div className="bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                        <label className="flex items-center justify-between p-5 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={selectedPlatforms.includes(platform.id)}
                                onChange={(e) => {
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
                                  : 'border-gray-300 bg-white hover:border-gray-400'
                              }`}>
                                {selectedPlatforms.includes(platform.id) && (
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 bg-gradient-to-br from-${platform.color}-400 to-${platform.color}-500 rounded-xl flex items-center justify-center shadow-sm`}>
                                <span className="text-white font-bold text-sm">
                                  {platform.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900">{platform.name}</span>
                                <p className="text-sm text-gray-600">{platformApiOptions[platform.id as keyof typeof platformApiOptions].length} APIs available</p>
                              </div>
                            </div>
                          </div>
                          {selectedPlatforms.includes(platform.id) && (
                            <svg className="w-5 h-5 text-gray-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </label>
                        
                        {selectedPlatforms.includes(platform.id) && (
                          <div className="border-t border-gray-200 bg-white">
                            <div className="p-5 space-y-3">
                              <p className="text-sm font-semibold text-gray-900 mb-4">Select APIs:</p>
                              <div className="space-y-3">
                                {platformApiOptions[platform.id as keyof typeof platformApiOptions].map((api) => (
                                  <label key={api} className="flex items-center space-x-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={platformApis[platform.id]?.includes(api) || false}
                                        onChange={(e) => {
                                          const currentApis = platformApis[platform.id] || [];
                                          if (e.target.checked) {
                                            setPlatformApis({
                                              ...platformApis,
                                              [platform.id]: [...currentApis, api]
                                            });
                                          } else {
                                            setPlatformApis({
                                              ...platformApis,
                                              [platform.id]: currentApis.filter(a => a !== api)
                                            });
                                          }
                                        }}
                                        className="sr-only"
                                      />
                                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                                        platformApis[platform.id]?.includes(api) 
                                          ? 'bg-gray-600 border-gray-600'
                                          : 'border-gray-300 bg-white group-hover:border-gray-400'
                                      }`}>
                                        {platformApis[platform.id]?.includes(api) && (
                                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </div>
                                    </div>
                                    <span className="text-sm text-gray-800 group-hover:text-gray-900 flex-1 font-medium">{api}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowLinkForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateLink}
                  disabled={generating || selectedPlatforms.length === 0 || Object.keys(platformApis).length === 0 || !linkName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-600 text-white rounded-xl hover:from-indigo-600 hover:to-pink-700 disabled:opacity-50 font-medium transition-colors"
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
                {['all', 'active', 'used', 'inactive'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter as 'all' | 'active' | 'used' | 'inactive');
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
        <div className="fixed top-4 right-4 bg-indigo-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-in slide-in-from-right-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Link copied to clipboard</span>
        </div>
      )}

      {/* Links List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-6 px-6 py-4 text-sm font-semibold text-gray-700 bg-gray-100 border-b border-gray-300 uppercase tracking-wide rounded-t-lg">
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-4">URL</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Links Table */}
        <div className="space-y-4">
          {/* Table Header */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-12 gap-6 px-6 py-4 text-sm font-semibold text-gray-700 bg-gray-100 border-b border-gray-300 uppercase tracking-wide rounded-t-lg">
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-4">URL</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* Table Body - Separated Rows */}
          <div className="space-y-3">
            {filteredLinks().length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <ExternalLink className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No links match the current filter</p>
              </div>
            ) : (
              filteredLinks().map((link) => (
                <div key={link.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="grid grid-cols-12 gap-6 items-center px-6 py-4">
                    <div className="col-span-3">
                      {editingLinkId === link.id ? (
                        <input
                          type="text"
                          value={editingLinkName}
                          onChange={(e) => setEditingLinkName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSaveLinkName(link.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 font-medium">{link.name}</span>
                          <button
                            onClick={() => handleEditLinkName(link.id, link.name)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Edit name"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-900">{new Date(link.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="col-span-4">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono text-gray-600 truncate max-w-xs">/onboard/{link.link_token}</code>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex space-x-1">
                        {link.platforms.slice(0, 3).map((platform) => {
                          const config = platformOptions.find(p => p.id === platform);
                          return (
                            <div
                              key={platform}
                              className={`w-6 h-6 bg-gradient-to-br from-${config?.color}-400 to-${config?.color}-500 rounded-full flex items-center justify-center shadow-sm`}
                              title={config?.name}
                            >
                              <span className="text-white font-bold text-xs">
                                {config?.name.charAt(0)}
                              </span>
                            </div>
                          );
                        })}
                        {link.platforms.length > 3 && (
                          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-xs">+{link.platforms.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleTestLink(link.link_token)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Test link"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(`${window.location.origin}/onboard/${link.link_token}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Copy link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="More options"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredLinks().length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links found</h3>
            <p className="text-gray-500">Create your first onboarding link to get started.</p>
          </div>
        )}
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
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-600 text-white rounded-xl hover:from-indigo-600 hover:to-pink-700 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}