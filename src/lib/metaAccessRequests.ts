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
    scopes: ['business_management', 'ads_read'],
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
      'pages_manage_metadata'
    ],
    category: 'pages'
  },
  {
    id: 'instagram_account',
    name: 'Instagram Account',
    description: 'Access to manage Instagram Business accounts and content',
    enabled: false, // Disabled for now - coming later
    scopes: ['instagram_basic', 'pages_show_list'], // pages_show_list needed to traverse Page→IG
    category: 'instagram'
  },
  {
    id: 'catalog',
    name: 'Catalog',
    description: 'Access to manage product catalogs for Facebook and Instagram Shopping',
    enabled: false, // Disabled for now - coming later
    scopes: ['ads_management'], // Only if supporting management, otherwise keep disabled
    category: 'catalog'
  },
  {
    id: 'dataset',
    name: 'Dataset',
    description: 'Access to manage datasets for advanced analytics and custom audiences',
    enabled: false, // Disabled for now - coming later
    scopes: ['ads_management'], // Only if supporting management, otherwise keep disabled
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

// Get scopes for selected access request options
export function getScopesForSelectedOptions(selectedOptions: string[]): string[] {
  const scopes = selectedOptions
    .map(optionId => {
      const option = getMetaAccessRequestOption(optionId);
      return option?.enabled ? option.scopes : [];
    })
    .flat();
  
  // Remove duplicates and return
  return [...new Set(scopes)];
}

// Encode selected options into state for OAuth
export function encodeSelectedOptionsState(selectedOptions: string[]): string {
  const stateObject = {
    ad: selectedOptions.includes('ad_account'),
    page: selectedOptions.includes('page_all_permissions'),
    instagram: selectedOptions.includes('instagram_account'),
    catalog: selectedOptions.includes('catalog'),
    dataset: selectedOptions.includes('dataset')
  };
  
  return btoa(JSON.stringify(stateObject));
}

// Decode state back to selected options
export function decodeSelectedOptionsState(encodedState: string): string[] {
  try {
    const stateObject = JSON.parse(atob(encodedState));
    const selectedOptions: string[] = [];
    
    if (stateObject.ad) selectedOptions.push('ad_account');
    if (stateObject.page) selectedOptions.push('page_all_permissions');
    if (stateObject.instagram) selectedOptions.push('instagram_account');
    if (stateObject.catalog) selectedOptions.push('catalog');
    if (stateObject.dataset) selectedOptions.push('dataset');
    
    return selectedOptions;
  } catch (error) {
    console.error('Failed to decode state:', error);
    return [];
  }
}

// Build Meta OAuth URL for client flow with selected options
export function buildClientMetaOAuthUrlWithOptions(
  onboardingToken: string, 
  selectedOptions: string[]
): string {
  const clientId = import.meta.env.VITE_NEXT_PUBLIC_META_APP_ID;
  const redirectUri = `${window.location.origin}/oauth/meta/client/callback`;
  
  if (!clientId || clientId.trim() === '') {
    throw new Error('Meta App ID not configured. Please set VITE_NEXT_PUBLIC_META_APP_ID environment variable.');
  }
  
  // Get scopes for selected options
  const scopes = getScopesForSelectedOptions(selectedOptions);
  
  // Encode selected options into state
  const encodedState = encodeSelectedOptionsState(selectedOptions);
  const state = `${onboardingToken}|${encodedState}`;
  
  // Debug logging (non-sensitive)
  console.log('Meta OAuth Client Flow with Options:', { 
    clientId: clientId.substring(0, 10) + '...', 
    redirectUri,
    selectedOptions,
    scopes,
    state: state.substring(0, 20) + '...'
  });
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(','),
    state: state
  });

  return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;
}
