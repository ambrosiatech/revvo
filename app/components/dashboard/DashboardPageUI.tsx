'use client'

import { Send, MousePointerClick, Star, Calendar, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility
function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(clsx(inputs))
}

// Types
interface Stats {
  totalSent: number
  totalClicked: number
  estimatedReviews: number
  thisMonth: number
  clickRate: number
}

interface ReviewRequestRow {
  id: string
  customerName: string
  channel: 'sms' | 'email' | 'both'
  sentAt: string
  status: 'sent' | 'clicked' | 'reviewed'
}

interface Props {
  stats: Stats
  requests: ReviewRequestRow[]
  onSendRequest: () => void
}

// Stat Card
interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  trend?: string
}

function StatCard({ label, value, icon, iconBg, iconColor, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={cn('p-2.5 rounded-xl', iconBg)}>
          <div className={iconColor}>{icon}</div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// Status badge
const STATUS_CONFIG = {
  sent: { label: 'Sent', className: 'bg-blue-50 text-blue-700 ring-blue-100' },
  clicked: { label: 'Clicked', className: 'bg-amber-50 text-amber-700 ring-amber-100' },
  reviewed: { label: 'Reviewed ⭐', className: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
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
    hour12: true,
  })
}

export default function DashboardPageUI({ stats, requests, onSendRequest }: Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your review requests and conversion performance
          </p>
        </div>
        <button
          onClick={onSendRequest}
          className="flex items-center gap-2 bg-[#1a3a5c] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#162e4a] active:scale-95 transition-all shadow-sm w-fit"
        >
          <Send size={16} />
          Send Review Request
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests Sent"
          value={stats.totalSent}
          icon={<Send size={18} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
        />
        <StatCard
          label="Total Clicked"
          value={stats.totalClicked}
          icon={<MousePointerClick size={18} />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          trend={`${stats.clickRate}%`}
        />
        <StatCard
          label="Est. Reviews"
          value={stats.estimatedReviews}
          icon={<Star size={18} fill="currentColor" />}
          iconBg="bg-yellow-50"
          iconColor="text-yellow-500"
        />
        <StatCard
          label="This Month"
          value={stats.thisMonth}
          icon={<Calendar size={18} />}
          iconBg="bg-purple-50"
          iconColor="text-purple-700"
        />
      </div>

      {/* Click Rate Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">Click Rate</p>
          <p className="text-sm font-bold text-[#1a3a5c]">{stats.clickRate}%</p>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1a3a5c] to-[#3a70a8] rounded-full transition-all duration-700"
            style={{ width: `${Math.min(stats.clickRate, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {stats.totalClicked} out of {stats.totalSent} customers clicked your review link
        </p>
      </div>

      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
          {requests.length > 0 && (
            <p className="text-sm text-gray-400">{requests.length} shown</p>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <Star size={40} className="text-gray-200 mx-auto mb-3" fill="currentColor" />
            <p className="text-gray-500 font-medium">No review requests yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Send your first request to start collecting Google reviews
            </p>
            <button
              onClick={onSendRequest}
              className="mt-4 text-[#1a3a5c] font-semibold text-sm hover:underline"
            >
              Send your first request →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide bg-gray-50">
                      Customer
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide bg-gray-50">
                      Channel
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide bg-gray-50">
                      Sent
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide bg-gray-50">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, idx) => {
                    const statusConfig = STATUS_CONFIG[req.status]
                    return (
                      <tr
                        key={req.id}
                        className={cn(
                          'border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors',
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                        )}
                      >
                        <td className="px-5 py-3.5 font-medium text-gray-900">
                          {req.customerName}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {CHANNEL_LABELS[req.channel] ?? req.channel}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                          {formatDate(req.sentAt)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1',
                              statusConfig.className
                            )}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
