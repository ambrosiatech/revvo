'use client'

import { useState } from 'react'
import { Send, Plus } from 'lucide-react'
import Modal from '@/components/ui/Modal'

interface Customer {
  id: string
  name: string
  phone: string | null
  email: string | null
  created_at: string
  requestCount: number
  lastRequestDate: string | null
}

interface CustomerTableProps {
  customers: Customer[]
  onSendRequest: (customerId: string) => void
  onAdd: (data: { name: string; phone: string; email: string }) => Promise<void>
}

export default function CustomerTable({
  customers,
  onSendRequest,
  onAdd,
}: CustomerTableProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onAdd({ name, phone, email })
      setName('')
      setPhone('')
      setEmail('')
      setAddOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add customer')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Customers ({customers.length})
        </h2>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-[#1a3a5c] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#162e4a] transition-colors"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-400 text-sm">No customers yet.</p>
          <button
            onClick={() => setAddOpen(true)}
            className="mt-3 text-[#1a3a5c] font-medium text-sm hover:underline"
          >
            Add your first customer →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Phone</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Requests</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Last Sent</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-gray-900">{c.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{c.phone ?? '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500">{c.email ?? '—'}</td>
                  <td className="px-5 py-3.5 text-gray-700">{c.requestCount}</td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {c.lastRequestDate
                      ? new Date(c.lastRequestDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onSendRequest(c.id)}
                      className="flex items-center gap-1.5 text-[#1a3a5c] font-medium text-xs hover:underline ml-auto"
                    >
                      <Send size={13} />
                      Send Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Customer Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Customer">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
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
              Phone
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

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#1a3a5c] text-white font-semibold py-3 rounded-lg hover:bg-[#162e4a] transition-colors disabled:opacity-60"
          >
            {saving ? 'Adding…' : 'Add Customer'}
          </button>
        </form>
      </Modal>
    </>
  )
}
