/**
 * Google Business Profile utilities.
 * Builds Google Maps review URLs from a Place ID.
 * Full Google Business Profile API integration (for reading reviews)
 * requires OAuth2 — set that up after launch.
 */

/**
 * Build a direct Google Maps review link for a given Place ID.
 * Customers tap this to land directly on the "Write a review" sheet.
 */
export function buildGoogleReviewUrl(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`
}

/**
 * Build a Google Maps listing URL (fallback if no Place ID).
 */
export function buildGoogleMapsUrl(businessName: string, address?: string): string {
  const query = address ? `${businessName} ${address}` : businessName
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/**
 * Get the review URL for a business.
 * Prefers Place ID direct link; falls back to search.
 */
export function getReviewUrl(business: {
  name: string
  google_place_id: string | null
}): string {
  if (business.google_place_id) {
    return buildGoogleReviewUrl(business.google_place_id)
  }
  return buildGoogleMapsUrl(business.name)
}

// ----------------------------------------------------------------
// Future: Google Business Profile API (requires OAuth2 setup)
// ----------------------------------------------------------------

/**
 * Fetch reviews from Google Business Profile API.
 * Requires OAuth2 credentials and Google Business Profile API enabled.
 * Docs: https://developers.google.com/my-business/reference/rest
 *
 * @param accessToken - OAuth2 access token
 * @param locationName - Format: accounts/{accountId}/locations/{locationId}
 */
export async function fetchGoogleReviews(
  accessToken: string,
  locationName: string
): Promise<GoogleReview[]> {
  const response = await fetch(
    `https://mybusiness.googleapis.com/v4/${locationName}/reviews`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Google Business API error: ${response.status}`)
  }

  const data = await response.json() as { reviews?: GoogleReview[] }
  return data.reviews ?? []
}

export interface GoogleReview {
  name: string
  reviewId: string
  reviewer: {
    profilePhotoUrl: string
    displayName: string
    isAnonymous: boolean
  }
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE'
  comment?: string
  createTime: string
  updateTime: string
}
