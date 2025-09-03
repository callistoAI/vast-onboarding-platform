import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface AuthError {
  message: string;
  status?: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string, role: 'admin' | 'client') => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  setTestUser: (role: 'admin' | 'client') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error ? { message: error.message } : null };
    } catch {
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'admin' | 'client') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error: { message: error.message } };

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name,
            role,
          });

        if (profileError) return { error: { message: profileError.message } };
      }

      return { error: null };
    } catch {
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const setTestUser = (role: 'admin' | 'client') => {
    // Create mock user and profile for testing
    const mockUser = {
      id: `test-${role}-user`,
      email: `test-${role}@example.com`,
    } as User;
    
    const mockProfile = {
      id: `test-${role}-user`,
      role,
      name: role === 'admin' ? 'Test Admin' : 'Test Client',
      created_at: new Date().toISOString(),
    } as UserProfile;
    
    setUser(mockUser);
    setProfile(mockProfile);
    setSession({ user: mockUser } as Session);
  };
  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    setTestUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}