import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'
import { createBillingPortalSession } from '@/lib/stripe'

export async function POST(_req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: business } = await admin
      .from('businesses')
      .select('stripe_customer_id')
      .eq('user_id', session.user.id)
      .single()

    if (!business?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
    }

    const { url } = await createBillingPortalSession({
      stripeCustomerId: business.stripe_customer_id,
    })

    return NextResponse.json({ url })
  } catch (err) {
    console.error('billing-portal error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
