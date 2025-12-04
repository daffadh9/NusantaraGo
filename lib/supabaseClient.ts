import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables! Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Expose to window for debugging (development only)
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}
