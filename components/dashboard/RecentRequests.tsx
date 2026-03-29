'use client'

import { useState } from 'react'
import { type ReviewRequest } from '@/lib/supabase'
import { Copy, Check } from 'lucide-react'
import { clsx } from 'clsx'

interface RecentRequestsProps {
  requests: (ReviewRequest & { customers: { name: string } })[]
  onSendFirst?: () => void
}

const STATUS_STYLES: Record<string, string> = {
  sent: 'bg-blue-50 text-blue-700',
  clicked: 'bg-amber-50 text-amber-700',
  reviewed: 'bg-emerald-50 text-emerald-700',
}

const CHANNEL_LABELS: Record<string, string> = {
  sms: '📱 SMS',
  email: '✉️ Email',
  both: '📱✉️ Both',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const APP_URL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? 'https://review-pilot-app.vercel.app'

function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)
  const link = `${APP_URL}/review/${token}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const el = document.createElement('textarea')
      el.value = link
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border transition-all',
        copied
          ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
          : 'border-gray-200 text-gray-500 hover:border-[#1a3a5c] hover:text-[#1a3a5c]'
      )}
      title="Copy review link"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )
}

export default function RecentRequests({ requests, onSendFirst }: RecentRequestsProps) {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="text-4xl mb-3">📬</div>
        <h3 className="font-semibold text-gray-800 mb-1">No review requests yet</h3>
        <p className="text-gray-400 text-sm mb-5">Send your first request and start collecting Google reviews!</p>
        {onSendFirst && (
          <button
            onClick={onSendFirst}
            className="bg-[#1a3a5c] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#162e4a] transition-colors text-sm"
          >
            Send your first request →
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-5 py-3 font-medium text-gray-600">Customer</th>
            <th className="text-left px-5 py-3 font-medium text-gray-600">Channel</th>
            <th className="text-left px-5 py-3 font-medium text-gray-600">Sent</th>
            <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5 font-medium text-gray-900">
                {req.customers?.name ?? '—'}
              </td>
              <td className="px-5 py-3.5 text-gray-600">
                {CHANNEL_LABELS[req.channel] ?? req.channel}
              </td>
              <td className="px-5 py-3.5 text-gray-500">{formatDate(req.sent_at)}</td>
              <td className="px-5 py-3.5">
                <span
                  className={clsx(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                    STATUS_STYLES[req.status] ?? 'bg-gray-100 text-gray-600'
                  )}
                >
                  {req.status}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right">
                <CopyLinkButton token={req.token} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
