'use client'

import { useEffect, useState } from 'react'
import { Star, ExternalLink } from 'lucide-react'

interface ReviewRedirectClientProps {
  businessName: string
  googleReviewUrl: string
}

export default function ReviewRedirectClient({
  businessName,
  googleReviewUrl,
}: ReviewRedirectClientProps) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          window.location.href = googleReviewUrl
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [googleReviewUrl])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f5fa] to-white flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        {/* Stars */}
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={32}
              className="text-yellow-400"
              fill="currentColor"
            />
          ))}
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thank you for choosing
        </h1>
        <h2 className="text-2xl font-bold text-[#1a3a5c] mb-4">{businessName}!</h2>

        <p className="text-gray-500 text-base leading-relaxed mb-8">
          Your review means the world to us and helps other customers like you find us. 🙏
        </p>

        {/* CTA Button */}
        <a
          href={googleReviewUrl}
          className="inline-flex items-center justify-center gap-2 w-full bg-[#1a3a5c] text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-[#162e4a] active:scale-95 transition-all"
        >
          <Star size={20} fill="currentColor" className="text-yellow-400" />
          Leave a Google Review
          <ExternalLink size={16} className="opacity-70" />
        </a>

        {/* Auto-redirect notice */}
        <p className="mt-4 text-sm text-gray-400">
          Redirecting automatically in {countdown}s…
        </p>

        <p className="mt-8 text-xs text-gray-300">Powered by ReviewPilot</p>
      </div>
    </div>
  )
}
