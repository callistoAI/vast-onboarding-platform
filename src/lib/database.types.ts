export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          role: 'admin' | 'client'
          name: string
          created_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'client'
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'client'
          name?: string
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          company_name: string
          link_token: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          link_token?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          link_token?: string
          created_at?: string
        }
      }
      authorizations: {
        Row: {
          id: string
          client_id: string
          platform: 'meta' | 'google' | 'tiktok' | 'shopify'
          status: 'pending' | 'authorized'
          scopes: string[]
          token_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          platform: 'meta' | 'google' | 'tiktok' | 'shopify'
          status?: 'pending' | 'authorized'
          scopes?: string[]
          token_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          platform?: 'meta' | 'google' | 'tiktok' | 'shopify'
          status?: 'pending' | 'authorized'
          scopes?: string[]
          token_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      onboarding_links: {
        Row: {
          id: string
          created_by: string
          platforms: string[]
          expires_at: string | null
          note: string | null
          status: 'active' | 'expired' | 'used'
          link_token: string
          used_by: string | null
          used_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_by: string
          platforms?: string[]
          expires_at?: string | null
          note?: string | null
          status?: 'active' | 'expired' | 'used'
          link_token?: string
          used_by?: string | null
          used_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          platforms?: string[]
          expires_at?: string | null
          note?: string | null
          status?: 'active' | 'expired' | 'used'
          link_token?: string
          used_by?: string | null
          used_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_invites: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'editor' | 'viewer'
          status: 'invited' | 'active' | 'expired'
          invite_token: string
          invited_by: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'admin' | 'editor' | 'viewer'
          status?: 'invited' | 'active' | 'expired'
          invite_token?: string
          invited_by: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'editor' | 'viewer'
          status?: 'invited' | 'active' | 'expired'
          invite_token?: string
          invited_by?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          title: string
          brand_colors: Json
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string
          brand_colors?: Json
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          brand_colors?: Json
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      platform_connections: {
        Row: {
          id: string
          platform: 'meta' | 'google' | 'tiktok' | 'shopify'
          status: 'connected' | 'disconnected' | 'error'
          connection_data: Json
          connected_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: 'meta' | 'google' | 'tiktok' | 'shopify'
          status?: 'connected' | 'disconnected' | 'error'
          connection_data?: Json
          connected_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: 'meta' | 'google' | 'tiktok' | 'shopify'
          status?: 'connected' | 'disconnected' | 'error'
          connection_data?: Json
          connected_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}