'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExternalLink, Star } from 'lucide-react'
import { createBrowserClient, type Business } from '@/lib/supabase-browser'

const APP_URL = typeof window !== 'undefined'
  ? window.location.origin
  : 'https://revvo-app.vercel.app'

export default function SettingsPage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [name, setName] = useState('')
  const [googlePlaceId, setGooglePlaceId] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [previewToken, setPreviewToken] = useState<string | null>(null)

  const supabase = createBrowserClient()

  const loadBusiness = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setBusiness(data as Business)
      setName(data.name ?? '')
      setGooglePlaceId(data.google_place_id ?? '')
    }

    // Get a sample token for preview
    const { data: sampleRequest } = await supabase
      .from('review_requests')
      .select('token')
      .eq('business_id', data?.id)
      .limit(1)
      .single()

    if (sampleRequest) {
      setPreviewToken(sampleRequest.token)
    }
  }, [supabase])

  useEffect(() => {
    loadBusiness()
  }, [loadBusiness])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('businesses')
      .update({ name, google_place_id: googlePlaceId || null })
      .eq('id', business?.id ?? '')

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await loadBusiness()
    }

    setSaving(false)
  }

  const handleBillingPortal = async () => {
    setPortalLoading(true)
    const res = await fetch('/api/billing-portal', { method: 'POST' })
    const data = await res.json() as { url?: string; error?: string }

    if (data.url) {
      window.location.href = data.url
    } else {
      setError(data.error ?? 'Failed to open billing portal')
      setPortalLoading(false)
    }
  }

  const isTrialing = business?.subscription_status === 'trialing'
  const trialEnd = business?.trial_ends_at
    ? new Date(business.trial_ends_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const reviewLink = previewToken
    ? `${APP_URL}/review/${previewToken}`
    : `${APP_URL}/review/[token]`

  const googleReviewPreviewUrl = googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${googlePlaceId}`
    : null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your business profile and billing</p>
      </div>

      {/* Business info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Business Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Place ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={googlePlaceId}
                onChange={(e) => setGooglePlaceId(e.target.value)}
                placeholder="ChIJ..."
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] font-mono text-sm"
              />
              <a
                href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1a3a5c] font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <ExternalLink size={14} />
                Find my ID
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Your Google Place ID connects review requests directly to your Google listing.
            </p>
          </div>

          {/* Preview */}
          {(googlePlaceId || previewToken) && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Review link preview</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Customer landing page:</p>
                  <code className="text-xs text-[#1a3a5c] bg-blue-50 px-2 py-1 rounded break-all block">
                    {reviewLink}
                  </code>
                </div>
                {googleReviewPreviewUrl && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Where it sends them:</p>
                    <a
                      href={googleReviewPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded break-all block hover:underline"
                    >
                      {googleReviewPreviewUrl.length > 60
                        ? googleReviewPreviewUrl.substring(0, 60) + '...'
                        : googleReviewPreviewUrl}
                    </a>
                  </div>
                )}
              </div>
              {!googlePlaceId && (
                <div className="flex items-center gap-2 mt-2 text-amber-600">
                  <Star size={12} className="text-amber-500" fill="currentColor" />
                  <p className="text-xs">Set your Place ID above to send customers directly to your Google review page</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
              Settings saved ✓
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-[#1a3a5c] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#162e4a] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Billing */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Billing</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isTrialing ? '🎉 Free Trial' : 'Revvo Pro'}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {isTrialing
                ? `Trial ends ${trialEnd ?? '—'} · $29/month after`
                : `Status: ${business?.subscription_status ?? '—'}`}
            </p>
          </div>

          {business?.stripe_customer_id ? (
            <button
              onClick={handleBillingPortal}
              disabled={portalLoading}
              className="text-sm font-medium text-[#1a3a5c] hover:underline disabled:opacity-60"
            >
              {portalLoading ? 'Loading…' : 'Manage Billing →'}
            </button>
          ) : (
            <a
              href="/api/checkout"
              className="bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#162e4a] transition-colors"
            >
              Subscribe · $29/mo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

