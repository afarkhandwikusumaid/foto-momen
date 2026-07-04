import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verify if Supabase is properly configured
export const isSupabaseReady = !!supabaseUrl && 
  supabaseUrl !== '' && 
  !supabaseUrl.includes('YOUR_') &&
  !!supabaseAnonKey &&
  supabaseAnonKey !== '' &&
  !supabaseAnonKey.includes('YOUR_');

let supabase: any = null;

if (isSupabaseReady) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Gagal inisialisasi klien Supabase:', err);
  }
}

export { supabase };
