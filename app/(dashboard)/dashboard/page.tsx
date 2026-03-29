'use client'

import { useState, useEffect, useCallback } from 'react'
import { Send } from 'lucide-react'
import StatsBar from '@/components/dashboard/StatsBar'
import RecentRequests from '@/components/dashboard/RecentRequests'
import SendRequestModal from '@/components/dashboard/SendRequestModal'
import { createBrowserClient, type ReviewRequest, type Customer } from '@/lib/supabase-browser'

type RequestWithCustomer = ReviewRequest & { customers: { name: string } }

interface DashboardStats {
  totalSent: number
  totalClicked: number
  estimatedReviews: number
  thisMonth: number
}

interface LastSentInfo {
  customerName: string
  channel: string
  reviewLink: string
}

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalSent: 0,
    totalClicked: 0,
    estimatedReviews: 0,
    thisMonth: 0,
  })
  const [recentRequests, setRecentRequests] = useState<RequestWithCustomer[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [lastSent, setLastSent] = useState<LastSentInfo | null>(null)

  const supabase = createBrowserClient()

  const loadData = useCallback(async () => {
    setLoading(true)

    // Get business
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

    // Fetch recent requests with customer names
    const { data: requests } = await supabase
      .from('review_requests')
      .select('*, customers(name)')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(20)

    const typedRequests = (requests ?? []) as RequestWithCustomer[]
    setRecentRequests(typedRequests)

    // Stats
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const totalSent = typedRequests.length
    const totalClicked = typedRequests.filter((r) => r.clicked_at).length
    const estimatedReviews = Math.round(totalClicked * 0.3)
    const thisMonth = typedRequests.filter((r) => r.created_at >= startOfMonth).length

    setStats({ totalSent, totalClicked, estimatedReviews, thisMonth })

    // Fetch customers for modal
    const { data: customerData } = await supabase
      .from('customers')
      .select('*')
      .eq('business_id', business.id)
      .order('name')

    setCustomers((customerData ?? []) as Customer[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSendSuccess = (info?: { customerName: string; channel: string; reviewLink: string }) => {
    if (info) {
      setLastSent(info)
    }
    setSuccessMsg('Review request sent! 🎉')
    loadData()
    setTimeout(() => setSuccessMsg(null), 6000)
  }

  const CHANNEL_LABELS: Record<string, string> = {
    sms: '📱 SMS',
    email: '✉️ Email',
    both: '📱✉️ SMS + Email',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Track your review requests and performance</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#1a3a5c] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#162e4a] transition-colors shadow-sm"
        >
          <Send size={16} />
          Send Review Request
        </button>
      </div>

      {/* Success message with details */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          <p className="text-emerald-700 text-sm font-medium">{successMsg}</p>
          {lastSent && (
            <p className="text-emerald-600 text-xs mt-1">
              Sent to <strong>{lastSent.customerName}</strong> via {CHANNEL_LABELS[lastSent.channel] ?? lastSent.channel}
              {' · '}
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(lastSent.reviewLink)
                  } catch {
                    // ignore
                  }
                }}
                className="underline hover:no-underline"
              >
                Copy review link
              </button>
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <StatsBar
          totalSent={stats.totalSent}
          totalClicked={stats.totalClicked}
          estimatedReviews={stats.estimatedReviews}
          thisMonth={stats.thisMonth}
        />
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 h-24 animate-pulse" />
          ))}
        </div>
      )}

      {/* Recent requests */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Requests</h2>
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 h-48 animate-pulse" />
        ) : (
          <RecentRequests
            requests={recentRequests}
            onSendFirst={() => setModalOpen(true)}
          />
        )}
      </div>

      {/* Modal */}
      <SendRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSendSuccess}
        existingCustomers={customers}
      />
    </div>
  )
}
