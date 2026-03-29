'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Settings, LogOut, Star } from 'lucide-react'
import { clsx } from 'clsx'
import { createBrowserClient } from '@/lib/supabase-browser'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  businessName: string
}

export default function Sidebar({ businessName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-[#1a3a5c] flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#2c578d]">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" size={20} fill="currentColor" />
          <span className="text-white font-bold text-lg">Revvo</span>
        </div>
        <p className="text-blue-300 text-xs mt-1 truncate">{businessName}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-[#2c578d] text-white'
                  : 'text-blue-200 hover:bg-[#243f5c] hover:text-white'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-[#2c578d]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-blue-300 hover:bg-[#243f5c] hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}


