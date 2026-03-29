import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Uses @supabase/ssr which stores session in cookies (not just localStorage)
// This allows server components to read the session correctly
export const createBrowserClient = () =>
  createSSRBrowserClient(supabaseUrl, supabaseAnonKey)

// Re-export types
export type { Business, Customer, ReviewRequest } from '@/lib/supabase'
