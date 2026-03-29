import { Send, MousePointerClick, Star, Calendar } from 'lucide-react'

interface StatsBarProps {
  totalSent: number
  totalClicked: number
  estimatedReviews: number
  thisMonth: number
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  bgColor: string
}

function StatCard({ label, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`${bgColor} p-3 rounded-xl`}>
        <div className={color}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function StatsBar({
  totalSent,
  totalClicked,
  estimatedReviews,
  thisMonth,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label="Total Requests Sent"
        value={totalSent}
        icon={<Send size={20} />}
        color="text-blue-700"
        bgColor="bg-blue-50"
      />
      <StatCard
        label="Total Clicked"
        value={totalClicked}
        icon={<MousePointerClick size={20} />}
        color="text-emerald-700"
        bgColor="bg-emerald-50"
      />
      <StatCard
        label="Est. Reviews"
        value={estimatedReviews}
        icon={<Star size={20} />}
        color="text-yellow-600"
        bgColor="bg-yellow-50"
      />
      <StatCard
        label="This Month"
        value={thisMonth}
        icon={<Calendar size={20} />}
        color="text-purple-700"
        bgColor="bg-purple-50"
      />
    </div>
  )
}
