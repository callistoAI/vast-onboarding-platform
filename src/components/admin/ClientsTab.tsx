import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type Client = Database['public']['Tables']['clients']['Row'] & {
  users: Database['public']['Tables']['users']['Row'];
  authorizations: Database['public']['Tables']['authorizations']['Row'][];
};

const platformOptions = [
  { id: 'meta', name: 'Meta Business', color: 'purple' },
  { id: 'google', name: 'Google Ads', color: 'indigo' },
  { id: 'tiktok', name: 'TikTok Ads', color: 'teal' },
  { id: 'shopify', name: 'Shopify', color: 'cyan' }
];

export function ClientsTab() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [clientSortOrder, setClientSortOrder] = useState<'latest' | 'earliest'>('latest');

  const fetchClients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          users(*),
          authorizations(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
    // Always use mock data for demonstration
    setMockData();
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const setMockData = () => {
    // Enhanced mock clients with more variety and realistic data - expanded for complete UI
    const mockClients = [
      {
        id: '1',
        user_id: 'user1',
        company_name: 'TechFlow Solutions',
        link_token: 'token123',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user1',
          role: 'client' as const,
          name: 'Alex Thompson',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth1',
            client_id: '1',
            platform: 'meta' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth2',
            client_id: '1',
            platform: 'google' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth3',
            client_id: '1',
            platform: 'tiktok' as const,
            status: 'pending' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '2',
        user_id: 'user2',
        company_name: 'Creative Marketing Hub',
        link_token: 'token456',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user2',
          role: 'client' as const,
          name: 'Jessica Martinez',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth4',
            client_id: '2',
            platform: 'meta' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth5',
            client_id: '2',
            platform: 'google' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth6',
            client_id: '2',
            platform: 'tiktok' as const,
            status: 'pending' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '3',
        user_id: 'user3',
        company_name: 'Global Retail Partners',
        link_token: 'token789',
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user3',
          role: 'client' as const,
          name: 'Robert Kim',
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth7',
            client_id: '3',
            platform: 'google' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth8',
            client_id: '3',
            platform: 'shopify' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '4',
        user_id: 'user4',
        company_name: 'Digital Dynamics Inc',
        link_token: 'token101',
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user4',
          role: 'client' as const,
          name: 'Sarah Chen',
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth9',
            client_id: '4',
            platform: 'meta' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth10',
            client_id: '4',
            platform: 'google' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth11',
            client_id: '4',
            platform: 'shopify' as const,
            status: 'pending' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '5',
        user_id: 'user5',
        company_name: 'Innovate Labs',
        link_token: 'token202',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user5',
          role: 'client' as const,
          name: 'Michael Rodriguez',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth12',
            client_id: '5',
            platform: 'google' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth13',
            client_id: '5',
            platform: 'tiktok' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '6',
        user_id: 'user6',
        company_name: 'NextGen Commerce',
        link_token: 'token303',
        created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user6',
          role: 'client' as const,
          name: 'Emily Watson',
          created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth14',
            client_id: '6',
            platform: 'meta' as const,
            status: 'pending' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth15',
            client_id: '6',
            platform: 'shopify' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '7',
        user_id: 'user7',
        company_name: 'Bright Future Media',
        link_token: 'token404',
        created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user7',
          role: 'client' as const,
          name: 'David Park',
          created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth16',
            client_id: '7',
            platform: 'meta' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth17',
            client_id: '7',
            platform: 'google' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth18',
            client_id: '7',
            platform: 'tiktok' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '8',
        user_id: 'user8',
        company_name: 'Stellar Brands Co',
        link_token: 'token505',
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user8',
          role: 'client' as const,
          name: 'Lisa Johnson',
          created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth19',
            client_id: '8',
            platform: 'shopify' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth20',
            client_id: '8',
            platform: 'google' as const,
            status: 'pending' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '9',
        user_id: 'user9',
        company_name: 'Quantum Solutions',
        link_token: 'token606',
        created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user9',
          role: 'client' as const,
          name: 'James Wilson',
          created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth21',
            client_id: '9',
            platform: 'meta' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth22',
            client_id: '9',
            platform: 'tiktok' as const,
            status: 'pending' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth23',
            client_id: '9',
            platform: 'shopify' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '10',
        user_id: 'user10',
        company_name: 'Apex Digital Group',
        link_token: 'token707',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user10',
          role: 'client' as const,
          name: 'Maria Garcia',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth24',
            client_id: '10',
            platform: 'google' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth25',
            client_id: '10',
            platform: 'meta' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth26',
            client_id: '10',
            platform: 'tiktok' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '11',
        user_id: 'user11',
        company_name: 'Future Tech Solutions',
        link_token: 'token808',
        created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user11',
          role: 'client' as const,
          name: 'Jennifer Adams',
          created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth27',
            client_id: '11',
            platform: 'meta' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth28',
            client_id: '11',
            platform: 'google' as const,
            status: 'pending' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '12',
        user_id: 'user12',
        company_name: 'Peak Performance Marketing',
        link_token: 'token909',
        created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user12',
          role: 'client' as const,
          name: 'Thomas Brown',
          created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth29',
            client_id: '12',
            platform: 'tiktok' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth30',
            client_id: '12',
            platform: 'shopify' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '13',
        user_id: 'user13',
        company_name: 'Urban Style Collective',
        link_token: 'token1010',
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user13',
          role: 'client' as const,
          name: 'Amanda Foster',
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth31',
            client_id: '13',
            platform: 'meta' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth32',
            client_id: '13',
            platform: 'google' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth33',
            client_id: '13',
            platform: 'tiktok' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth34',
            client_id: '13',
            platform: 'shopify' as const,
            status: 'pending' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '14',
        user_id: 'user14',
        company_name: 'Velocity Digital Agency',
        link_token: 'token1111',
        created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user14',
          role: 'client' as const,
          name: 'Kevin Wright',
          created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth35',
            client_id: '14',
            platform: 'google' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth36',
            client_id: '14',
            platform: 'shopify' as const,
            status: 'pending' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: '15',
        user_id: 'user15',
        company_name: 'Horizon Business Solutions',
        link_token: 'token1212',
        created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
        users: {
          id: 'user15',
          role: 'client' as const,
          name: 'Rachel Green',
          created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
        },
        authorizations: [
          {
            id: 'auth37',
            client_id: '15',
            platform: 'meta' as const,
            status: 'pending' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'auth38',
            client_id: '15',
            platform: 'tiktok' as const,
            status: 'authorized' as const,
            scopes: [],
            token_data: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      }
    ] as Client[];
    
    setClients(mockClients);
  };



  // Filter and sort clients
  const filteredAndSortedClients = () => {
    let filtered = [...clients];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.users.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(client => {
        const authorizedCount = client.authorizations.filter(a => a.status === 'authorized').length;
        const totalCount = client.authorizations.length;
        
        if (selectedFilter === 'active') return authorizedCount === totalCount;
        if (selectedFilter === 'pending') return authorizedCount < totalCount && authorizedCount > 0;
        if (selectedFilter === 'inactive') return authorizedCount === 0;
        return true;
      });
    }
    
    // Apply sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return clientSortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  };



  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">View and manage all your connected clients</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
            >
              <span>Filter: {selectedFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-10">
                {['all', 'active', 'pending', 'inactive'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option as 'all' | 'active' | 'inactive' | 'pending');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedFilter === option
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setClientSortOrder(clientSortOrder === 'latest' ? 'earliest' : 'latest')}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>{clientSortOrder === 'latest' ? 'Latest First' : 'Earliest First'}</span>
            <svg className={`w-4 h-4 transition-transform ${clientSortOrder === 'latest' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {/* Table Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-500 border-b border-gray-100">
            <div className="col-span-3">Company</div>
            <div className="col-span-3">Client</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Platforms</div>
            <div className="col-span-2">Joined</div>
          </div>
        </div>

        {/* Table Body - Separated Rows */}
        <div className="space-y-3">
          {filteredAndSortedClients().length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No clients match the current filter</p>
            </div>
          ) : (
            filteredAndSortedClients().map((client) => (
              <div key={client.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="grid grid-cols-12 gap-4 items-center px-6 py-4">
                  <div className="col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-sm">
                          {client.company_name ? client.company_name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{client.company_name || 'Loading...'}</h4>
                        <p className="text-sm text-gray-500">ID: {client.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div>
                      <p className="font-medium text-gray-900">{client.users?.name || 'Loading...'}</p>
                      <p className="text-sm text-gray-500">
                        {client.users?.name ? `${client.users.name.toLowerCase().replace(' ', '.')}@company.com` : 'Loading...'}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      ['1', '3', '5', '7', '9', '11', '13', '15'].includes(client.id)
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : ['2', '4', '6', '8'].includes(client.id)
                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {['1', '3', '5', '7', '9', '11', '13', '15'].includes(client.id)
                        ? 'Active'
                        : ['2', '4', '6', '8'].includes(client.id)
                        ? 'Pending'
                        : 'Inactive'
                      }
                    </span>
                  </div>
                  <div className="col-span-2 pr-2">
                    <div className="flex space-x-1">
                      {platformOptions.map((platform) => {
                        const auth = client.authorizations?.find?.(a => a.platform === platform.id);
                        return (
                          <div
                            key={platform.id}
                            className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm relative"
                            title={`${platform.name}: ${auth?.status || 'Not connected'}`}
                          >
                            <img 
                              src={`/${platform.id}-logo.svg`} 
                              alt={platform.name}
                              className="w-5 h-5 object-contain"
                            />
                            {auth?.status === 'authorized' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {auth?.status === 'pending' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {client.authorizations?.filter?.(a => a.status === 'authorized').length || 0} of {client.authorizations?.length || 0} connected
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-900">
                      {client.created_at ? new Date(client.created_at).toLocaleDateString() : '-'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}