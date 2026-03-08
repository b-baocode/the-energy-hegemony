
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const hasSupabaseConfig = supabaseUrl !== '' && supabaseAnonKey !== '';

// Use placeholders when env vars are missing to avoid crashing at module load time.
// The app checks configuration before making any Supabase calls.
export const supabase = createClient(
  hasSupabaseConfig ? supabaseUrl : 'https://example.supabase.co',
  hasSupabaseConfig ? supabaseAnonKey : 'public-anon-key',
);

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return hasSupabaseConfig;
};
