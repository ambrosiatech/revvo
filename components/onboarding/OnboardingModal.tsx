'use client'

import { useState } from 'react'
import { Star, ExternalLink, X } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase-browser'

interface OnboardingModalProps {
  businessId: string
  businessName: string
}

export default function OnboardingModal({ businessId, businessName }: OnboardingModalProps) {
  const [dismissed, setDismissed] = useState(false)
  const [step, setStep] = useState<'welcome' | 'place-id'>('welcome')
  const [placeId, setPlaceId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient()

  if (dismissed) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('businesses')
      .update({ google_place_id: placeId.trim() || null })
      .eq('id', businessId)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
    } else {
      // Reload so the layout picks up the change
      window.location.reload()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setDismissed(true)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
        {/* Close */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {step === 'welcome' ? (
          <>
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-yellow-400" fill="currentColor" />
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Welcome to ReviewPilot! 🎉
            </h2>
            <p className="text-gray-500 text-center text-sm mb-6">
              Hi {businessName.split(' ')[0]}! Let&apos;s get set up so you can start collecting
              Google reviews from your customers.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-blue-800 mb-1">One thing to set up:</p>
              <p className="text-sm text-blue-700">
                Your <strong>Google Place ID</strong> — this tells ReviewPilot exactly where to
                send customers to leave your review.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setStep('place-id')}
                className="w-full bg-[#1a3a5c] text-white font-semibold py-3 rounded-xl hover:bg-[#162e4a] transition-colors"
              >
                Set up my Place ID →
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors py-1"
              >
                I&apos;ll do this later
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Find your Google Place ID</h2>
            <p className="text-gray-500 text-sm mb-5">
              Your Place ID connects ReviewPilot to your specific Google Business listing.
            </p>

            {/* Step by step */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#1a3a5c] text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                <p className="text-sm text-gray-700">
                  Open the{' '}
                  <a
                    href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1a3a5c] font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Google Place ID Finder
                    <ExternalLink size={12} />
                  </a>
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#1a3a5c] text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                <p className="text-sm text-gray-700">Search for &ldquo;{businessName}&rdquo;</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#1a3a5c] text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                <p className="text-sm text-gray-700">Click your business — copy the Place ID (starts with &ldquo;ChIJ&rdquo;)</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Place ID
                </label>
                <input
                  type="text"
                  value={placeId}
                  onChange={(e) => setPlaceId(e.target.value)}
                  placeholder="ChIJ..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] font-mono text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={saving || !placeId.trim()}
                className="w-full bg-[#1a3a5c] text-white font-semibold py-3 rounded-xl hover:bg-[#162e4a] transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save & Continue'}
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('welcome')}
                  className="flex-1 text-gray-400 text-sm hover:text-gray-600 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  className="flex-1 text-gray-400 text-sm hover:text-gray-600 transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
