import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'
import { createCheckoutSession } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const admin = createAdminClient()
    const { data: business } = await admin
      .from('businesses')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (!business) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const { url } = await createCheckoutSession({
      customerId: business.stripe_customer_id ?? undefined,
      customerEmail: session.user.email!,
      businessId: business.id,
      userId: session.user.id,
    })

    return NextResponse.redirect(url)
  } catch (err) {
    console.error('checkout error:', err)
    return NextResponse.redirect(new URL('/settings?error=checkout', req.url))
  }
}
