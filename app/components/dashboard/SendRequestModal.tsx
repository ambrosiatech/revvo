'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { clsx } from 'clsx'
import { Sparkles, Clock, RefreshCw } from 'lucide-react'

type Channel = 'sms' | 'email' | 'both'

interface SendRequestModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (info?: { customerName: string; channel: string; reviewLink: string }) => void
  existingCustomers?: { id: string; name: string; phone: string | null; email: string | null }[]
}

const DEFAULT_TEMPLATE = 'Hi {customer_name}! {business_name} would love your feedback. Tap here to leave a quick Google review: {review_link} - Reply STOP to opt out'

export default function SendRequestModal({
  open,
  onClose,
  onSuccess,
  existingCustomers = [],
}: SendRequestModalProps) {
  const [mode, setMode] = useState<'new' | 'existing'>('new')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [channel, setChannel] = useState<Channel>('both')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warningMsg, setWarningMsg] = useState<string | null>(null)

  // AI Personalization
  const [serviceType, setServiceType] = useState('')
  const [personalizing, setPersonalizing] = useState(false)
  const [personalizedMessage, setPersonalizedMessage] = useState<string | null>(null)

  // Optimal send time
  const [scheduleOptimal, setScheduleOptimal] = useState(false)
  const [optimalTime, setOptimalTime] = useState<{ recommendedTime: string; reason: string } | null>(null)
  const [loadingTime, setLoadingTime] = useState(false)

  const handleClose = () => {
    setName('')
    setPhone('')
    setEmail('')
    setChannel('both')
    setError(null)
    setWarningMsg(null)
    setMode('new')
    setSelectedCustomerId('')
    setServiceType('')
    setPersonalizedMessage(null)
    setScheduleOptimal(false)
    setOptimalTime(null)
    onClose()
  }

  const getCustomerName = () => {
    if (mode === 'existing') {
      return existingCustomers.find(c => c.id === selectedCustomerId)?.name ?? 'Customer'
    }
    return name || 'Customer'
  }

  const handlePersonalize = async () => {
    setPersonalizing(true)
    try {
      const res = await fetch('/api/ai/personalize-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: getCustomerName(),
          businessName: 'Your Business',
          serviceType: serviceType || undefined,
          template: DEFAULT_TEMPLATE,
        }),
      })
      const data = await res.json() as { message?: string; error?: string }
      if (data.message) {
        setPersonalizedMessage(data.message)
      }
    } catch {
      // silently ignore, user still has default template
    } finally {
      setPersonalizing(false)
    }
  }

  const handleToggleSchedule = async (checked: boolean) => {
    setScheduleOptimal(checked)
    if (checked && !optimalTime) {
      setLoadingTime(true)
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        const res = await fetch('/api/ai/optimal-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timezone: tz }),
        })
        const data = await res.json() as { recommendedTime?: string; reason?: string; error?: string }
        if (data.recommendedTime && data.reason) {
          setOptimalTime({ recommendedTime: data.recommendedTime, reason: data.reason })
        }
      } catch {
        // ignore
      } finally {
        setLoadingTime(false)
      }
    }
  }

  const formatOptimalTime = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setWarningMsg(null)

    try {
      const payload =
        mode === 'existing'
          ? { customerId: selectedCustomerId, channel, scheduled_at: scheduleOptimal && optimalTime ? optimalTime.recommendedTime : undefined }
          : { name, phone, email, channel, scheduled_at: scheduleOptimal && optimalTime ? optimalTime.recommendedTime : undefined }

      const res = await fetch('/api/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json() as {
        error?: string
        success?: boolean
        reviewLink?: string
        warnings?: string[]
        partial?: boolean
      }

      if (!res.ok && !data.partial) {
        throw new Error(data.error ?? 'Failed to send request')
      }

      let customerName = name
      if (mode === 'existing' && selectedCustomerId) {
        const found = existingCustomers.find((c) => c.id === selectedCustomerId)
        customerName = found?.name ?? 'Customer'
      }

      onSuccess({
        customerName,
        channel,
        reviewLink: data.reviewLink ?? '',
      })

      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const CHANNELS: { value: Channel; label: string; desc: string }[] = [
    { value: 'sms', label: '📱 SMS', desc: 'Text message' },
    { value: 'email', label: '✉️ Email', desc: 'Email' },
    { value: 'both', label: '📱✉️ Both', desc: 'SMS + Email' },
  ]

  const selectedExisting = existingCustomers.find((c) => c.id === selectedCustomerId)

  return (
    <Modal open={open} onClose={handleClose} title="Send Review Request">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode toggle */}
        {existingCustomers.length > 0 && (
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setMode('new')}
              className={clsx(
                'flex-1 py-2 text-sm font-medium transition-colors',
                mode === 'new'
                  ? 'bg-[#1a3a5c] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              New Customer
            </button>
            <button
              type="button"
              onClick={() => setMode('existing')}
              className={clsx(
                'flex-1 py-2 text-sm font-medium transition-colors',
                mode === 'existing'
                  ? 'bg-[#1a3a5c] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              Existing Customer
            </button>
          </div>
        )}

        {mode === 'existing' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
            >
              <option value="">Choose a customer…</option>
              {existingCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {selectedExisting && (
              <p className="text-xs text-gray-500 mt-1">
                {selectedExisting.phone ?? 'No phone'} · {selectedExisting.email ?? 'No email'}
              </p>
            )}
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Smith"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(801) 555-1234"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              />
            </div>
          </>
        )}

        {/* Channel toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Send via</label>
          <div className="flex gap-2">
            {CHANNELS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setChannel(value)}
                className={clsx(
                  'flex-1 py-2 text-sm rounded-lg border font-medium transition-colors',
                  channel === value
                    ? 'border-[#1a3a5c] bg-[#1a3a5c] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-[#1a3a5c]'
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {channel === 'sms' && 'Requires phone number. SMS not configured yet — request will be logged.'}
            {channel === 'email' && 'Requires email address. Email not configured yet — request will be logged.'}
            {channel === 'both' && 'Requires phone + email. Messaging not configured yet — request will be logged.'}
          </p>
        </div>

        {/* AI Personalization */}
        <div className="border border-amber-100 bg-amber-50/50 rounded-xl p-3 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service type <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="e.g. oil change, haircut, deep clean…"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
          </div>

          {personalizedMessage && (
            <div className="bg-white border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-700 mb-1">✨ Personalized message preview:</p>
              <p className="text-xs text-gray-700 leading-relaxed">{personalizedMessage}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handlePersonalize}
            disabled={personalizing}
            className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors disabled:opacity-50"
          >
            {personalizing ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {personalizing ? 'Personalizing…' : '✨ Personalize with AI'}
          </button>
        </div>

        {/* Optimal Send Time */}
        <div className="border border-blue-100 bg-blue-50/40 rounded-xl p-3 space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={scheduleOptimal}
                onChange={(e) => handleToggleSchedule(e.target.checked)}
                className="sr-only"
              />
              <div className={clsx(
                'w-10 h-5 rounded-full transition-colors',
                scheduleOptimal ? 'bg-[#1a3a5c]' : 'bg-gray-200'
              )} />
              <div className={clsx(
                'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                scheduleOptimal ? 'translate-x-5' : 'translate-x-0'
              )} />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock size={14} className="text-blue-600" />
              Schedule for optimal time
            </div>
          </label>

          {scheduleOptimal && (
            <div className="ml-13 pl-1">
              {loadingTime ? (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <RefreshCw size={12} className="animate-spin" />
                  Finding best time…
                </div>
              ) : optimalTime ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-blue-700">
                    📅 {formatOptimalTime(optimalTime.recommendedTime)}
                  </p>
                  <p className="text-xs text-gray-500">{optimalTime.reason}</p>
                  <p className="text-xs text-gray-400 italic">Note: Scheduled sending coming soon — your request will be logged with this time.</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {warningMsg && (
          <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">{warningMsg}</p>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a3a5c] text-white font-semibold py-3 rounded-lg hover:bg-[#162e4a] transition-colors disabled:opacity-60 mt-2"
        >
          {loading ? 'Sending…' : 'Send Review Request ⭐'}
        </button>
      </form>
    </Modal>
  )
}
