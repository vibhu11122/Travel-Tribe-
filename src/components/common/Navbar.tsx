'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Compass, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react'
import { cn } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Explore Trips', href: '/trips' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Build My Trip', href: '/build-your-trip' },
  { label: 'Community', href: '/community' },
  { label: 'College Trips', href: '/college-trips' },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group select-none">
      <div className="relative w-8 h-8 rounded-[10px] bg-orange flex items-center justify-center shadow-orange flex-shrink-0">
        <Compass className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <span className="font-headline font-black text-[17px] tracking-wide leading-none">
        <span className="text-orange">T</span>
        <span className="text-navy">RAVEL</span>
        <span className="mx-[3px] text-navy/30">·</span>
        <span className="text-orange">T</span>
        <span className="text-navy">RIBE</span>
      </span>
    </Link>
  )
}

interface UserMenuProps {
  user: SupabaseUser
  onSignOut: () => void
}

function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'TT'
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-pill px-2 py-1.5 hover:bg-navy/5 transition-colors"
        aria-label="User menu"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-orange/30"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-orange-gradient flex items-center justify-center text-white text-xs font-bold font-headline">
            {initials}
          </div>
        )}
        <ChevronDown
          className={cn('w-3.5 h-3.5 text-navy/60 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-heavy border border-navy/8 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-navy/8">
              <p className="text-xs text-navy/50 font-body">Signed in as</p>
              <p className="text-sm text-navy font-semibold font-body truncate">{user.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-navy/5 transition-colors font-body"
              >
                <LayoutDashboard className="w-4 h-4 text-orange" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-navy/5 transition-colors font-body"
              >
                <User className="w-4 h-4 text-orange" />
                My Profile
              </Link>
            </div>
            <div className="border-t border-navy/8 py-1">
              <button
                onClick={() => { setOpen(false); onSignOut() }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-body"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  pathname: string
  user: SupabaseUser | null
  onSignOut: () => void
}

function MobileDrawer({ open, onClose, pathname, user, onSignOut }: MobileDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[82%] max-w-sm bg-cream shadow-heavy flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-navy/10">
              <Logo />
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-md flex items-center justify-center text-navy/70 hover:bg-navy/8 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
              {NAV_LINKS.map((link, i) => {
                const active = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center justify-between w-full px-4 py-3.5 rounded-md text-[15px] font-semibold font-body transition-all',
                        active
                          ? 'bg-orange/10 text-orange'
                          : 'text-navy/80 hover:bg-navy/5 hover:text-navy',
                      )}
                    >
                      {link.label}
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-orange" />}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            <div className="px-6 py-6 border-t border-navy/10 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-orange-gradient flex items-center justify-center text-white text-sm font-bold font-headline flex-shrink-0">
                      {user.email?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-navy truncate">{user.user_metadata?.full_name ?? 'Traveler'}</p>
                      <p className="text-xs text-navy/50 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-md bg-navy text-cream text-sm font-semibold font-body justify-center hover:bg-navy-dark transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => { onClose(); onSignOut() }}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-md border border-red-200 text-red-500 text-sm font-semibold font-body justify-center hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex w-full items-center justify-center px-4 py-3 rounded-md border-2 border-navy/20 text-navy text-sm font-semibold font-body hover:border-navy/40 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/trips"
                    onClick={onClose}
                    className="flex w-full items-center justify-center px-4 py-3 rounded-md bg-orange text-white text-sm font-semibold font-body hover:bg-orange-light transition-colors shadow-orange"
                  >
                    Explore Trips 🔥
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  const supabase = createClient()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  const isTransparentPage =
    pathname === '/' ||
    pathname === '/college-trips' ||
    pathname.startsWith('/destinations/')

  const transparent = isTransparentPage && !scrolled

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300 ease-in-out',
          transparent
            ? 'bg-transparent'
            : 'bg-white/90 backdrop-blur-xl border-b border-navy/8 shadow-card',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">

            <Logo />

            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-3 lg:px-4 py-2 rounded-md text-[13.5px] lg:text-sm font-semibold font-body transition-all duration-200',
                      transparent
                        ? active
                          ? 'text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                        : active
                          ? 'text-orange'
                          : 'text-navy/75 hover:text-navy hover:bg-navy/5',
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-orange"
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {user ? (
                <UserMenu user={user} onSignOut={handleSignOut} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      'px-4 py-2 rounded-md text-sm font-semibold font-body transition-all duration-200',
                      transparent
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-navy/80 hover:text-navy hover:bg-navy/5',
                    )}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/trips"
                    className="px-4 lg:px-5 py-2 rounded-pill bg-orange text-white text-sm font-bold font-body shadow-orange hover:shadow-orange-lg hover:bg-orange-light active:scale-[0.97] transition-all duration-200"
                  >
                    Explore Trips
                  </Link>
                </>
              )}
            </div>

            <button
              className={cn(
                'md:hidden w-9 h-9 flex items-center justify-center rounded-md transition-colors',
                transparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-navy hover:bg-navy/8',
              )}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
        user={user}
        onSignOut={handleSignOut}
      />
    </>
  )
}
