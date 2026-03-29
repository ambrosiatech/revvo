import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Browser client (client components)
export const createBrowserClient = () =>
  createClient(supabaseUrl, supabaseAnonKey)

// Server client (server components, route handlers)
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // Called from a Server Component — ignore
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch {
          // Called from a Server Component — ignore
        }
      },
    },
  })
}

// Admin client (service role — bypass RLS, server-side only)
export const createAdminClient = () =>
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

// Database types
export interface Business {
  id: string
  user_id: string
  name: string
  google_place_id: string | null
  twilio_phone: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled'
  trial_ends_at: string
  created_at: string
}

export interface Customer {
  id: string
  business_id: string
  name: string
  phone: string | null
  email: string | null
  created_at: string
}

export interface ReviewRequest {
  id: string
  business_id: string
  customer_id: string
  token: string
  channel: 'sms' | 'email' | 'both'
  sent_at: string
  clicked_at: string | null
  status: 'sent' | 'clicked' | 'reviewed'
  sms_sid: string | null
  created_at: string
  customers?: Customer
  businesses?: Business
}
