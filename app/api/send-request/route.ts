import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'
import { sendSMSReviewRequest, normalizePhone } from '@/lib/twilio'
import { sendEmailReviewRequest } from '@/lib/sendgrid'
import { getReviewUrl } from '@/lib/google-business'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

interface SendRequestBody {
  // New customer
  name?: string
  phone?: string
  email?: string
  // Existing customer
  customerId?: string
  // Channel
  channel: 'sms' | 'email' | 'both'
}

export async function POST(req: NextRequest) {
  try {
    // 1. Validate auth
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as SendRequestBody
    const { channel } = body

    if (!channel || !['sms', 'email', 'both'].includes(channel)) {
      return NextResponse.json({ error: 'Invalid channel' }, { status: 400 })
    }

    // 2. Get business
    const admin = createAdminClient()
    const { data: business, error: bizError } = await admin
      .from('businesses')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (bizError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check subscription (allow trialing)
    const isActive =
      business.subscription_status === 'active' ||
      business.subscription_status === 'trialing'

    if (!isActive) {
      return NextResponse.json(
        { error: 'Subscription required. Please upgrade to continue.' },
        { status: 402 }
      )
    }

    // 3. Get or create customer
    let customerId: string
    let customerName: string
    let customerPhone: string | null
    let customerEmail: string | null

    if (body.customerId) {
      // Existing customer
      const { data: customer, error: custError } = await admin
        .from('customers')
        .select('*')
        .eq('id', body.customerId)
        .eq('business_id', business.id)
        .single()

      if (custError || !customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
      }

      customerId = customer.id
      customerName = customer.name
      customerPhone = customer.phone
      customerEmail = customer.email
    } else {
      // New customer
      if (!body.name) {
        return NextResponse.json({ error: 'Customer name is required' }, { status: 400 })
      }

      const { data: customer, error: insertError } = await admin
        .from('customers')
        .insert({
          business_id: business.id,
          name: body.name,
          phone: body.phone || null,
          email: body.email || null,
        })
        .select()
        .single()

      if (insertError || !customer) {
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
      }

      customerId = customer.id
      customerName = customer.name
      customerPhone = customer.phone
      customerEmail = customer.email
    }

    // 4. Create review_request record with unique token
    const { data: reviewRequest, error: reqError } = await admin
      .from('review_requests')
      .insert({
        business_id: business.id,
        customer_id: customerId,
        channel,
      })
      .select()
      .single()

    if (reqError || !reviewRequest) {
      return NextResponse.json({ error: 'Failed to create review request' }, { status: 500 })
    }

    // 5. Build review link
    const reviewLink = `${APP_URL}/review/${reviewRequest.token}`
    const googleReviewUrl = getReviewUrl(business)

    // 6. Send SMS and/or email
    const errors: string[] = []
    let smsSid: string | null = null

    if (channel === 'sms' || channel === 'both') {
      if (!customerPhone) {
        errors.push('No phone number for SMS')
      } else {
        try {
          const result = await sendSMSReviewRequest({
            to: normalizePhone(customerPhone),
            businessName: business.name,
            reviewLink,
          })
          smsSid = result.sid
        } catch (err) {
          errors.push(`SMS failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }
    }

    if (channel === 'email' || channel === 'both') {
      if (!customerEmail) {
        errors.push('No email address for email')
      } else {
        try {
          await sendEmailReviewRequest({
            to: customerEmail,
            customerName,
            businessName: business.name,
            reviewLink,
          })
        } catch (err) {
          errors.push(`Email failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }
    }

    // Update sms_sid if we got one
    if (smsSid) {
      await admin
        .from('review_requests')
        .update({ sms_sid: smsSid })
        .eq('id', reviewRequest.id)
    }

    // 7. Return result
    if (errors.length > 0 && ((channel === 'sms' && !smsSid) || (channel === 'email' && errors.length > 0))) {
      return NextResponse.json(
        { error: errors.join('; '), partial: true },
        { status: 207 }
      )
    }

    return NextResponse.json({
      success: true,
      requestId: reviewRequest.id,
      reviewLink,
      googleReviewUrl,
      warnings: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    console.error('send-request error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
