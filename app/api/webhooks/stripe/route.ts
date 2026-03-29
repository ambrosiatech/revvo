import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { businessId } = session.metadata ?? {}

        if (!businessId) break

        await admin
          .from('businesses')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: 'active',
          })
          .eq('id', businessId)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const { businessId } = subscription.metadata ?? {}

        if (!businessId) {
          // Try to look up by stripe_subscription_id
          const { data: business } = await admin
            .from('businesses')
            .select('id')
            .eq('stripe_subscription_id', subscription.id)
            .single()

          if (!business) break

          await admin
            .from('businesses')
            .update({ subscription_status: subscription.status })
            .eq('id', business.id)
        } else {
          await admin
            .from('businesses')
            .update({ subscription_status: subscription.status })
            .eq('id', businessId)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const { data: business } = await admin
          .from('businesses')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (!business) break

        await admin
          .from('businesses')
          .update({ subscription_status: 'canceled' })
          .eq('id', business.id)

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: business } = await admin
          .from('businesses')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!business) break

        await admin
          .from('businesses')
          .update({ subscription_status: 'past_due' })
          .eq('id', business.id)

        break
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// Stripe requires raw body
export const dynamic = 'force-dynamic'
