import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import Sidebar from '@/components/ui/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get business data (skip redirect for now to debug)
  const { data: business } = session ? await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', session.user.id)
    .single() : { data: null }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar businessName={business?.name ?? 'My Business'} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
