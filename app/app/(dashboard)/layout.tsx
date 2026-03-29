import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import Sidebar from '@/components/ui/Sidebar'
import OnboardingModal from '@/components/onboarding/OnboardingModal'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  const needsOnboarding = business && !business.google_place_id

  // Compute days remaining for trial banner
  let trialDaysRemaining: number | null = null
  if (business?.subscription_status === 'trialing' && business?.trial_ends_at) {
    const now = new Date()
    const end = new Date(business.trial_ends_at)
    trialDaysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar businessName={business?.name ?? 'My Business'} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Trial banner */}
        {trialDaysRemaining !== null && trialDaysRemaining > 0 && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Free Trial</span> —{' '}
              {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining
            </p>
            <a
              href="/api/checkout"
              className="text-xs font-semibold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-full transition-colors"
            >
              Upgrade →
            </a>
          </div>
        )}
        {trialDaysRemaining !== null && trialDaysRemaining <= 0 && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2 flex items-center justify-between">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Trial ended.</span> Upgrade to keep sending review requests.
            </p>
            <a
              href="/api/checkout"
              className="text-xs font-semibold text-red-900 bg-red-200 hover:bg-red-300 px-3 py-1 rounded-full transition-colors"
            >
              Upgrade now →
            </a>
          </div>
        )}

        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>

      {/* Onboarding modal — shown once when no Place ID is set */}
      {needsOnboarding && business && (
        <OnboardingModal
          businessId={business.id}
          businessName={business.name}
        />
      )}
    </div>
  )
}
