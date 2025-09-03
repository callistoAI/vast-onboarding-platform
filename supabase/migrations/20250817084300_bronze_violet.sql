/*
  # Initial Schema Setup for Client Onboarding Platform

  1. New Tables
    - `users` (extends Supabase auth.users)
      - `id` (uuid, references auth.users)
      - `role` (text, admin/client)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `clients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `company_name` (text)
      - `link_token` (text, unique)
      - `created_at` (timestamp)
    
    - `authorizations`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `platform` (text, meta/google/tiktok/shopify)
      - `status` (text, pending/authorized)
      - `scopes` (text array)
      - `token_data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Users can only access their own data
    - Admins can access all client data
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'client')) DEFAULT 'client',
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  company_name text NOT NULL,
  link_token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz DEFAULT now()
);

-- Authorizations table
CREATE TABLE IF NOT EXISTS authorizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL CHECK (platform IN ('meta', 'google', 'tiktok', 'shopify')),
  status text NOT NULL CHECK (status IN ('pending', 'authorized')) DEFAULT 'pending',
  scopes text[] DEFAULT '{}',
  token_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(client_id, platform)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorizations ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Clients policies
CREATE POLICY "Admins can read all clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Clients can read own data"
  ON clients
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can insert clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Authorizations policies
CREATE POLICY "Admins can read all authorizations"
  ON authorizations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Clients can read own authorizations"
  ON authorizations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients 
      WHERE clients.id = authorizations.client_id 
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert authorizations"
  ON authorizations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update authorizations"
  ON authorizations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_authorizations_client_id ON authorizations(client_id);
CREATE INDEX IF NOT EXISTS idx_authorizations_platform ON authorizations(platform);
CREATE INDEX IF NOT EXISTS idx_authorizations_status ON authorizations(status);

-- Function to automatically create client record for new client users
CREATE OR REPLACE FUNCTION create_client_record()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'client' THEN
    INSERT INTO clients (user_id, company_name)
    VALUES (NEW.id, 'Company Name TBD');
    
    -- Create default authorization records for all platforms
    INSERT INTO authorizations (client_id, platform, status)
    SELECT 
      (SELECT id FROM clients WHERE user_id = NEW.id),
      platform,
      'pending'
    FROM unnest(ARRAY['meta', 'google', 'tiktok', 'shopify']) AS platform;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create client record
CREATE OR REPLACE TRIGGER create_client_record_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_client_record();