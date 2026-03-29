'use client'

import { useEffect, useState } from 'react'
import { Star, ExternalLink, MapPin } from 'lucide-react'

interface ReviewRedirectClientProps {
  businessName: string
  googleReviewUrl: string
  hasPlaceId: boolean
}

export default function ReviewRedirectClient({
  businessName,
  googleReviewUrl,
  hasPlaceId,
}: ReviewRedirectClientProps) {
  const [countdown, setCountdown] = useState(3)
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    if (!hasPlaceId) return // Don't auto-redirect if no Place ID

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          setRedirected(true)
          window.location.href = googleReviewUrl
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [googleReviewUrl, hasPlaceId])

  if (!hasPlaceId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f5fa] to-white flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <MapPin size={28} className="text-amber-500" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Almost there!</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            <strong className="text-gray-700">{businessName}</strong> hasn&apos;t finished setting up
            their review link yet. Please check back soon or contact them directly.
          </p>
          <p className="text-xs text-gray-300">Powered by Revvo</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f5fa] to-white flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        {/* Business name */}
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">
          {businessName}
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-1.5 mb-5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={36}
              className="text-yellow-400 drop-shadow-sm"
              fill="currentColor"
            />
          ))}
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
          Your feedback means<br />everything to us 🙏
        </h1>

        <p className="text-gray-500 text-base leading-relaxed mb-8 px-2">
          Help other people find us by leaving a quick Google review. It only takes 30 seconds!
        </p>

        {/* CTA Button — big, mobile-friendly */}
        <a
          href={googleReviewUrl}
          className="inline-flex items-center justify-center gap-2 w-full bg-[#1a3a5c] text-white font-bold text-lg py-5 rounded-2xl shadow-lg hover:bg-[#162e4a] active:scale-95 transition-all mb-4"
          style={{ minHeight: '64px' }}
        >
          <Star size={22} fill="currentColor" className="text-yellow-400" />
          Leave a Google Review ⭐
          <ExternalLink size={16} className="opacity-60" />
        </a>

        {/* Auto-redirect notice */}
        {!redirected && (
          <p className="text-sm text-gray-400">
            Opening automatically in {countdown}s…
          </p>
        )}
        {redirected && (
          <p className="text-sm text-emerald-500 font-medium">Opening Google Maps…</p>
        )}

        <p className="mt-10 text-xs text-gray-300">Powered by Revvo</p>
      </div>
    </div>
  )
}
