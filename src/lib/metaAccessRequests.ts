// Meta Access Request Options and Configuration
export interface MetaAccessRequestOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scopes: string[];
  category: 'ads' | 'pages' | 'instagram' | 'catalog' | 'dataset';
}

export const META_ACCESS_REQUEST_OPTIONS: MetaAccessRequestOption[] = [
  {
    id: 'ad_account',
    name: 'Ad Account',
    description: 'Access to manage Facebook and Instagram ad campaigns',
    enabled: true,
    scopes: ['ads_read', 'ads_management'],
    category: 'ads'
  },
  {
    id: 'page_all_permissions',
    name: 'Page (All Permissions)',
    description: 'Full access to manage Facebook Pages, posts, and insights',
    enabled: true,
    scopes: [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'pages_manage_metadata',
      'pages_read_user_content',
      'pages_manage_events',
      'pages_manage_instant_articles',
      'pages_manage_cta',
      'pages_manage_lead_ads',
      'pages_manage_ads',
      'pages_manage_metadata',
      'pages_read_engagement',
      'pages_manage_posts',
      'pages_manage_instant_articles',
      'pages_manage_cta',
      'pages_manage_lead_ads',
      'pages_manage_ads'
    ],
    category: 'pages'
  },
  {
    id: 'instagram_account',
    name: 'Instagram Account',
    description: 'Access to manage Instagram Business accounts and content',
    enabled: false, // Disabled for now - coming later
    scopes: ['instagram_basic', 'instagram_manage_insights', 'instagram_manage_comments'],
    category: 'instagram'
  },
  {
    id: 'catalog',
    name: 'Catalog',
    description: 'Access to manage product catalogs for Facebook and Instagram Shopping',
    enabled: false, // Disabled for now - coming later
    scopes: ['catalog_management'],
    category: 'catalog'
  },
  {
    id: 'dataset',
    name: 'Dataset',
    description: 'Access to manage datasets for advanced analytics and custom audiences',
    enabled: false, // Disabled for now - coming later
    scopes: ['business_management'],
    category: 'dataset'
  }
];

// Get enabled access request options
export function getEnabledMetaAccessRequestOptions(): MetaAccessRequestOption[] {
  return META_ACCESS_REQUEST_OPTIONS.filter(option => option.enabled);
}

// Get all scopes for enabled options
export function getEnabledMetaScopes(): string[] {
  const enabledOptions = getEnabledMetaAccessRequestOptions();
  const allScopes = enabledOptions.flatMap(option => option.scopes);
  // Remove duplicates
  return [...new Set(allScopes)];
}

// Get access request options by category
export function getMetaAccessRequestOptionsByCategory(category: MetaAccessRequestOption['category']): MetaAccessRequestOption[] {
  return META_ACCESS_REQUEST_OPTIONS.filter(option => option.category === category);
}

// Check if a specific option is enabled
export function isMetaAccessRequestOptionEnabled(optionId: string): boolean {
  const option = META_ACCESS_REQUEST_OPTIONS.find(opt => opt.id === optionId);
  return option ? option.enabled : false;
}

// Get option by ID
export function getMetaAccessRequestOption(optionId: string): MetaAccessRequestOption | undefined {
  return META_ACCESS_REQUEST_OPTIONS.find(opt => opt.id === optionId);
}
