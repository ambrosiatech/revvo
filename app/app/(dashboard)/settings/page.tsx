'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient, type Business } from '@/lib/supabase-browser'

export default function SettingsPage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [name, setName] = useState('')
  const [googlePlaceId, setGooglePlaceId] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

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
            <input
              type="text"
              value={googlePlaceId}
              onChange={(e) => setGooglePlaceId(e.target.value)}
              placeholder="ChIJ..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
            />
            <p className="text-xs text-gray-400 mt-1">
              Find your Place ID at{' '}
              <a
                href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1a3a5c] hover:underline"
              >
                Google Maps Place ID Finder
              </a>
            </p>
          </div>

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
              {isTrialing ? '🎉 Free Trial' : 'ReviewPilot Pro'}
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

