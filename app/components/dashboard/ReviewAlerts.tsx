'use client'

import { useState } from 'react'
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'

interface Review {
  id: string
  customerName: string
  reviewText: string
  rating: number
}

interface AlertItem {
  review: Review
  sentiment: 'positive' | 'neutral' | 'negative'
  urgency: 'high' | 'low'
  keyThemes: string[]
  suggestedAction: string
}

interface ReviewAlertsProps {
  reviews: Review[]
}

export default function ReviewAlerts({ reviews }: ReviewAlertsProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeReviews = async () => {
    if (reviews.length === 0) {
      setAnalyzed(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const results = await Promise.all(
        reviews.map(async (review) => {
          const res = await fetch('/api/ai/analyze-sentiment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reviewText: review.reviewText,
              rating: review.rating,
            }),
          })
          const data = await res.json() as {
            sentiment?: 'positive' | 'neutral' | 'negative'
            urgency?: 'high' | 'low'
            keyThemes?: string[]
            suggestedAction?: string
            error?: string
          }
          return {
            review,
            sentiment: data.sentiment ?? 'neutral',
            urgency: data.urgency ?? 'low',
            keyThemes: data.keyThemes ?? [],
            suggestedAction: data.suggestedAction ?? '',
          } as AlertItem
        })
      )

      const highUrgency = results.filter(r => r.urgency === 'high')
      setAlerts(highUrgency)
      setAnalyzed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze reviews')
    } finally {
      setLoading(false)
    }
  }

  // Auto-analyze on mount if reviews provided
  useState(() => {
    if (reviews.length > 0) {
      analyzeReviews()
    } else {
      setAnalyzed(true)
    }
  })

  if (!analyzed && !loading) return null

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          <h2 className="font-semibold text-gray-900 text-sm">Review Alerts</h2>
          {alerts.length > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {alerts.length} urgent
            </span>
          )}
        </div>
        <button
          onClick={analyzeReviews}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Analyzing…' : 'Refresh'}
        </button>
      </div>

      <div className="px-5 py-4">
        {loading ? (
          <div className="flex items-center gap-3 text-sm text-gray-500 py-2">
            <RefreshCw size={14} className="animate-spin text-[#1a3a5c]" />
            <span>Analyzing reviews with AI…</span>
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : alerts.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <span className="text-lg">🎉</span>
            <span>No urgent reviews — you're all clear!</span>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.review.id}
                className="border border-red-100 bg-red-50/50 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900">{alert.review.customerName}</span>
                      <span className="text-xs text-red-600 font-medium">{'⭐'.repeat(alert.review.rating)} ({alert.review.rating}/5)</span>
                      <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Needs Response
                      </span>
                    </div>
                    {alert.keyThemes.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {alert.keyThemes.map((theme, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === alert.review.id ? null : alert.review.id)}
                    className="text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    {expanded === alert.review.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {expanded === alert.review.id && (
                  <div className="mt-3 pt-3 border-t border-red-100 space-y-2">
                    {alert.review.reviewText && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Review</p>
                        <p className="text-sm text-gray-700 italic">"{alert.review.reviewText}"</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                        <Sparkles size={11} className="text-amber-500" />
                        Suggested action
                      </p>
                      <p className="text-sm text-gray-700">{alert.suggestedAction}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
