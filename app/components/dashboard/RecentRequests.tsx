import { type ReviewRequest } from '@/lib/supabase'
import { clsx } from 'clsx'

interface RecentRequestsProps {
  requests: (ReviewRequest & { customers: { name: string } })[]
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

export default function RecentRequests({ requests }: RecentRequestsProps) {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-gray-400 text-sm">No review requests sent yet.</p>
        <p className="text-gray-400 text-sm mt-1">Click &quot;Send Review Request&quot; to get started.</p>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
