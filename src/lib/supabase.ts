import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Use provided credentials with fallback to environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xucazwycgdzjhpkapnkm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Y2F6d3ljZ2R6amhwa2FwbmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjQzNjAsImV4cCI6MjA3MDg0MDM2MH0.0wMZTWCL1SgCEk8asqzGwkaSd0c_SOzht74PhSIYJ_E';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);