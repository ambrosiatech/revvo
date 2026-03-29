'use client'

import { useState, useEffect, useCallback } from 'react'
import CustomerTable from '@/components/customers/CustomerTable'
import SendRequestModal from '@/components/dashboard/SendRequestModal'
import { createBrowserClient, type Customer } from '@/lib/supabase'

interface CustomerWithStats extends Customer {
  requestCount: number
  lastRequestDate: string | null
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [preselectedCustomerId, setPreselectedCustomerId] = useState<string | undefined>()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const supabase = createBrowserClient()

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!business) {
      setLoading(false)
      return
    }

    setBusinessId(business.id)

    const { data: customerData } = await supabase
      .from('customers')
      .select('*, review_requests(id, created_at)')
      .eq('business_id', business.id)
      .order('name')

    const enriched = (customerData ?? []).map((c: Customer & { review_requests?: { id: string; created_at: string }[] }) => {
      const requests = c.review_requests ?? []
      const sorted = [...requests].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      return {
        ...c,
        requestCount: requests.length,
        lastRequestDate: sorted[0]?.created_at ?? null,
      }
    })

    setCustomers(enriched)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  const handleAddCustomer = async (data: { name: string; phone: string; email: string }) => {
    if (!businessId) throw new Error('No business found')

    const { error } = await supabase.from('customers').insert({
      business_id: businessId,
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
    })

    if (error) throw new Error(error.message)
    await loadCustomers()
  }

  const handleSendRequest = (customerId: string) => {
    setPreselectedCustomerId(customerId)
    setSendModalOpen(true)
  }

  const handleSendSuccess = () => {
    setSuccessMsg('Review request sent! 🎉')
    loadCustomers()
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your customer list and send review requests</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm font-medium">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 h-64 animate-pulse" />
      ) : (
        <CustomerTable
          customers={customers}
          onSendRequest={handleSendRequest}
          onAdd={handleAddCustomer}
        />
      )}

      <SendRequestModal
        open={sendModalOpen}
        onClose={() => {
          setSendModalOpen(false)
          setPreselectedCustomerId(undefined)
        }}
        onSuccess={handleSendSuccess}
        existingCustomers={customers.map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email,
        }))}
      />
    </div>
  )
}
