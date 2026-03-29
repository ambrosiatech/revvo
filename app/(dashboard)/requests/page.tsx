'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase-browser'
import { Copy, Check, RefreshCw, Mail, MessageSquare, Clock, MousePointer, Star, Sparkles, X } from 'lucide-react'
import { clsx } from 'clsx'

interface RequestRow {
  id: string
  token: string
  channel: 'sms' | 'email' | 'both'
  status: 'sent' | 'clicked' | 'reviewed'
  sent_at: string
  clicked_at: string | null
  sms_sid: string | null
  customers: { name: string; phone: string | null; email: string | null }
}

const STATUS_CONFIG = {
  sent: { label: 'Sent', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  clicked: { label: 'Link Clicked', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: MousePointer },
  reviewed: { label: 'Reviewed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Star },
}

const CHANNEL_CONFIG = {
  sms: { label: 'SMS', icon: MessageSquare, color: 'text-blue-600' },
  email: { label: 'Email', icon: Mail, color: 'text-purple-600' },
  both: { label: 'SMS + Email', icon: MessageSquare, color: 'text-indigo-600' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function CopyButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/review/${token}`
  const copy = async () => {
    await navigator.clipboard.writeText(link).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className={clsx(
      'flex items-center gap-1 text-xs px-2 py-1 rounded border transition-all',
      copied ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-gray-200 text-gray-500 hover:border-[#1a3a5c] hover:text-[#1a3a5c]'
    )}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}

interface DraftResponseModalProps {
  open: boolean
  onClose: () => void
  customerName: string
  businessName: string
  rating?: number
  reviewText?: string
}

function DraftResponseModal({ open, onClose, customerName, businessName, rating = 5, reviewText }: DraftResponseModalProps) {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setResponse('')
      setCopied(false)
      setError(null)
      generateDraft()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const generateDraft = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/draft-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewText, businessName, rating }),
      })
      const data = await res.json() as { response?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate response')
      setResponse(data.response ?? '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate draft')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              AI Draft Response
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">For {customerName}'s {rating}★ review</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-3 text-gray-500">
            <RefreshCw size={18} className="animate-spin text-[#1a3a5c]" />
            <span className="text-sm">Drafting your response…</span>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            <button onClick={generateDraft} className="text-sm text-[#1a3a5c] hover:underline">
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{response}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all',
                  copied
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-[#1a3a5c] border-[#1a3a5c] text-white hover:bg-[#162e4a]'
                )}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Response'}
              </button>
              <button
                onClick={generateDraft}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:border-[#1a3a5c] hover:text-[#1a3a5c] transition-all"
              >
                <RefreshCw size={14} />
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'sent' | 'clicked' | 'reviewed'>('all')
  const [resending, setResending] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [draftModal, setDraftModal] = useState<{
    open: boolean
    customerName: string
    rating?: number
    reviewText?: string
  }>({ open: false, customerName: '' })
  const supabase = createBrowserClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: business } = await supabase.from('businesses').select('id, name').eq('user_id', user.id).single()
    if (!business) return

    if (business.name) setBusinessName(business.name)

    const { data } = await supabase
      .from('review_requests')
      .select('*, customers(name, phone, email)')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(100)

    setRequests((data ?? []) as RequestRow[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const handleResend = async (req: RequestRow) => {
    setResending(req.id)
    try {
      await fetch('/api/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: req.customers ? undefined : req.id,
          name: req.customers?.name,
          phone: req.customers?.phone,
          email: req.customers?.email,
          channel: req.channel,
        }),
      })
      await load()
    } finally {
      setResending(null)
    }
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  const counts = {
    all: requests.length,
    sent: requests.filter(r => r.status === 'sent').length,
    clicked: requests.filter(r => r.status === 'clicked').length,
    reviewed: requests.filter(r => r.status === 'reviewed').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request Log</h1>
          <p className="text-gray-500 text-sm mt-1">Track every review request and its delivery status</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'sent', 'clicked', 'reviewed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors border',
              filter === f
                ? 'bg-[#1a3a5c] text-white border-[#1a3a5c]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c]'
            )}
          >
            {f === 'all' ? 'All' : STATUS_CONFIG[f].label} <span className="ml-1 opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500">No requests with this status yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Channel</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Sent</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Clicked</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => {
                const statusCfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.sent
                const channelCfg = CHANNEL_CONFIG[req.channel] ?? CHANNEL_CONFIG.sms
                const ChannelIcon = channelCfg.icon
                const StatusIcon = statusCfg.icon

                return (
                  <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{req.customers?.name ?? '—'}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {req.customers?.phone ?? req.customers?.email ?? '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className={clsx('flex items-center gap-1.5', channelCfg.color)}>
                        <ChannelIcon size={14} />
                        <span>{channelCfg.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      <div>{timeAgo(req.sent_at)}</div>
                      <div className="text-xs text-gray-400">{formatDate(req.sent_at)}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {req.clicked_at ? (
                        <>
                          <div className="text-amber-600">{timeAgo(req.clicked_at)}</div>
                          <div className="text-xs text-gray-400">{formatDate(req.clicked_at)}</div>
                        </>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                        statusCfg.color
                      )}>
                        <StatusIcon size={11} />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <CopyButton token={req.token} />
                        {req.status === 'reviewed' && (
                          <button
                            onClick={() => setDraftModal({
                              open: true,
                              customerName: req.customers?.name ?? 'Customer',
                              rating: 5,
                              reviewText: undefined,
                            })}
                            className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all"
                          >
                            <Sparkles size={11} />
                            Draft Response
                          </button>
                        )}
                        <button
                          onClick={() => handleResend(req)}
                          disabled={resending === req.id}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:border-[#f97316] hover:text-[#f97316] transition-all disabled:opacity-40"
                        >
                          <RefreshCw size={11} className={resending === req.id ? 'animate-spin' : ''} />
                          Resend
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <DraftResponseModal
        open={draftModal.open}
        onClose={() => setDraftModal(prev => ({ ...prev, open: false }))}
        customerName={draftModal.customerName}
        businessName={businessName}
        rating={draftModal.rating}
        reviewText={draftModal.reviewText}
      />
    </div>
  )
}
