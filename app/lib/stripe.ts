import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const PRICE_ID = process.env.STRIPE_PRICE_ID!

/**
 * Create a Stripe Checkout session for a new subscription.
 */
export async function createCheckoutSession({
  customerId,
  customerEmail,
  businessId,
  userId,
}: {
  customerId?: string
  customerEmail: string
  businessId: string
  userId: string
}): Promise<{ url: string }> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${APP_URL}/dashboard?checkout=success`,
    cancel_url: `${APP_URL}/settings?checkout=canceled`,
    metadata: {
      businessId,
      userId,
    },
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        businessId,
        userId,
      },
    },
  }

  if (customerId) {
    sessionParams.customer = customerId
  } else {
    sessionParams.customer_email = customerEmail
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  if (!session.url) {
    throw new Error('No Stripe checkout URL returned')
  }

  return { url: session.url }
}

/**
 * Create a Stripe Billing Portal session so customers can manage their subscription.
 */
export async function createBillingPortalSession({
  stripeCustomerId,
  returnUrl,
}: {
  stripeCustomerId: string
  returnUrl?: string
}): Promise<{ url: string }> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl ?? `${APP_URL}/settings`,
  })

  return { url: session.url }
}

/**
 * Retrieve a subscription's current status.
 */
export async function getSubscriptionStatus(
  subscriptionId: string
): Promise<{ status: Stripe.Subscription.Status; currentPeriodEnd: Date }> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return {
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  }
}
