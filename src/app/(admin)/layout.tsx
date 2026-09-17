'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart2,
  Map,
  Ticket,
  Users,
  Inbox,
  MessageCircle,
  Handshake,
  TrendingUp,
  Compass,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/format'

const ADMIN_NAV = [
  { href: '/admin', label: 'Overview', icon: BarChart2, exact: true },
  { href: '/admin/trips', label: 'Trips & Calendar', icon: Map },
  { href: '/admin/leads', label: 'Inquiries & Leads', icon: Inbox, badge: 'Live' },
  { href: '/admin/whatsapp', label: 'WhatsApp Console', icon: MessageCircle },
  { href: '/admin/bookings', label: 'Bookings', icon: Ticket },
  { href: '/admin/partners', label: 'Partners & Stays', icon: Handshake },
  { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/admin/users', label: 'Users', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  async function handleLogout() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}
    router.push('/login')
    router.refresh()
  }

  const currentNav = ADMIN_NAV.find(item =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  )

  return (
    <div className="min-h-screen flex bg-cream font-body">
      {/* ── Desktop Sidebar ───────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-navy flex-col border-r border-navy/20">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center text-white shadow-orange">
              <Compass className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-headline font-black text-white text-sm tracking-wide block leading-none">
                <span className="text-orange">T</span>RAVEL·<span className="text-orange">T</span>RIBE
              </span>
              <span className="text-[10px] font-bold text-orange uppercase tracking-wider block mt-1">
                Admin Console
              </span>
            </div>
          </Link>
          <span className="p-1 rounded bg-white/10 text-white/70" title="Protected Area">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group',
                  isActive
                    ? 'bg-orange text-white shadow-orange'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    isActive ? 'bg-white text-orange' : 'bg-[#25D366] text-navy'
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Admin
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer ─────────────────────────────────── */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <div className="relative w-64 bg-navy flex flex-col z-10 shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-headline font-black text-white text-sm">TRAVEL TRIBE ADMIN</span>
              <button onClick={() => setMobileNavOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {ADMIN_NAV.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold',
                      isActive ? 'bg-orange text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="p-3 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-300 text-sm font-semibold p-2 w-full"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content Area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-navy/10 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden text-navy/60 hover:text-navy p-1 rounded"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-headline font-black text-navy text-base sm:text-lg leading-tight">
                {currentNav?.label || 'Admin Console'}
              </h1>
              <span className="text-[11px] text-navy/50 font-semibold hidden sm:inline-block">
                The Travel Tribe Management Suite
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/leads"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-[#25D366]/15 text-navy text-xs font-bold hover:bg-[#25D366]/25 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp Webhook: Active</span>
            </Link>

            <Link
              href="/trips"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-cream-dark text-navy text-xs font-bold hover:bg-cream-muted transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-orange" />
              <span className="hidden sm:inline">Live Site</span>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
