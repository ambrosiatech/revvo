'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { clsx } from 'clsx'

type Channel = 'sms' | 'email' | 'both'

interface SendRequestModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  existingCustomers?: { id: string; name: string; phone: string | null; email: string | null }[]
}

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

  const handleClose = () => {
    setName('')
    setPhone('')
    setEmail('')
    setChannel('both')
    setError(null)
    setMode('new')
    setSelectedCustomerId('')
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload =
        mode === 'existing'
          ? { customerId: selectedCustomerId, channel }
          : { name, phone, email, channel }

      const res = await fetch('/api/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json() as { error?: string }

      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to send request')
      }

      onSuccess()
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const CHANNELS: { value: Channel; label: string }[] = [
    { value: 'sms', label: '📱 SMS' },
    { value: 'email', label: '✉️ Email' },
    { value: 'both', label: '📱✉️ Both' },
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
        </div>

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
