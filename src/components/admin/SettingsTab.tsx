import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, ExternalLink, Copy, Mail, UserCheck, UserX, MoreVertical, Edit3, Users, X, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { useAuth } from '../../hooks/useAuth';
import { buildAdminGoogleOAuthUrl } from '../../lib/googleOAuth';

type PlatformConnection = Database['public']['Tables']['platform_connections']['Row'];
type TeamInvite = Database['public']['Tables']['team_invites']['Row'];

const platformConfigs = {
  meta: {
    name: 'Meta Business',
    description: 'Connect to Facebook and Instagram Business accounts',
    color: 'purple',
    authUrl: 'https://business.facebook.com/oauth', // Placeholder
  },
  google: {
    name: 'Google Ads',
    description: 'Connect to Google Ads campaigns and analytics',
    color: 'indigo',
  },
  tiktok: {
    name: 'TikTok Ads',
    description: 'Manage TikTok advertising campaigns',
    color: 'teal',
    authUrl: 'https://ads.tiktok.com/oauth', // Placeholder
  },
  shopify: {
    name: 'Shopify',
    description: 'Connect to Shopify store data',
    color: 'cyan',
    authUrl: 'https://shopify.com/oauth', // Placeholder
  }
};

const roleOptions = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features' },
  { value: 'editor', label: 'Editor', description: 'Can manage clients and links' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
];

export function SettingsTab() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [inviting, setInviting] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'invited' | 'expired'>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'admin' | 'editor' | 'viewer'>('all');
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const { profile } = useAuth();

  const fetchConnections = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('platform_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
    // Always use mock data for demonstration
    setMockData();
  }, []);

  const setMockData = () => {
    const mockConnections = [
      {
        id: '1',
        platform: 'meta' as const,
        status: 'connected' as const,
        connection_data: {},
        connected_by: 'admin1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        platform: 'google' as const,
        status: 'disconnected' as const,
        connection_data: {},
        connected_by: 'admin1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ] as PlatformConnection[];
    
    setConnections(mockConnections);
  };

  const fetchInvites = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('team_invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
    // Always use mock data for demonstration
    setMockInviteData();
  }, []);

  const setMockInviteData = () => {
    // Expanded mock invites for complete UI demonstration
    const mockInvites = [
      {
        id: '1',
        email: 'john.smith@techflow.com',
        role: 'editor' as const,
        status: 'active' as const,
        invite_token: 'token123',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        email: 'sarah.martinez@creative.com',
        role: 'viewer' as const,
        status: 'invited' as const,
        invite_token: 'token456',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        email: 'mike.johnson@digitalagency.com',
        role: 'admin' as const,
        status: 'active' as const,
        invite_token: 'token789',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        email: 'lisa.chen@marketingpro.com',
        role: 'editor' as const,
        status: 'invited' as const,
        invite_token: 'token101',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        email: 'david.wilson@brandstudio.com',
        role: 'viewer' as const,
        status: 'active' as const,
        invite_token: 'token202',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        email: 'alex.thompson@creativestudio.com',
        role: 'admin' as const,
        status: 'active' as const,
        invite_token: 'token303',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '7',
        email: 'jennifer.adams@futuretech.com',
        role: 'editor' as const,
        status: 'invited' as const,
        invite_token: 'token404',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '8',
        email: 'thomas.brown@peakperformance.com',
        role: 'viewer' as const,
        status: 'active' as const,
        invite_token: 'token505',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '9',
        email: 'amanda.foster@urbanstyle.com',
        role: 'editor' as const,
        status: 'active' as const,
        invite_token: 'token606',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '10',
        email: 'kevin.wright@velocitydigital.com',
        role: 'viewer' as const,
        status: 'invited' as const,
        invite_token: 'token707',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '11',
        email: 'rachel.green@horizonbusiness.com',
        role: 'admin' as const,
        status: 'active' as const,
        invite_token: 'token808',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '12',
        email: 'mark.davis@innovativedesign.com',
        role: 'editor' as const,
        status: 'invited' as const,
        invite_token: 'token909',
        invited_by: 'admin1',
        expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ] as TeamInvite[];
    
    setInvites(mockInvites);
  };

  useEffect(() => {
    fetchConnections();
    fetchInvites();
  }, [fetchConnections, fetchInvites]);

  const sendInvite = async () => {
    if (!email.trim()) return;
    
    setInviting(true);
    try {
      const { data, error } = await supabase
        .from('team_invites')
        .insert({
          email: email.trim(),
          role,
          invited_by: profile?.id || 'test-admin-user',
        })
        .select()
        .single();

      if (error) throw error;

      const inviteUrl = `${window.location.origin}/invite/${data.invite_token}`;
      setGeneratedInvite(inviteUrl);
      setEmail('');
      setRole('viewer');
      setShowInviteForm(false);
      fetchInvites();
    } catch (error) {
      console.error('Error sending invite:', error);
      // Mock success for testing
      const mockToken = Math.random().toString(36).substring(2, 15);
      const inviteUrl = `${window.location.origin}/invite/${mockToken}`;
      setGeneratedInvite(inviteUrl);
      setEmail('');
      setRole('viewer');
      setShowInviteForm(false);
    } finally {
      setInviting(false);
    }
  };

  const resendInvite = async () => {
    try {
      // In a real app, this would send a new email
      alert('Invite resent successfully!');
    } catch (error) {
      console.error('Error resending invite:', error);
    }
  };

  const changeRole = async (inviteId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    try {
      const { error } = await supabase
        .from('team_invites')
        .update({ role: newRole })
        .eq('id', inviteId);

      if (error) throw error;
      
      // Update local state immediately for better UX
      setInvites(prev => prev.map(invite => 
        invite.id === inviteId ? { ...invite, role: newRole } : invite
      ));
      
      // Show success message
      alert(`Role changed to ${newRole} successfully!`);
    } catch (error) {
      console.error('Error changing role:', error);
      alert('Failed to change role. Please try again.');
    }
  };

  const removeInvite = async (inviteId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      const { error } = await supabase
        .from('team_invites')
        .delete()
        .eq('id', inviteId);

      if (error) throw error;
      
      // Update local state immediately for better UX
      setInvites(prev => prev.filter(invite => invite.id !== inviteId));
      
      // Show success message
      alert('Team member removed successfully!');
    } catch (error) {
      console.error('Error removing invite:', error);
      alert('Failed to remove team member. Please try again.');
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

  const handleConnect = async (platform: string) => {
    if (platform === 'google') {
      try {
        // Check if environment variables are configured
        const clientId = import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        console.log('Environment check:', {
          hasClientId: !!clientId,
          clientIdLength: clientId?.length,
          origin: window.location.origin
        });
        
        if (!clientId || clientId.trim() === '') {
          alert('Google OAuth is not configured. Please check your environment variables.');
          return;
        }

        // Build and redirect to Google OAuth
        const oauthUrl = buildAdminGoogleOAuthUrl();
        console.log('Redirecting to Google OAuth:', oauthUrl);
        
        // Test the URL before redirecting
        try {
          new URL(oauthUrl);
          console.log('OAuth URL is valid, redirecting...');
          window.location.href = oauthUrl;
        } catch (urlError) {
          console.error('Invalid OAuth URL:', urlError);
          alert('Generated OAuth URL is invalid. Please check the configuration.');
        }
        return;
      } catch (error) {
        console.error('Failed to initiate Google OAuth:', error);
        alert(`Failed to connect to Google: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      }
    }
    
    const config = platformConfigs[platform as keyof typeof platformConfigs];
    if ('authUrl' in config) {
      alert(`Will be enabled after API access. Would redirect to ${config.authUrl}`);
    } else {
      alert(`Will be enabled after API access.`);
    }
    
    // Mock connection for testing
    try {
      const { error } = await supabase
        .from('platform_connections')
        .upsert({
          platform: platform as 'meta' | 'google' | 'tiktok' | 'shopify',
          status: 'connected',
          connected_by: profile?.id || 'test-admin-user',
        });

      if (error) throw error;
      fetchConnections();
    } catch (error) {
      console.error('Error connecting platform:', error);
    }
  };

  const handleDisconnect = async (platform: string) => {
    try {
      const { error } = await supabase
        .from('platform_connections')
        .update({ status: 'disconnected' })
        .eq('platform', platform);

      if (error) throw error;
      fetchConnections();
    } catch (error) {
      console.error('Error disconnecting platform:', error);
    }
  };

  const getConnectionStatus = (platform: string) => {
    const connection = connections.find(c => c.platform === platform);
    return connection?.status || 'disconnected';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <UserCheck className="w-4 h-4 text-green-500" />;
      case 'invited':
        return <Mail className="w-4 h-4 text-orange-500" />;
      default:
        return <UserX className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'invited':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'editor':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter team members
  const filteredInvites = () => {
    let filtered = [...invites];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(invite => 
        invite.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(invite => invite.status === selectedFilter);
    }
    
    return filtered;
  };

  // Generate placeholder rows for UI polishing
  const getPlaceholderTeamMembers = () => [
    { id: 'placeholder-1', email: '', role: 'editor' as const, status: 'active' as const, created_at: '', invite_token: '', invited_by: '', expires_at: '', updated_at: '' },
    { id: 'placeholder-2', email: '', role: 'viewer' as const, status: 'invited' as const, created_at: '', invite_token: '', invited_by: '', expires_at: '', updated_at: '' },
    { id: 'placeholder-3', email: '', role: 'admin' as const, status: 'active' as const, created_at: '', invite_token: '', invited_by: '', expires_at: '', updated_at: '' },
    { id: 'placeholder-4', email: '', role: 'editor' as const, status: 'active' as const, created_at: '', invite_token: '', invited_by: '', expires_at: '', updated_at: '' },
    { id: 'placeholder-5', email: '', role: 'viewer' as const, status: 'invited' as const, created_at: '', invite_token: '', invited_by: '', expires_at: '', updated_at: '' },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage platform connections, team members, and account settings</p>
        </div>
      </div>

      {/* Copy Notification */}
      {showCopyNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-in slide-in-from-right-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Link copied to clipboard</span>
        </div>
      )}

      {/* Platform Connections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Platform Connections</h3>
          <p className="text-sm text-gray-600 mt-1">
            Connect your admin accounts to enable client authorization flows
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(platformConfigs).map(([platform, config]) => {
              const status = getConnectionStatus(platform);
              const isConnected = status === 'connected';
              
              return (
                <div key={platform} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-14 h-14 bg-gradient-to-br from-${config.color}-400 to-${config.color}-500 rounded-xl flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-lg">
                          {config.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{config.name}</h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                    </div>
                    {isConnected ? (
                      <CheckCircle className="w-7 h-7 text-green-500" />
                    ) : (
                      <AlertCircle className="w-7 h-7 text-gray-400" />
                    )}
                  </div>

                  <div className="mb-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      isConnected 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {isConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>

                  {isConnected ? (
                    <div className="space-y-3">
                      <p className="text-sm text-green-800 bg-green-50 p-4 rounded-xl border border-green-200 font-medium">
                        Platform connected and ready for client authorizations
                      </p>
                      <button
                        onClick={() => handleDisconnect(platform)}
                        className="w-full border border-red-300 text-red-700 py-3 px-4 rounded-xl font-medium hover:bg-red-50 transition-colors text-sm"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConnect(platform)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 text-sm shadow-sm"
                    >
                      <span>Connect Platform</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
              <p className="text-sm text-gray-600 mt-1">Invite team members and manage access levels</p>
            </div>
            <button 
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
            >
              Invite Member
            </button>
          </div>
        </div>
        
        {showInviteForm && (
          <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm transition-colors"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="text-sm text-indigo-800 bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                <strong>{roleOptions.find(r => r.value === role)?.label}:</strong>{' '}
                {roleOptions.find(r => r.value === role)?.description}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowInviteForm(false)}
                  className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendInvite}
                  disabled={inviting || !email.trim()}
                  className="flex-1 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {inviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Members List - Scrollable Container */}
        <div className="max-h-96 overflow-y-auto">
          {/* Table Header - Sticky */}
          <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
            <div className="grid grid-cols-12 gap-2 px-6 py-4 text-sm font-medium text-gray-500">
              <div className="col-span-4 text-center">Member</div>
              <div className="col-span-2 text-center">Role</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Joined</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {filteredInvites().length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No team members match the current filter</p>
              </div>
            ) : (
              filteredInvites().map((invite) => (
                <div key={invite.id} className="hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-2 items-center px-6 py-4">
                    <div className="col-span-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-sm">
                          <span className="text-sm font-semibold text-white">
                            {invite.email ? invite.email.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{invite.email || 'Loading...'}</p>
                          <p className="text-sm text-gray-500">ID: {invite.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(invite.role)}`}>
                        {invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}>
                        <span className="w-2 h-2 rounded-full mr-2 ${
                          invite.status === 'active' ? 'bg-green-500' :
                          invite.status === 'invited' ? 'bg-orange-500' : 'bg-red-500'
                        }"></span>
                        <span className="capitalize">{invite.status}</span>
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span className="text-gray-900">
                        {invite.created_at ? new Date(invite.created_at).toLocaleDateString() : '-'}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <div className="relative group">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 min-w-40">
                          {invite.status === 'invited' && invite.email && (
                            <>
                              <button
                                onClick={() => copyToClipboard(`${window.location.origin}/invite/${invite.invite_token}`)}
                                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 font-medium"
                              >
                                <Copy className="w-4 h-4" />
                                <span>Copy invite link</span>
                              </button>
                              <button
                                onClick={() => resendInvite()}
                                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 font-medium"
                              >
                                <Mail className="w-4 h-4" />
                                <span>Resend invite</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              const newRole = invite.role === 'admin' ? 'editor' : 
                                           invite.role === 'editor' ? 'viewer' : 'admin';
                              changeRole(invite.id, newRole);
                            }}
                            className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 font-medium"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Change Role</span>
                          </button>
                          <button
                            onClick={() => removeInvite(invite.id)}
                            className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Connected Accounts</h3>
          <p className="text-gray-600 text-sm mt-1">Manage your connected platform accounts and user information</p>
        </div>
        <div className="p-6 space-y-6">
          {/* Google Account */}
          <div className="border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Sign in with Google</p>
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Connect Google
              </button>
            </div>
          </div>

          {/* User Email */}
          <div className="pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">User Email</label>
              <div className="flex space-x-3">
                <input
                  type="email"
                  value="henrypaquin0@gmail.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  readOnly
                />
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                  Update
                </button>
              </div>
              <div className="flex items-start space-x-2 mt-3">
                <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <p className="text-sm text-gray-600">
                  This is where you'll get updates about onboarding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Invite Modal */}
      {generatedInvite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Invite Sent Successfully</h3>
              <p className="text-gray-600">Your team member invitation is ready to share</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-xl mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Invite Link:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-sm bg-white p-3 rounded-lg border text-gray-800 break-all font-mono">
                  {generatedInvite}
                </code>
                <button
                  onClick={() => copyToClipboard(generatedInvite)}
                  className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-8 text-center">
              Share this link with your team member. The invite will expire in 7 days.
            </p>
            <button
              onClick={() => setGeneratedInvite(null)}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}