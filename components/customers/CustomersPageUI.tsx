'use client'

import { Plus, Send, Search, Users } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useState } from 'react'

function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(clsx(inputs))
}

export interface CustomerRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  requestCount: number
  lastRequestDate: string | null
}

interface Props {
  customers: CustomerRow[]
  onSendRequest: (customerId: string) => void
  onAddCustomer: () => void
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export default function CustomersPageUI({ customers, onSendRequest, onAddCustomer }: Props) {
  const [search, setSearch] = useState('')

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? '').includes(search)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">
            {customers.length} customer{customers.length !== 1 ? 's' : ''} · send review requests anytime
          </p>
        </div>
        <button
          onClick={onAddCustomer}
          className="flex items-center gap-2 bg-[#1a3a5c] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#162e4a] active:scale-95 transition-all shadow-sm w-fit"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* Search */}
      {customers.length > 0 && (
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] shadow-sm"
          />
        </div>
      )}

      {/* Table or Empty */}
      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <Users size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No customers yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Add your first customer to start sending review requests
          </p>
          <button
            onClick={onAddCustomer}
            className="mt-4 text-[#1a3a5c] font-semibold text-sm hover:underline"
          >
            Add your first customer →
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-gray-400 text-sm">No customers match &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Name', 'Phone', 'Email', 'Requests', 'Last Sent', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide bg-gray-50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer, idx) => (
                  <tr
                    key={customer.id}
                    className={cn(
                      'border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors group',
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                    )}
                  >
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{customer.name}</td>
                    <td className="px-5 py-3.5 text-gray-500">{customer.phone ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500">{customer.email ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
                          customer.requestCount > 0
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-400'
                        )}
                      >
                        {customer.requestCount}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {formatDate(customer.lastRequestDate)}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => onSendRequest(customer.id)}
                        className="flex items-center gap-1.5 text-[#1a3a5c] font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:underline ml-auto"
                      >
                        <Send size={12} />
                        Send Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
