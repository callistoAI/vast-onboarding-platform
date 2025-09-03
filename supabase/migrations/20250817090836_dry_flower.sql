/*
  # Add Admin Dashboard Features

  1. New Tables
    - `onboarding_links` - Generated links with platform selection and expiry
    - `team_invites` - Team member invitations
    - `admin_settings` - Customization settings
    - `platform_connections` - Admin platform connections

  2. Security
    - Enable RLS on all new tables
    - Add policies for admin-only access

  3. Functions
    - Link generation and management
    - Team invitation system
*/

-- Onboarding Links table
CREATE TABLE IF NOT EXISTS onboarding_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  platforms text[] DEFAULT '{}',
  expires_at timestamptz,
  note text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'used')),
  link_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  used_by uuid REFERENCES clients(id) ON DELETE SET NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team Invites table
CREATE TABLE IF NOT EXISTS team_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  status text DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'expired')),
  invite_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by uuid REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admin Settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT 'ClientHub',
  brand_colors jsonb DEFAULT '{"primary": "#22c55e", "secondary": "#3b82f6"}',
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Platform Connections table
CREATE TABLE IF NOT EXISTS platform_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('meta', 'google', 'tiktok', 'shopify')),
  status text DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  connection_data jsonb DEFAULT '{}',
  connected_by uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(platform)
);

-- Enable RLS
ALTER TABLE onboarding_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for onboarding_links
CREATE POLICY "Admins can manage onboarding links"
  ON onboarding_links
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- RLS Policies for team_invites
CREATE POLICY "Admins can manage team invites"
  ON team_invites
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- RLS Policies for admin_settings
CREATE POLICY "Admins can manage settings"
  ON admin_settings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- RLS Policies for platform_connections
CREATE POLICY "Admins can manage platform connections"
  ON platform_connections
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_onboarding_links_status ON onboarding_links(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_links_created_by ON onboarding_links(created_by);
CREATE INDEX IF NOT EXISTS idx_team_invites_status ON team_invites(status);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON team_invites(email);

-- Insert default admin settings
INSERT INTO admin_settings (title, brand_colors) 
VALUES ('ClientHub', '{"primary": "#22c55e", "secondary": "#3b82f6"}')
ON CONFLICT DO NOTHING;

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_onboarding_links_updated_at 
  BEFORE UPDATE ON onboarding_links 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_invites_updated_at 
  BEFORE UPDATE ON team_invites 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at 
  BEFORE UPDATE ON admin_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_connections_updated_at 
  BEFORE UPDATE ON platform_connections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();