// Meta Access Request Options and Utilities

export interface MetaAccessRequestOption {
  id: string;
  name: string;
  description: string;
  scopes: string[];
  enabled: boolean;
  category: string;
}

export const META_ACCESS_REQUEST_OPTIONS: MetaAccessRequestOption[] = [
  {
    id: 'pages_read_engagement',
    name: 'Pages Read Engagement',
    description: 'Read page posts and comments',
    scopes: ['pages_read_engagement'],
    enabled: true,
    category: 'Pages'
  },
  {
    id: 'pages_manage_posts',
    name: 'Pages Manage Posts',
    description: 'Create, edit, and delete page posts',
    scopes: ['pages_manage_posts'],
    enabled: true,
    category: 'Pages'
  },
  {
    id: 'pages_show_list',
    name: 'Pages Show List',
    description: 'Access the list of pages the user manages',
    scopes: ['pages_show_list'],
    enabled: true,
    category: 'Pages'
  },
  {
    id: 'ads_read',
    name: 'Ads Read',
    description: 'Read ads and ad insights',
    scopes: ['ads_read'],
    enabled: true,
    category: 'Ads'
  },
  {
    id: 'ads_management',
    name: 'Ads Management',
    description: 'Create, edit, and delete ads',
    scopes: ['ads_management'],
    enabled: true,
    category: 'Ads'
  },
  {
    id: 'business_management',
    name: 'Business Management',
    description: 'Manage business assets and permissions',
    scopes: ['business_management'],
    enabled: true,
    category: 'Business'
  },
  {
    id: 'instagram_basic',
    name: 'Instagram Basic',
    description: 'Access Instagram basic profile information',
    scopes: ['instagram_basic'],
    enabled: true,
    category: 'Instagram'
  },
  {
    id: 'instagram_content_publish',
    name: 'Instagram Content Publish',
    description: 'Publish content to Instagram',
    scopes: ['instagram_content_publish'],
    enabled: true,
    category: 'Instagram'
  }
];

export function getEnabledMetaScopes(): string[] {
  const enabledOptions = META_ACCESS_REQUEST_OPTIONS.filter(option => option.enabled);
  const allScopes = enabledOptions.flatMap(option => option.scopes);
  return [...new Set(allScopes)]; // Remove duplicates
}

export function getScopesForSelectedOptions(selectedOptionIds: string[]): string[] {
  const selectedOptions = META_ACCESS_REQUEST_OPTIONS.filter(option => 
    selectedOptionIds.includes(option.id)
  );
  const scopes = selectedOptions.flatMap(option => option.scopes);
  return [...new Set(scopes)]; // Remove duplicates
}

export function encodeSelectedOptionsState(selectedOptionIds: string[]): string {
  return btoa(JSON.stringify(selectedOptionIds));
}

export function decodeSelectedOptionsState(encodedState: string): string[] {
  try {
    return JSON.parse(atob(encodedState));
  } catch (error) {
    console.error('Failed to decode selected options state:', error);
    return [];
  }
}
