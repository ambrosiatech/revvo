import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { getReviewUrl } from '@/lib/google-business'
import ReviewRedirectClient from './ReviewRedirectClient'

interface PageProps {
  params: { token: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const admin = createAdminClient()
  const { data: reviewRequest } = await admin
    .from('review_requests')
    .select('businesses(name)')
    .eq('token', params.token)
    .single()

  const business = reviewRequest?.businesses as unknown as { name: string } | null
  const name = business?.name ?? 'Revvo'

  return {
    title: `Leave a Review for ${name}`,
    description: `Share your experience with ${name}. Your feedback helps others find great local businesses.`,
  }
}

export default async function ReviewPage({ params }: PageProps) {
  const { token } = params
  const admin = createAdminClient()

  // 1. Look up token
  const { data: reviewRequest } = await admin
    .from('review_requests')
    .select('*, businesses(name, google_place_id)')
    .eq('token', token)
    .single()

  if (!reviewRequest) {
    notFound()
  }

  // 2. Record click — fire and forget (don't block render)
  if (!reviewRequest.clicked_at) {
    await admin
      .from('review_requests')
      .update({
        clicked_at: new Date().toISOString(),
        status: 'clicked',
      })
      .eq('id', reviewRequest.id)
  }

  const business = reviewRequest.businesses as { name: string; google_place_id: string | null }
  const googleReviewUrl = getReviewUrl(business)
  const hasPlaceId = Boolean(business.google_place_id)

  return (
    <ReviewRedirectClient
      businessName={business.name}
      googleReviewUrl={googleReviewUrl}
      hasPlaceId={hasPlaceId}
    />
  )
}
