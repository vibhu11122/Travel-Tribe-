'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Map, Ticket, Heart, User, Settings, LogOut,
  Compass, Menu, X, ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/format'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/trips', label: 'My Trips', icon: Map },
  { href: '/dashboard/bookings', label: 'Bookings', icon: Ticket },
  { href: '/dashboard/saved', label: 'Saved', icon: Heart },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-navy/10">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-navy/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-orange flex items-center justify-center">
            <Compass className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-headline font-black text-navy text-[15px]">
            <span className="text-orange">T</span>RAVEL·<span className="text-orange">T</span>RIBE
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-navy/40 hover:text-navy lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all',
                active
                  ? 'bg-orange text-white shadow-orange'
                  : 'text-navy/60 hover:bg-cream-dark hover:text-navy'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-navy/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-navy/60 hover:bg-red-50 hover:text-red-600 font-semibold text-sm w-full transition-all"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const currentPage = NAV_ITEMS.find(item =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  )

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-60 lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 shadow-xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-navy/10 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-navy/60 hover:text-navy"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-headline font-black text-navy text-lg">{currentPage?.label || 'Dashboard'}</h1>
          </div>
          <Link href="/trips"
            className="flex items-center gap-1.5 bg-orange text-white font-semibold text-xs px-4 py-2 rounded-pill hover:bg-orange-600 transition-colors">
            <Compass className="w-3.5 h-3.5" /> Explore Trips
          </Link>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
