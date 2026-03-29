import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { getReviewUrl } from '@/lib/google-business'
import ReviewRedirectClient from './ReviewRedirectClient'

interface PageProps {
  params: { token: string }
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

  return (
    <ReviewRedirectClient
      businessName={business.name}
      googleReviewUrl={googleReviewUrl}
    />
  )
}
