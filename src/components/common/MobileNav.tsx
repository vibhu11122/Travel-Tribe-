'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Compass, Map, Sparkles, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils/format'

interface Tab {
  label: string
  href: string
  icon: React.ElementType
  matchPrefix?: string
}

const TABS: Tab[] = [
  {
    label: 'Explore',
    href: '/trips',
    icon: Compass,
    matchPrefix: '/trips',
  },
  {
    label: 'Trips',
    href: '/destinations',
    icon: Map,
    matchPrefix: '/destinations',
  },
  {
    label: 'Build',
    href: '/build-your-trip',
    icon: Sparkles,
    matchPrefix: '/build-your-trip',
  },
  {
    label: 'Community',
    href: '/community',
    icon: Users,
    matchPrefix: '/community',
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    matchPrefix: '/dashboard',
  },
]

interface TabItemProps {
  tab: Tab
  active: boolean
}

function TabItem({ tab, active }: TabItemProps) {
  const Icon = tab.icon

  return (
    <Link
      href={tab.href}
      className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2 min-w-0 group"
      aria-label={tab.label}
    >
      {active && (
        <motion.div
          layoutId="mobile-nav-pill"
          className="absolute inset-x-2 top-1.5 bottom-1.5 rounded-md bg-orange/12"
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
        />
      )}

      <div className="relative">
        <Icon
          className={cn(
            'w-[22px] h-[22px] transition-all duration-200',
            active
              ? 'text-orange'
              : 'text-navy/45 group-hover:text-navy/70',
          )}
          strokeWidth={active ? 2.5 : 1.75}
        />
        {active && (
          <motion.span
            layoutId="mobile-nav-dot"
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange"
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          />
        )}
      </div>

      <span
        className={cn(
          'text-[10px] font-semibold font-body leading-none transition-all duration-200 truncate max-w-full px-1',
          active ? 'text-orange' : 'text-navy/45 group-hover:text-navy/60',
        )}
      >
        {tab.label}
      </span>
    </Link>
  )
}

export default function MobileNav() {
  const pathname = usePathname()

  function isActive(tab: Tab): boolean {
    const prefix = tab.matchPrefix ?? tab.href
    if (prefix === '/') return pathname === '/'
    return pathname === prefix || pathname.startsWith(prefix + '/')
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30 md:hidden',
        'bg-white/85 backdrop-blur-2xl',
        'border-t border-navy/10',
        'shadow-[0_-4px_24px_rgba(27,58,66,0.10)]',
      )}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch h-[60px] max-w-lg mx-auto">
        {TABS.map((tab) => (
          <TabItem key={tab.href} tab={tab} active={isActive(tab)} />
        ))}
      </div>
    </nav>
  )
}
