'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createBrowserClient = () =>
  createClient(supabaseUrl, supabaseAnonKey)

// Re-export types for client components
export type { Business, Customer, ReviewRequest } from '@/lib/supabase'
