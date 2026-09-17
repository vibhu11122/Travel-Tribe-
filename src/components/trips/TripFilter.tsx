'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/format'

interface FilterChip {
  id: string
  label: string
  emoji: string
}

interface TripFilterProps {
  categories: FilterChip[]
  selected: string
  onSelect: (id: string) => void
  className?: string
}

export default function TripFilter({
  categories,
  selected,
  onSelect,
  className,
}: TripFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className={cn('relative', className)}>
      {/* Fade edge right — mobile only */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-cream to-transparent z-10 md:hidden" />

      <div
        ref={scrollRef}
        className="flex items-center gap-2.5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((chip) => {
          const isActive = chip.id === selected
          return (
            <button
              key={chip.id}
              onClick={() => onSelect(chip.id)}
              className={cn(
                'relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold font-[var(--font-nunito)] whitespace-nowrap flex-shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2',
                isActive ? 'text-white' : 'bg-navy/5 text-navy/60 hover:bg-navy/10 hover:text-navy',
              )}
            >
              {/* Animated background pill */}
              {isActive && (
                <motion.span
                  layoutId="trip-filter-pill"
                  className="absolute inset-0 rounded-full bg-navy"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-base leading-none">{chip.emoji}</span>
              <span className="relative z-10">{chip.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
